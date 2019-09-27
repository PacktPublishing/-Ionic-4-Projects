import { Component, OnDestroy } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { mockImage } from './mock-image';
import { VisionService } from '../vision.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, takeUntil } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnDestroy {
    currentImage;
    tags;
    lastUpload;

    unsubscribe$ = new Subject();

    constructor(
        private camera: Camera,
        private platform: Platform,
        private vision: VisionService,
        private afStorage: AngularFireStorage,
        private db: AngularFirestore,
        private toast: ToastController
    ) {
        this.getLastUploaded()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(data => {
                this.lastUpload = data;
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async takePicture() {
        const option: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        try {
            let imageData;
            if (this.platform.is('android')) {
                console.log('this.platform', this.platform);
                imageData = await this.camera.getPicture(option);
            } else {
                imageData = mockImage;
            }
            this.currentImage = 'data:image/jpeg;base64,' + imageData;
            const result = await this.vision.getLabels(imageData);
            console.log('result', result);
            this.tags = result.responses[0].labelAnnotations;
        } catch (err) {
            console.log('error', err);
        }
    }

    save() {
        const file = this.currentImage;
        const path = 'photos/' + Date.now(); // 'photos/1565797855857'
        const task = this.afStorage.ref(path).putString(file, 'data_url');
        task.snapshotChanges()
            .pipe(
                finalize(() => {
                    const fileRef = this.afStorage.ref(path);
                    fileRef
                        .getDownloadURL()
                        .pipe(
                            map(async url => {
                                await this.db
                                    .collection('photos')
                                    .doc(this.tags[0].description)
                                    .set({
                                        name: this.tags[0].description
                                    });

                                await this.db
                                    .collection('photos')
                                    .doc(this.tags[0].description)
                                    .collection('photos')
                                    .add({
                                        image: url
                                    });

                                // save last uploaded image
                                await this.db
                                    .collection('lastUpload')
                                    .doc('post')
                                    .set({
                                        image: url
                                    });

                                this.toast.create({
                                    header: 'Saved',
                                    position: 'top'
                                });
                            })
                        )
                        .subscribe();
                })
            )
            .subscribe();
    }

    getLastUploaded() {
        return this.db
            .doc('lastUpload/post')
            .snapshotChanges()
            .pipe(
                map(data => {
                    if (data.payload.exists) {
                        return data.payload.data();
                    } else {
                        return null;
                    }
                })
            );
    }
}

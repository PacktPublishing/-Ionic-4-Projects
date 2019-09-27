import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Inventory } from './model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    inventories$ = new BehaviorSubject<Inventory[]>([]);
    lowInventories$: Observable<Inventory[]> = this.db
        .collection('inventory', ref => ref.where('notification', '==', true))
        .snapshotChanges()
        .pipe(
            map(actions =>
                actions.map(
                    i => ({ id: i.payload.doc.id, ...i.payload.doc.data() } as Inventory)
                )
            )
        );

    constructor(
        private http: HttpClient,
        private db: AngularFirestore,
        private afStorage: AngularFireStorage,
        private toast: ToastController
    ) {
        this.getInventories();
    }

    getInventories() {
        this.db
            .collection('inventory')
            .snapshotChanges()
            .pipe(
                map(actions =>
                    actions.map(action => {
                        return {
                            id: action.payload.doc.id,
                            ...action.payload.doc.data()
                        } as Inventory;
                    })
                )
            )
            .subscribe((inventories: Inventory[]) => {
                console.log("inventories we're adding", inventories);
                this.inventories$.next(inventories);
            });
    }

    getById(id) {
        return this.inventories$.pipe(
            map(inventories => inventories.find(i => i.id === id))
        );
    }

    getByCode(code) {
        return this.inventories$.pipe(
            map(inventories => inventories.find(i => i.code === code))
        );
    }

    async saveInventory(
        inventory: Inventory,
        imgBlob?,
        imageType?: 'base64' | 'blob'
    ): Promise<any> {
        console.log('...saving', inventory);
        inventory = this.copy(inventory);

        if (imgBlob && imageType) {
            const filePath = Date.now().toString();
            const fileRef = this.afStorage.ref(filePath);
            console.log('fileRef', fileRef, filePath);
            let task;
            if (imageType === 'blob') {
                task = this.afStorage.upload(filePath, imgBlob);
            } else if (imageType === 'base64') {
                task = fileRef.putString(imgBlob, 'data_url');
            }
            console.log('afStorage.task', task);

            // get notified when the download URL is available
            const imageUrl = await task
                .then()
                .then(() => Promise.resolve(fileRef.getDownloadURL().toPromise()));
            console.log('imageUrl', imageUrl);
            inventory.imageUrl = imageUrl;
        }

        let saving;
        if (inventory.id) {
            saving = this.db
                .collection('inventory')
                .doc(inventory.id)
                .set(inventory)
                .catch(err => {
                    this.toast.create({
                        header: 'Error',
                        message: JSON.stringify(err)
                    });
                });
        } else {
            saving = this.db
                .collection('inventory')
                .add(inventory)
                .catch(err => {
                    this.toast.create({
                        header: 'Error',
                        message: JSON.stringify(err)
                    });
                });
        }
        return saving;
    }

    copy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    async deleteInventory(id) {
        return this.db
            .collection('inventory')
            .doc(id)
            .delete();
    }

    notifyRestock() {
        this.http
            .get('https://us-central1-stockcheck-app.cloudfunctions.net/notifyRestock')
            .subscribe();
    }
}

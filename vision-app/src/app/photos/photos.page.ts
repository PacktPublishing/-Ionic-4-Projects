import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-photos',
    templateUrl: './photos.page.html',
    styleUrls: ['./photos.page.scss']
})
export class PhotosPage implements OnInit {
    folderName;
    photos$;
    constructor(private route: ActivatedRoute, private db: AngularFirestore) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.route.paramMap.subscribe(params => {
            this.folderName = params.get('id');

            this.photos$ = this.db
                .collection('photos')
                .doc(this.folderName)
                .collection('photos')
                .valueChanges()
                .pipe(tap(data => console.log('data from database', data)));
        });
    }
}

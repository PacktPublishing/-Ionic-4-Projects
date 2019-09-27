import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, map } from 'rxjs/operators';

@Component({
    selector: 'app-folders',
    templateUrl: './folders.page.html',
    styleUrls: ['./folders.page.scss']
})
export class FoldersPage implements OnInit {
    folders$;

    constructor(private db: AngularFirestore) {}

    ngOnInit() {}

    ionViewWillEnter() {
        this.folders$ = this.db.collection('photos').valueChanges();
    }
}

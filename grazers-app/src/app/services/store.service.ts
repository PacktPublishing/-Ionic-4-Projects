import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    stores$ = this.db.collection('stores').valueChanges();

    constructor(private db: AngularFirestore) {}
}

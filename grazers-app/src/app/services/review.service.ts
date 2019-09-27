import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Review } from './model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    constructor(
        private db: AngularFirestore,
        private auth: AuthService,
        private afStorage: AngularFireStorage
    ) {}

    getReviewsFor(store): Observable<Review[]> {
        return this.db
            .collection<Review>('review', ref => ref.where('storeId', '==', store.email))
            .valueChanges();
    }

    async postReview(review: Review, imgBlob?) {
        review.timestamp = Date.now();
        review.userName = this.auth.currentUser.name;

        if (review.image) {
            const filePath = Date.now().toString();
            const fileRef = this.afStorage.ref(filePath);
            console.log('fileRef', fileRef, filePath);
            let task;
            task = this.afStorage.upload(filePath, imgBlob);
            const imageUrl = await task
                .then()
                .then(() => Promise.resolve(fileRef.getDownloadURL().toPromise()));
            console.log('imageUrl', imageUrl);
            review.image = imageUrl;
        }

        return this.db.collection('review').add(review);
    }
}

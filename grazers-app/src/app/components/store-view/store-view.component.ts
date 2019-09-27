import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Store, Review } from '../../services/model';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ReviewService } from 'src/app/services/review.service';

@Component({
    selector: 'app-store-view',
    templateUrl: './store-view.component.html',
    styleUrls: ['./store-view.component.scss']
})
export class StoreViewComponent implements OnInit {
    @Input() store: Store;
    @ViewChild('imageUpload', { static: false }) imageUpload;
    @ViewChild('content', { static: false }) content;
    @ViewChild('reviewStars', { static: false }) reviewStars;

    state = {
        addingReview: false
    };

    currentReview: Review = {
        text: '',
        stars: 0,
        image: ''
    };

    storeReviews;
    fiveStar = Array(5);

    constructor(
        private modal: ModalController,
        private auth: AuthService,
        private router: Router,
        private review: ReviewService
    ) {}

    ngOnInit() {
        console.log('this.store view loaded', this.store);
        this.storeReviews = this.review.getReviewsFor(this.store);
    }

    dismissModal() {
        this.modal.dismiss();
    }

    goToChat() {
        this.dismissModal();
        this.router.navigate(['chat'], {
            queryParams: {
                targetName: this.store.name,
                users: `${this.store.email},${this.auth.currentUser.email}`
            }
        });
    }

    getPreviewImage() {
        if (this.store.images && this.store.images.length) {
            return this.store.images;
        } else {
            return ['assets/placeholder.png'];
        }
    }

    launchImageUpload() {
        this.imageUpload.nativeElement.click();
    }

    uploadImage(el) {
        const preview = URL.createObjectURL(el.files[0]);
        console.log('uploadImage()', el.files[0], URL.createObjectURL(el.files[0]));
        this.currentReview.image = preview; // this is not the actual saved image yet
    }

    scrollTo(element) {
        setTimeout(() => {
            console.log('this.content', this.content.el, this.reviewStars);
            const y = this.reviewStars.el.offsetTop;
            this.content.el.scrollToPoint(0, y, 200);
        }, 100);
    }

    postReview() {
        const payload = JSON.parse(JSON.stringify(this.currentReview));
        payload.storeId = this.store.email;
        this.review
            .postReview(payload, this.imageUpload.nativeElement.files[0])
            .then(done => {
                this.state.addingReview = false;
                this.currentReview = {
                    text: '',
                    stars: 0,
                    image: ''
                };
            });
    }
}

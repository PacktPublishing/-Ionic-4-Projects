import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { take, mergeMap } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Injectable({
    providedIn: 'root'
})
export class FcmService implements OnInit {
    constructor(
        private afMessaging: AngularFireMessaging,
        private auth: AuthService,
        private toast: ToastController,
        private router: Router
    ) {}

    ngOnInit() {
        const messaging = firebase.messaging();
        messaging.usePublicVapidKey(environment.firebaseConfig.vapidKey);
        this.afMessaging.messaging.subscribe(message => {
            console.log('message', message);
            message.onMessage = message.onMessage.bind(message);
            message.onTokenRefresh = message.onTokenRefresh.bind(message);
        });
    }

    /**
     * update token in firebase database
     *
     * @param userId userId as a key
     * @param token token as a value
     */
    updateToken(token) {
        console.log('fcm token');
        return this.auth.updateToken(token);
    }

    /**
     * request permission for notification from firebase cloud messaging
     *
     * @param userId userId
     */
    requestPermission() {
        // This merges both request permission, and watch tokenOnChanges
        this.afMessaging.requestToken.subscribe(
            token => {
                console.log('token', token);
                this.updateToken(token)
                    .pipe(take(1))
                    .subscribe(
                        data => {
                            console.log('requestPermission: ', data);
                        },
                        err => {
                            console.log('requestPermission request token error: ', err);
                        }
                    );
                this.receiveMessage();
            },
            err => {
                console.log('requestPermission error: ', err);
            }
        );
    }

    /**
     * hook method when new notification received in foreground
     */
    receiveMessage() {
        this.afMessaging.messages.subscribe(
            async payload => {
                console.log('new message received. ', payload);
                const toast = await this.toast.create({
                    header: payload['notification'].title,
                    message: payload['notification'].body,
                    position: 'top',
                    color: 'secondary',
                    buttons: [
                        {
                            text: 'View',
                            handler: () => this.router.navigate(['notifications'])
                        }
                    ]
                });
                toast.present();
            },
            err => {
                console.log('receiveMessage: ', err);
            }
        );
    }

    deleteToken() {
        this.afMessaging.getToken
            .pipe(mergeMap(token => this.afMessaging.deleteToken(token)))
            .subscribe(
                token => {
                    console.log('Deleted!');
                    this.updateToken('')
                        .pipe(take(1))
                        .subscribe(
                            data => {
                                console.log('deleteToken: ', data);
                            },
                            err => {
                                console.log('deleteToken error: ', err);
                            }
                        );
                },
                err => {
                    console.log('deleteToken getToken error: ', err);
                }
            );
    }
}

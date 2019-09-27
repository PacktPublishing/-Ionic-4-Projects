import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { UserProfile } from './model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { concatMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit {
    user$ = new BehaviorSubject<UserProfile>(null);

    auth = this.afAuth;

    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFirestore,
        private router: Router,
        private toast: ToastController
    ) {}

    ngOnInit() {}

    initAuthState() {
        this.afAuth.auth.onAuthStateChanged(user => {
            console.log('auth.user', user);
            if (!user) {
                this.router.navigate(['login']);
            } else {
                // try to get the profile
                this.getUser(user.email).subscribe(
                    profileSnapshot => {
                        if (profileSnapshot.exists) {
                            this.user$.next(profileSnapshot.data() as UserProfile);
                            this.router.navigate(['']); // go to home after login
                            console.log('user', this.user$.getValue());
                        } else {
                            // if signed in, but no profile exist, go to register
                            // happens if signed in with Google without registration first
                            console.log('authUser no profile');
                            this.router.navigate(['register']);
                        }
                    },
                    err => console.log('ERROR', err)
                );
            }
        });
    }

    watchProfile() {
        return this.afAuth.user.pipe(
            concatMap(user =>
                this.db
                    .collection('users')
                    .doc(user.email)
                    .valueChanges()
            )
        );
    }

    getAfAuthUser() {
        return this.afAuth.user;
    }

    get currentUser() {
        return this.user$.getValue(); // doesn't get updated if database changes
    }

    getUser(email) {
        return this.db
            .collection('users')
            .doc(email)
            .get();
    }

    signIn(email, password) {
        this.afAuth.auth
            .signInWithEmailAndPassword(email, password)
            .then(data => console.log('login email', data))
            .catch(err => {
                this.handleError(err);
            });
    }

    signInWithGoogle() {
        const provider = new auth.GoogleAuthProvider();
        this.afAuth.auth
            .signInWithPopup(provider)
            .then(data => console.log('login google', data))
            .catch(err => {
                this.handleError(err);
            });
    }

    register(user) {
        this.afAuth.auth
            .createUserWithEmailAndPassword(user.email, user.password)
            .then(async res => {
                console.log('create complete', res);
                await this.createUser(user.email, user.name);
                this.user$.next({
                    email: user.email,
                    name: user.name,
                    notification: false
                });
                this.router.navigate(['']);
            })
            .catch(err => {
                this.handleError(err);
            });
    }

    registerWithGoogle() {
        return this.afAuth.auth
            .signInWithPopup(new auth.GoogleAuthProvider())
            .then(async res => {
                console.log('create with google', res);
                await this.createUser(res.user.email, res.user.displayName);
                this.user$.next({
                    email: res.user.email,
                    name: res.user.displayName,
                    notification: false
                });
                this.router.navigate(['']);
            })
            .catch(err => {
                this.handleError(err);
            });
    }

    signOut() {
        this.afAuth.auth.signOut();
        window.location.reload();
    }

    createUser(email, name) {
        return this.db
            .collection('users')
            .doc(email)
            .set({ email, name, notification: false });
    }

    async handleError(err) {
        console.log('create toast', err);
        const toast = await this.toast.create({
            message: err.message,
            color: 'danger',
            position: 'top',
            duration: 3000
        });
        toast.present();
    }
}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { combineLatest, of, BehaviorSubject } from 'rxjs';
import { auth } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfile } from './model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user$ = new BehaviorSubject<UserProfile>(null);

    constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
        this.afAuth.user
            .pipe(
                concatMap(user => {
                    if (!user) {
                        throw Error;
                    }
                    return combineLatest([
                        this.db
                            .collection('users')
                            .doc(user.email)
                            .get(),
                        of(user)
                    ]);
                })
            )
            .subscribe(
                ([profileSnapshot, user]) => {
                    console.log('user', profileSnapshot.data(), user);
                    if (profileSnapshot.exists) {
                        this.user$.next(profileSnapshot.data() as UserProfile);
                    } else {
                        this.user$.next({
                            email: user.email
                        });
                        this.createUser(user.email);
                    }
                },
                err => this.signIn()
            );
    }

    isAdmin$() {
        return this.user$.pipe(map(u => u && u.isAdmin));
    }

    signIn() {
        const provider = new auth.GoogleAuthProvider();
        this.afAuth.auth.signInWithRedirect(provider);
    }

    signOut() {
        this.afAuth.auth.signOut();
    }

    createUser(email) {
        return this.db
            .collection('users')
            .doc(email)
            .set({ email, isAdmin: false });
    }

    updateToken(token) {
        return this.user$.pipe(
            switchMap(user => {
                const payload: UserProfile = {
                    email: user.email,
                    token
                };
                console.log('update token', payload);
                return this.updateUser(payload);
            })
        );
    }

    updateUser(user: UserProfile) {
        console.log('update user', user);
        return this.db
            .collection('users')
            .doc(user.email)
            .update(user);
    }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map, skip, concatMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserProfile, ChatRoom, ChatMessage } from './model';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private db: AngularFirestore, private auth: AuthService) {}

    getChatsFor$(): Observable<ChatRoom[]> {
        return this.auth
            .getAfAuthUser()
            .pipe(
                concatMap(user =>
                    this.db
                        .collection<ChatRoom>('messages', ref =>
                            ref.where(`users.${this.stripDots(user.email)}`, '==', true)
                        )
                        .valueChanges()
                )
            );
    }

    getMessages(id) {
        return this.db
            .collection(`messages/${id}/messages`, ref =>
                ref.orderBy('timestamp', 'desc')
            )
            .valueChanges()
            .pipe(tap(data => console.log('messages$', data)));
    }

    getChatroom(user1, user2) {
        return this.db
            .collection('messages', ref =>
                ref
                    .where(`users.${this.stripDots(user1)}`, '==', true)
                    .where(`users.${this.stripDots(user2)}`, '==', true)
            )
            .get()
            .toPromise();
    }

    createNewChatroom(id, storename, user1, user2) {
        return this.db
            .collection('messages')
            .doc(id)
            .set({
                names: [storename, this.auth.currentUser.name],
                users: {
                    [this.stripDots(user1)]: true,
                    [this.stripDots(user2)]: true
                }
            });
    }

    sendMessage(id, sender, text) {
        return this.db
            .collection('messages')
            .doc(id)
            .collection('messages')
            .add({
                sender,
                text,
                timestamp: Date.now()
            });
    }

    private stripDots(str) {
        return str.replace('.', '');
    }

    watchForNewMessages(user) {
        this.db
            .collection<ChatRoom>('messages', ref =>
                ref.where(`users.${this.stripDots(user.email)}`, '==', true)
            )
            .snapshotChanges()
            .pipe(
                map(chatrooms =>
                    chatrooms.forEach(chatroom => {
                        this.db
                            .collection(`messages/${chatroom.payload.doc.id}/messages`)
                            .stateChanges()
                            .pipe(skip(1)) // skip initial load when app startsup
                            .subscribe(data => {
                                data.forEach(action => {
                                    console.log(
                                        'new message action',
                                        action.payload.type,
                                        action.payload.doc.data()
                                    );
                                    const type = action.payload.type;
                                    const message = action.payload.doc.data() as ChatMessage;
                                    if (
                                        type === 'added' &&
                                        message.sender !== user.email
                                    ) {
                                        this.setNotification(true);
                                    }
                                });
                            });
                    })
                )
            )
            .subscribe();
    }

    watchNotification(user): Observable<boolean> {
        return this.db
            .collection('users')
            .doc(user.email)
            .valueChanges()
            .pipe(map((profile: UserProfile) => profile.notification));
    }

    setNotification(bool) {
        this.db
            .collection('users')
            .doc(this.auth.currentUser.email)
            .update({ notification: bool });
    }
}

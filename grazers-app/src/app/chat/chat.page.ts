import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs/operators';
import { combineLatest, forkJoin } from 'rxjs';
import { ChatService } from '../services/chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {
    text;
    users;
    currentUserEmail;
    targetName;

    documentId;
    messages$;

    constructor(
        private route: ActivatedRoute,
        private db: AngularFirestore,
        private auth: AuthService,
        private chat: ChatService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(async params => {
            const user = this.auth.currentUser;
            console.log('params', params);
            if (params && params.users) {
                this.users = params.users.split(',');
                this.targetName = params.targetName;
                this.currentUserEmail = user.email;
                const currentChatroom = await this.chat.getChatroom(
                    this.users[0],
                    this.users[1]
                );
                console.log('params', this.users, currentChatroom.docs);
                if (currentChatroom.docs.length) {
                    this.documentId = currentChatroom.docs[0].id;
                } else {
                    await this.createIfNew();
                }
                this.messages$ = this.chat.getMessages(this.documentId);
            }
        });
    }

    createIfNew() {
        this.documentId = this.db.createId();
        return this.chat.createNewChatroom(
            this.documentId,
            this.targetName,
            this.users[0],
            this.users[1]
        );
    }

    async sendMessage() {
        await this.chat.sendMessage(this.documentId, this.currentUserEmail, this.text);
        this.text = '';
    }
}

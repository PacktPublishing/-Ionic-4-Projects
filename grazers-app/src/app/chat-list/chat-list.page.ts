import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { ChatRoom } from '../services/model';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.page.html',
    styleUrls: ['./chat-list.page.scss']
})
export class ChatListPage implements OnInit {
    chats$: Observable<ChatRoom[]> = this.chat
        .getChatsFor$()
        .pipe(tap(chats => console.log('chat list', chats)));

    constructor(
        private chat: ChatService,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        // set notification to false everytime we enter chat list
        // user would have seen new messages
        this.route.params.subscribe(params => {
            console.log('set notification false');
            this.chat.setNotification(false);
        });
    }

    ngOnInit() {}

    goToChat(chat) {
        this.router.navigate(['chat'], {
            queryParams: {
                targetName: this.getChatTarget(chat),
                users: Object.keys(chat.users).join(',')
            }
        });
    }

    getChatTarget(chat: ChatRoom) {
        return chat.names.filter(n => n !== this.auth.currentUser.name)[0];
    }
}

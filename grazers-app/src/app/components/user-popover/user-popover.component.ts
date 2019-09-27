import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-user-popover',
    template: `
        <ion-content>
            <ion-list>
                <ion-item lines="none" (click)="signOut()">
                    <ion-label>
                        Log out
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    `,
    styles: ['']
})
export class UserPopoverComponent implements OnInit {
    constructor(private auth: AuthService) {}

    ngOnInit() {}

    signOut() {
        this.auth.signOut();
    }
}

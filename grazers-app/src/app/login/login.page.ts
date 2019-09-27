import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
    email = '';
    password = '';
    constructor(private auth: AuthService) {}

    ngOnInit() {}

    signIn() {
        this.auth.signIn(this.email, this.password);
    }

    signInWithGoogle() {
        this.auth.signInWithGoogle();
    }
}

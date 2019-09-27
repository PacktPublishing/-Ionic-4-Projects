import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
    user = {
        name: '',
        email: '',
        password: ''
    };

    constructor(private auth: AuthService) {}

    ngOnInit() {}

    register() {
        this.auth.register(this.user);
    }

    registerWithGoogle() {
        this.auth.registerWithGoogle();
    }
}

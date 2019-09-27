import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        AngularFireModule.initializeApp({
            apiKey: 'AIzaSyCQZfKpYQ2EzCCM28xkFZE7Ti5vnTqfzc8',
            authDomain: 'vision-app-80dcf.firebaseapp.com',
            databaseURL: 'https://vision-app-80dcf.firebaseio.com',
            projectId: 'vision-app-80dcf',
            storageBucket: 'vision-app-80dcf.appspot.com',
            messagingSenderId: '259527833207',
            appId: '1:259527833207:web:c65e87a120f9c06e'
        }),
        AngularFirestoreModule,
        AngularFireStorageModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

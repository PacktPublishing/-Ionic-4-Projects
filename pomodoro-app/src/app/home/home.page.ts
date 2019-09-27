import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';
import { Insomnia } from '@ionic-native/insomnia/ngx';

const circleR = 80;
const circleDasharray = 2 * Math.PI * circleR;
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    time: BehaviorSubject<string> = new BehaviorSubject('00:00');
    percent: BehaviorSubject<number> = new BehaviorSubject(100);

    timer: number; // in seconds
    interval;

    startDuration = 25;

    circleR = circleR;
    circleDasharray = circleDasharray;

    state: 'start' | 'stop' = 'stop';

    constructor(
        private nativeAudio: NativeAudio,
        private platform: Platform,
        private insomnia: Insomnia
    ) {
        this.platform.ready().then(() => {
            this.nativeAudio.preloadSimple('bell', 'assets/sound/bell.wav');
        });
    }

    startTimer(duration: number) {
        this.insomnia.keepAwake();
        this.state = 'start';
        clearInterval(this.interval);
        this.timer = duration * 60;
        this.updateTimeValue();
        this.interval = setInterval(() => {
            this.updateTimeValue();
        }, 5);
    }

    stopTimer() {
        this.insomnia.allowSleepAgain();
        clearInterval(this.interval);
        this.time.next('00:00');
        this.percent.next(100);
        this.state = 'stop';
    }

    toggleStartStop() {
        if (this.state === 'start') {
            this.stopTimer();
        } else {
            this.startTimer(this.startDuration);
        }
    }

    percentageOffset(percent) {
        const percentFloat = percent / 100;
        return circleDasharray * (1 - percentFloat);
    }

    swapDuration() {
        this.startDuration = this.startDuration === 25 ? 5 : 25;
    }

    updateTimeValue() {
        let minutes: any = this.timer / 60;
        let seconds: any = this.timer % 60;

        minutes = String('0' + Math.floor(minutes)).slice(-2);
        seconds = String('0' + Math.floor(seconds)).slice(-2);

        const text = minutes + ':' + seconds;
        this.time.next(text);

        const totalTime = this.startDuration * 60;
        const percentage = ((totalTime - this.timer) / totalTime) * 100;
        this.percent.next(percentage);

        --this.timer;
        if (this.timer < -1) {
            this.nativeAudio.play('bell');
            this.swapDuration();
            this.startTimer(this.startDuration);
        }
    }
}

/** 6.2.4 is latest as of 5-july-2019 */
importScripts('https://www.gstatic.com/firebasejs/6.4.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.4.2/firebase-messaging.js');

const firebaseConfig = {
    messagingSenderId: '717772510387'
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

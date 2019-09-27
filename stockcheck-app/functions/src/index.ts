import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://stockcheck-app.firebaseio.com'
});

export const notifyRestock = functions.https.onRequest(async (request, response) => {
    const db = admin.firestore();
    const admins = await db
        .collection('users')
        .where('isAdmin', '==', true)
        .get();
    if (admins.docs.length) {
        const body = {
            notification: {
                title: 'New notification',
                body: 'Some items require restock',
                click_action: 'http://localhost:8100/notifications'
            },
            to: admins.docs[0].data().token
        };
        return axios
            .post('https://fcm.googleapis.com/fcm/send', body, {
                headers: {
                    Authorization:
                        'key=AAAApx6TVLM:APA91bFLe-0QyGqwk3ctRjVn9S1LF1Z8Q6UYvqLVKrX0CLHW1zOyK_ysj3wth46dDuKyUJ3OdkAmg9UgJ7A6nMiPDpK-f1zNsmBgMB0hFiwmlgdIgaJcSSMfpaiEBfkMqKGEhDGhI8bu'
                }
            })
            .then(res => {
                console.log(res.data);
                return response.status(200).json({
                    message: res.data.ip
                });
            })
            .catch(err => {
                return response.status(400).json({
                    error: err
                });
            });
    } else {
        return response.status(400).json({
            message: 'No admins found'
        });
    }
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

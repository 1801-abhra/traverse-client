import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCPWTTudaVUIa8ZYJA6BE8SiWALq3RzAwQ",
    authDomain: "traverse-unicab.firebaseapp.com",
    projectId: "traverse-unicab",
    storageBucket: "traverse-unicab.firebasestorage.app",
    messagingSenderId: "224752732964",
    appId: "1:224752732964:web:89aff5f0aa1a505aa081b1"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Show notification when app is open (foreground)
onMessage(messaging, (payload) => {
    console.log('Foreground message:', payload);
    const { title, body } = payload.notification;
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/logo192.png',
            badge: '/logo192.png',
            vibrate: [200, 100, 200]
        });
    }
});

export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: 'BPsoy1HRY-o7w7LJ45aoBkn8BUBbLXaJbRFsuOmBNwszA4dfLOm6CLwqW92_dMV0ZH6lvNv0GoFTk63i2X0qzjc'
            });
            return token;
        }
        return null;
    } catch (error) {
        console.log('Notification permission error:', error);
        return null;
    }
};

export default messaging;
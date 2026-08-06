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

// Handle foreground messages - prevent duplicate with service worker
onMessage(messaging, (payload) => {
    console.log('Foreground message received - handled by app UI');
    // Do NOT show notification here - Socket.io already updates the UI
    // Service worker handles background notifications
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
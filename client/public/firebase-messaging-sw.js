importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Take control immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

firebase.initializeApp({
    apiKey: "AIzaSyCPWTTudaVUIa8ZYJA6BE8SiWALq3RzAwQ",
    authDomain: "traverse-unicab.firebaseapp.com",
    projectId: "traverse-unicab",
    storageBucket: "traverse-unicab.firebasestorage.app",
    messagingSenderId: "224752732964",
    appId: "1:224752732964:web:89aff5f0aa1a505aa081b1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Background message received');
    const { title, body } = payload.notification;
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then(clients => {
            const appIsOpen = clients.some(client => client.visibilityState === 'visible');
            if (!appIsOpen) {
                self.registration.showNotification(title, {
                    body,
                    icon: '/logo192.png',
                    badge: '/logo192.png',
                    vibrate: [200, 100, 200]
                });
            }
        });
});
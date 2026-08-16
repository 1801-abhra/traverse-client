importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

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
    const title = payload.data?.title || 'Traverse';
    const body = payload.data?.body || 'You have a new update';

    self.registration.showNotification(title, {
        body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [200, 100, 200, 100, 200], // Strong vibration pattern
        sound: '/notification.wav', // Custom sound
        tag: 'ride-request', // Prevents duplicate notifications
        requireInteraction: title.includes('New Ride'), // Keeps notification visible for ride requests
        actions: [
            { action: 'open', title: '🚗 View Ride' }
        ]
    });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const url = event.notification.data?.url || '/student';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                // If app is already open, focus it and navigate
                for (const client of clientList) {
                    if (client.url.includes('traverse-unicab') && 'focus' in client) {
                        client.focus();
                        client.navigate(url);
                        return;
                    }
                }
                // If app is closed, open it
                if (clients.openWindow) {
                    return clients.openWindow('https://traverse-unicab.vercel.app' + url);
                }
            })
    );
});
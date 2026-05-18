importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCIun0gRQxgtOquKOv-pIsVakLIxz3XxY8',
  authDomain: 'dernek-80ac4.firebaseapp.com',
  projectId: 'dernek-80ac4',
  storageBucket: 'dernek-80ac4.firebasestorage.app',
  messagingSenderId: '1013133296340',
  appId: '1:1013133296340:web:caa7812edefdce0b93b141',
  measurementId: 'G-5Y1TJR1LFH',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  const notification = payload.notification;
  if (notification) {
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: '/icons/Icon-192.png',
    });
  }
});

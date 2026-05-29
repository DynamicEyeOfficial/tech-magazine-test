importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCZMP8w7d7mzxG-SNa263MqKXE2VbRl6CQ",
  authDomain: "it-magazine-aeb46.firebaseapp.com",
  projectId: "it-magazine-aeb46",
  storageBucket: "it-magazine-aeb46.firebasestorage.app",
  messagingSenderId: "562041561457",
  appId: "1:562041561457:web:cede8a95b4edd1ac5416d0",
  measurementId: "G-3WJ3VLSTKR"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  self.registration.showNotification(notification.title || "Tech Magazine", {
    body: notification.body || "New update from Tech Magazine",
    icon: "/assets/logo.svg",
    data: payload.data || {}
  });
});

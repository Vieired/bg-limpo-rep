self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const title = data.data?.title ?? "Notificação";
  const options = {
    body: data.data?.body,
    image: data.data?.image || undefined,
    icon: "/icon-192.png",
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

/*// Sua config normal do Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCRsQbOu4JUqBODv2MRG0PXz0DTKDRZcXg",
  authDomain: "bg-limpo.firebaseapp.com",
  projectId: "bg-limpo",
  storageBucket: "bg-limpo.firebasestorage.app",
  messagingSenderId: "245775062234",
  appId: "1:245775062234:web:5ad4705676304ef9e301e3",
});*/
/*
// Inicializa o messaging
const messaging = firebase.messaging();

// Notificação quando o app está FECHADO
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const { title, body, icon } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon
  });
});
*/
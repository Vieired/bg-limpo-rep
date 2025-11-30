import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import RoutesHandler from './routes/RoutesHandler';
import { AuthProvider } from './contexts/authContext';
import './App.css'
import GlobalStyle from "./styles/global";
import { useEffect } from 'react';
import {
  messaging,
  // requestNotificationPermission
} from './firebase';
import { onMessage } from 'firebase/messaging';
import { requestNotificationPermission } from './pushNotifications';
// import { onMessage } from 'firebase/messaging';
// import { messaging } from './firebase';
// import { onForegroundMessage, requestNotificationPermission } from './firebase';

function App() {

  useEffect(() => {
    async function initFCM() {
      if ("serviceWorker" in navigator) {
        console.log("🛠 Registrando service worker...");

        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );

        console.log("✅ Service Worker registrado:", registration);

        // Agora sim — só depois do SW — pedir permissão e gerar token
        await requestNotificationPermission();
      }
    }

    initFCM();
  }, []);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("📩 Notificação recebida em foreground:", payload);

      new Notification(payload.notification?.title ?? "Notificação", {
        body: payload.notification?.body,
      });
    });
  }, []);

  return (
    
    <AuthProvider>
      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <GlobalStyle />
      <BrowserRouter>
        {/* <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}> */}
          <RoutesHandler />
        {/* </ErrorBoundary> */}
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

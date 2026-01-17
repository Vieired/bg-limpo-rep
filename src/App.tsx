import { useEffect } from 'react';
import RoutesHandler from './routes/RoutesHandler';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/authContext';
import { onMessage } from 'firebase/messaging';
import { messaging } from './firebase';
// import { requestNotificationPermission } from './pushNotifications';
// import { onForegroundMessage, requestNotificationPermission } from './firebase';
import reactSvg from './assets/react.svg';
import GlobalStyle from "./styles/global";
import './App.css'

function App() {

  // const { loggedIn } = useAuth();

  // useEffect(() => {
  //   if (!loggedIn) return;
    
  //   async function initFCM() {
  //     if ("serviceWorker" in navigator) {
  //       console.log("🛠 Registrando service worker...");

  //       const registration = await navigator.serviceWorker.register(
  //         "/firebase-messaging-sw.js"
  //       );

  //       console.log("✅ Service Worker registrado:", registration);

  //       // Agora sim — só depois do SW — pedir permissão e gerar token
  //       await requestNotificationPermission();
  //     }
  //   }

  //   initFCM();
  // }, [loggedIn]);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("📩 Notificação recebida em foreground:", payload);

      new Notification(payload.notification?.title ?? "Notificação", {
        body: payload.notification?.body,
        icon: reactSvg,
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

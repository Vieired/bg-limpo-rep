import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import RoutesHandler from './routes/RoutesHandler';
import { AuthProvider } from './contexts/authContext';
import './App.css'
import GlobalStyle from "./styles/global";
import { useEffect } from 'react';
import { messaging, requestNotificationPermission } from './firebase';
import { onMessage } from 'firebase/messaging';
// import { requestNotificationPermission } from './pushNotifications';
// import { onMessage } from 'firebase/messaging';
// import { messaging } from './firebase';
// import { onForegroundMessage, requestNotificationPermission } from './firebase';

function App() {

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((reg) => console.log("Service Worker registrado:", reg))
      .catch((err) => console.error("Erro ao registrar SW:", err));
  }

  // useEffect(() => {
  //   requestNotificationPermission()
  //     .then((token) => {
  //       console.log("Token salvo no backend:", token);
  //     })
  //     .catch((err) => console.error(err));

  //   onForegroundMessage((payload) => {
  //     alert(`Notificação recebida: ${payload.notification?.title}`);
  //   });
  // }, []);
  
  useEffect(() => {
    requestNotificationPermission();
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

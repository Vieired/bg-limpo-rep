import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import RoutesHandler from './routes/RoutesHandler';
import { AuthProvider } from './contexts/authContext';
import './App.css'
import GlobalStyle from "./styles/global";

function App() {

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

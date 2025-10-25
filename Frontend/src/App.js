// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import { store } from './App/Store';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import "./index.css";

// Componentes y vistas
import NavigationBar from "./components/NavigationBar";
import Home from "./view/Home";
import Servicios from "./view/Servicios";
import Services from "./view/Services";
import Sitios from "./view/Sitios";
import Historia from "./view/Historias";
import Contacto from "./view/Contacto";
import WhatsAppChat from "./components/whatsappchat";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminRoutes from "./routes/AdminRoutes";
import NotFoundPage from "./view/NotFoundPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserProfile from "./components/UserProfile";
import { useAuthCheck } from "./hooks/useAuthCheck";

// Configuración del tema de Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
  },
});

// Componente para mostrar loading durante la verificación de autenticación
function AuthLoadingOverlay() {
  const isLoading = useSelector(state => state.auth.isLoading);
  
  if (!isLoading) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div 
        style={{
          textAlign: 'center',
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Verificando autenticación...</p>
      </div>
    </div>
  );
}

// Componente wrapper para la verificación de autenticación
function AuthInitializer({ children }) {
  useAuthCheck(); // Verifica la autenticación al cargar la app
  
  return (
    <>
      <AuthLoadingOverlay />
      {children}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <Router>
          <AuthInitializer>
            <div className="App">
              <NavigationBar />
              <div className="content-wrapper">
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<Home />} />
                  <Route path="/hoteles" element={<Servicios />} />
                  <Route path="/sitios" element={<Sitios />} />
                  <Route path="/historia" element={<Historia />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/Services" element={<Services />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/whatsappchat" element={<WhatsAppChat />} />

                  {/* Ruta de perfil de usuario */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute allowedRoles={['user', 'admin', 'superadmin']}>
                        <UserProfile />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Rutas de administración */}
                  <Route path="/admin/*" element={<AdminRoutes />} />

                  {/* Ruta para páginas no encontradas */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </div>
          </AuthInitializer>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
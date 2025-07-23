import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
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
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
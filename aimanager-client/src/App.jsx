import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
//
import { Activities } from "./pages/Activities";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Shop } from "./components/Shop";

function App() {
  return (
    <GoogleOAuthProvider clientId="658709391781-jlaqf3iqgs0uo3qphtgg65mk3vkohlk7.apps.googleusercontent.com">
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* si no está logueado */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* panel principal */}
            <Route path="/activities" element={<Activities />} />
            {/* Ruta para la tienda */}
            <Route path="/shop" element={<Shop />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

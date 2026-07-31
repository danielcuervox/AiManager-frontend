import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
//
import { Activities } from "./pages/Activities";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* si no está logueado */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* panel principal */}
          <Route path="/activities" element={<Activities />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

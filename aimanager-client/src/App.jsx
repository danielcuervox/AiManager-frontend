import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
//
import { Activities } from "./pages/Activities";
import "./App.css";

function App() {
  return (
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
  );
}

export default App;

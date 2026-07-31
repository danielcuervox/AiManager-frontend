import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", response.data);

      navigate("/activities");
    } catch (err) {
      setError("Credenciales incorrectas. Inténtalo de nuevo." + err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    console.log("Token de Google recibido, enviando al backend...");

    try {
      const response = await api.post("/api/auth/google", {
        token: googleToken,
      });
      localStorage.setItem("token", response.data);
      navigate("/activities");
    } catch (err) {
      console.error("Error validando token en el backend", err);
      setError("Error al iniciar sesión con Google.");
    }
  };

  const handleGoogleError = () => {
    console.log("El inicio de sesión con Google falló");
    setError("Error al conectar con Google.");
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            className="p-3 rounded bg-slate-800 border border-slate-700 text-white"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="p-3 rounded bg-slate-800 border border-slate-700 text-white"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 p-3 rounded font-bold transition"
          >
            Entrar
          </button>
          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 p-3 rounded font-bold transition"
            onClick={handleRegisterRedirect}
          >
            Registrarse22
          </button>
          {/* Separador  */}
          <div className="flex items-center my-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="px-3 text-slate-400 text-sm">O</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          {/* 2. Botón de inicio de sesión de Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="rectangular"
              text="signin_with"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

import { React, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await api.post("/api/auth/register", formData);

      alert("Usuario registrado con éxito");
      navigate("/activities");
    } catch (err) {
      setError(
        "Error al registrarse. Asegúrate de que el email no esté ya en uso.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Regístrate</h2>
        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            className="p-3 rounded bg-slate-800 border border-slate-700 text-white"
            type="text"
            placeholder="Nombre"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            className="p-3 rounded bg-slate-800 border border-slate-700 text-white"
            type="text"
            placeholder="Apellido"
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
            required
          />
          <input
            className="p-3 rounded bg-slate-800 border border-slate-700 text-white"
            type="text"
            placeholder="Nombre de usuario"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            className="p-3 rounded bg-slate-800 border border-slate-700 text-white"
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            className="p-3 rounded bg-slate-800 border border-slate-700 text-white"
            type="password"
            placeholder="Contraseña"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <input
            className="p-3 rounded bg-slate-800 border border-slate-700 text-white"
            type="password"
            placeholder="Confirmar contraseña"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition"
          >
            Empezar a usar AI-Manager
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";

export const UserProfile = () => {
  //const [user, setUser] = useState(null);
  const [user, setUser] = useState({
    username: "Daniel",
    coins: 100,
    level: 1,
    avatar: "/images/avatars/default_avatar.jpg",
  });

  /* useEffect(() => {
    // Reemplaza esto con tu llamada real a la API (ej: axios.get('/api/users/me'))
    setUser({
      username: "Daniel",
      coins: 100,
      level: 1,
      avatar: "/assets/avatars/default-caveman.png", // Ruta por defecto que configuramos
    });
  }, []); */

  useEffect(() => {
    fetch("http://localhost:8000/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar la tienda de FastAPI:", err);
        setLoading(false);
      });
  }, []);

  if (!user) return <div className="p-6 text-white">Cargando perfil...</div>;

  return (
    <div className="bg-slate-800 rounded-xl p-3 shadow-lg text-white">
      {/* Contenedor principal en fila: Nombre -> Avatar -> Info */}
      <div className="flex items-center justify-between gap-4">
        {/* 1. Nombre a la izquierda */}
        <h2 className="text-xl font-bold truncate">{user.username}</h2>

        {/* 2. Imagen del Avatar en el centro */}
        <div className="relative w-20 h-20 bg-slate-900 rounded-lg flex items-center justify-center border-2 border-slate-700 overflow-hidden shrink-0">
          <img
            src={user.avatar}
            alt="Avatar del usuario"
            className="w-full h-full object-contain absolute z-10"
          />
        </div>

        {/* 3. Información nivel y coins a la derecha */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="bg-amber-600 px-3 py-1 rounded-full text-xs font-semibold text-center">
            Nivel: {user.level}
          </span>
          <span className="bg-emerald-600 px-3 py-1 rounded-full text-xs font-semibold text-center">
            Coins: {user.coins} 🪙
          </span>
        </div>
      </div>
    </div>
  );
};

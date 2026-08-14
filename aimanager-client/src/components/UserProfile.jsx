import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export const UserProfile = ({ refreshTrigger }) => {
  //const [user, setUser] = useState(null);
  const [user, setUser] = useState(null);
  const { language } = useLanguage();
  const t = {
    level: { en: "Level", fr: "Niveau", de: "Level", es: "Nivel" },
    points: { en: "Points", fr: "Points", de: "Punkte", es: "Puntos" },
    coins: { en: "Coins", fr: "Pièces", de: "Münzen", es: "Monedas" },
    streak: { en: "Streak", fr: "Série", de: "Serie", es: "Racha" },
    tooltipLevel: {
      en: "Your current user level based on experience. You level up every time you reach 100 points. Each level unlocks new items in the shop.",
      fr: "Votre niveau d'utilisateur actuel basé sur l'expérience. Vous montez d'niveau chaque fois que vous atteignez 100 points. Chaque niveau débloque de nouveaux objets dans la boutique.",
      de: "Dein aktuelles Benutzerlevel basierend auf Erfahrung. Du steigst jedes Mal auf, wenn du 100 Punkte erreichst. Jedes Level schaltet neue Gegenstände im Shop frei.",
      es: "Tu nivel actual de usuario basado en experiencia. Subes de nivel cada vez que llegas a 100 puntos. Cada nivel desbloquea nuevas objetos de la tienda.",
    },
    tooltipPoints: {
      en: "Points earned. To level up, you need to create and complete daily activities and chat with your AI Manager.",
      fr: "Points gagnés. Pour monter de niveau, vous devez créer et compléter des activités quotidiennes et discuter avec votre AI Manager.",
      de: "Verdiente Punkte. Um aufzusteigen, musst du tägliche Aktivitäten erstellen und abschließen sowie mit deinem AI Manager chatten.",
      es: "Puntos ganados. Para subir de nivel necesitas crear y completar actividades diarias y chatear con tu AI Manager.",
    },
    tooltipCoins: {
      en: "Coins to spend in the Shop on exclusive items.",
      fr: "Pièces à dépenser dans la boutique pour des objets exclusifs.",
      de: "Münzen, die im Shop für exklusive Gegenstände ausgegeben werden können.",
      es: "Monedas para gastar en la Tienda en artículos exclusivos.",
    },
    tooltipStreak: {
      en: "Consecutive days logging into your ERP AI Manager.",
      fr: "Jours consécutifs de connexion à votre ERP AI Manager.",
      de: "Aufeinanderfolgende Tage, an denen Sie sich in Ihren ERP AI Manager eingeloggt haben.",
      es: "Días consecutivos accediendo a tu ERP Ai Manager.",
    },
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 1. Usamos GET porque tu Backend tiene @GetMapping
        const response = await api.get("/api/get-user");
        setUser(response.data);

        console.log("Perfil del usuario obtenido:", response.data);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
    };

    fetchUserProfile();
  }, [refreshTrigger]);

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
          {/*-Nivel */}
          <div className="relative group flex justify-center">
            <span className="bg-amber-600 px-3 py-1 rounded-full text-xs font-semibold text-center cursor-pointer w-full">
              {t.level[language]}: {user.level} 🎖️
            </span>
            {/* Ventanilla flotante (Tooltip) */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded-lg shadow-xl border border-slate-700 text-center z-50 pointer-events-none">
              {t.tooltipLevel[language]}
            </div>
          </div>
          {/*-Puntos */}
          <div className="relative group flex justify-center">
            <span className="bg-sky-500 px-3 py-1 rounded-full text-xs font-semibold text-center cursor-pointer w-full">
              {t.points[language]}: {user.points} ⭐
            </span>
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded-lg shadow-xl border border-slate-700 text-center z-50 pointer-events-none">
              {t.tooltipPoints[language]}
            </div>
          </div>
          {/*-Monedas */}
          <div className="relative group flex justify-center">
            <span className="bg-emerald-600 px-3 py-1 rounded-full text-xs font-semibold text-center cursor-pointer w-full">
              {t.coins[language]}: {user.coins} 🪙
            </span>
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded-lg shadow-xl border border-slate-700 text-center z-50 pointer-events-none">
              {t.tooltipCoins[language]}
            </div>
          </div>
          {/*-Racha */}
          <div className="relative group flex justify-center">
            <span className="bg-rose-700 px-3 py-1 rounded-full text-xs font-semibold text-center cursor-pointer w-full">
              {t.streak[language]}: {user.streak} 🔥
            </span>
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-slate-200 text-xs rounded-lg shadow-xl border border-slate-700 text-center z-50 pointer-events-none">
              {t.tooltipStreak[language]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

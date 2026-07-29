import React from "react";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export const DailyTimetable = ({ onEdit, refreshTrigger, onDelete }) => {
  const [listActivities, setListActivities] = React.useState([]);

  const handleGetActivities = async (e) => {
    try {
      // obtener fecha actual
      //const currentDate = new Date().toISOString().split("T")[0];
      //const currentDate = new Date().toLocaleDateString("en-CA");
      //const currentDate = "2026-06-25";
      const response = await api.get(`/api/activities/today`);
      setListActivities(response.data);
      console.log("Actividades obtenidas:", response.data);
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
    }
  };

  const getColorClass = (result, done) => {
    if (result === 0 || done === false) return "bg-cyan-200 text-black"; // Blanco
    if (result === 0 && done === true) return "bg-red-600 text-white"; // Rojo intenso
    if (result === 25) return "bg-red-400 text-white"; // Rojo suave
    if (result === 50) return "bg-orange-400 text-black"; // Naranja
    if (result === 75) return "bg-yellow-400 text-black"; // Amarillo
    if (result === 100) return "bg-green-500 text-white"; // Verde
    return "bg-gray-100"; // Por defecto
  };

  //con esto carga automátiamente al abrir la ventana
  React.useEffect(() => {
    handleGetActivities();
  }, [refreshTrigger]);

  const { language } = useLanguage();

  return (
    <div className="p-4 erp-main-display rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">
        {language === "en"
          ? "Activities for today"
          : language === "fr"
            ? "Activités d'aujourd'hui"
            : language === "de"
              ? "Aktivitäten für heute"
              : "Actividades para hoy"}
      </h2>
      <ul className="space-y-3">
        {Array.isArray(listActivities) &&
          listActivities.map((act) => (
            <li
              key={act.id}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-3 gap-3 border rounded shadow-sm ${getColorClass(act.result, act.done)}`}
            >
              {/* Información principal */}
              <div className="flex flex-wrap items-center gap-2 md:gap-4 font-mono font-bold w-full md:w-auto">
                <span className="w-14 text-sm md:text-base">{act.time}</span>
                <span className="hidden md:inline">|</span>
                <span
                  className="max-w-[200px] md:w-56 truncate text-sm md:text-xl"
                  title={act.description}
                >
                  | {act.description} |
                </span>
                <span className="opacity-70 text-xs md:text-sm">
                  (
                  {act.category
                    ? act.category.categoryName
                    : language === "en"
                      ? "Uncategorized"
                      : language === "fr"
                        ? "Sans catégorie"
                        : language === "de"
                          ? "Ohne Kategorie"
                          : "Sin categoría"}
                  ) |
                </span>
                <span className="hidden md:inline">|</span>
                <span className="text-xs md:text-sm">{act.result}%</span>
              </div>

              {/* Botones a la derecha / abajo en móvil */}
              <div className="flex gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-black/10 dark:border-white/10">
                <button
                  onClick={() => onEdit(act)}
                  className="erp-button-small erp-button-light-green px-3 py-1 text-xs md:text-sm"
                >
                  {language === "en"
                    ? "Edit"
                    : language === "fr"
                      ? "Modifier"
                      : language === "de"
                        ? "Bearbeiten"
                        : "Editar"}
                </button>
                <button
                  onClick={() => onDelete(act.id)}
                  className="erp-button-small erp-button-red px-3 py-1 text-xs md:text-sm"
                >
                  {language === "en"
                    ? "Delete"
                    : language === "fr"
                      ? "Supprimer"
                      : language === "de"
                        ? "Löschen"
                        : "Eliminar"}
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

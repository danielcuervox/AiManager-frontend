import React from "react";
import api from "../api/api";

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

  return (
    <div className="p-4 erp-main-display rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">
        Activities for today
      </h2>
      <ul className="space-y-2">
        {Array.isArray(listActivities) &&
          listActivities.map((act) => (
            <li
              key={act.id}
              className={`flex items-center justify-between p-2 border rounded shadow-sm ${getColorClass(act.result, act.done)}`}
            >
              {/* Información a la izquierda */}
              <div className="flex items-center gap-6 font-mono font-bold">
                <span className="w-16">{act.time}</span> |
                <span className="w-48 truncate">{act.description}</span>
                <span className="opacity-70 text-sm">
                  ({act.category ? act.category.categoryName : "Sin categoría"})
                </span>{" "}
                |<span className="text-sm">{act.result}%</span>
              </div>

              {/* Botones a la derecha */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(act)}
                  className="erp-button-small erp-button-light-green px-3"
                >
                  Check
                </button>
                <button
                  onClick={() => onDelete(act.id)}
                  className="erp-button-small erp-button-red px-3"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

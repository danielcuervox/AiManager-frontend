import React from "react";
import { useState } from "react";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export const WeeklyObjectiveModal = ({ onClose, onRefresh }) => {
  const [formWeeklyData, setFormWeeklyData] = useState({
    id: null,
    weeklyTargetName: "",
    weeklyTargetHours: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  const [listWeeklyObjectives, setListWeeklyObjectives] = React.useState([]);
  /*  const handleRefresh = () => {
    setListWeeklyObjectives((prev) => [...prev]);
  }; */

  const handleGetWeeklyObjectives = async (e) => {
    try {
      console.log("inicio de peticion weekly goals");
      const response = await api.get(`/api/get-weekly-goals`);
      setListWeeklyObjectives(response.data);
      console.log("Actividades obtenidas:", response.data);
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("¡Formulario enviado! Datos:", formWeeklyData);

    console.log(
      "Token recuperado de localStorage:",
      localStorage.getItem("token"),
    );
    console.log(
      "¿La instancia 'api' tiene interceptores?",
      api.interceptors.request.handlers.length > 0,
    );

    let response;
    try {
      if (isEditing) {
        response = await api.put(
          `/api/weekly-goal/${formWeeklyData.id}`,
          formWeeklyData,
        );
      } else {
        response = await api.post("/api/weekly-goal", formWeeklyData);
      }

      console.log("Éxito:", response.data);
      onRefresh();
      //onClose();
      clearInputs();
    } catch (error) {
      console.error("Error crítico:", error);
      alert("Error: " + error.message);
    }
  };

  const handleEdit = async (weeklyGoalId) => {
    //colocar la informacion de la actividad en el formulario para editarla en el input

    try {
      const weeklyGoal = listWeeklyObjectives.find(
        (obj) => obj.id === weeklyGoalId,
      );

      if (weeklyGoal) {
        console.log("Objetivo semanal encontrado para editar:", weeklyGoal);

        setFormWeeklyData({
          id: weeklyGoal.id,
          weeklyTargetName: weeklyGoal.weeklyTargetName,
          weeklyTargetHours: weeklyGoal.weeklyTargetHours,
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error al buscar el objetivo semanal:", error);
    }
  };

  const handleDelete = async (weeklyGoalId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta actividad?")
    ) {
      console.log(
        "Token recuperado de localStorage:",
        localStorage.getItem("token"),
      );
      try {
        await api.delete(`/api/weekly-goal/${weeklyGoalId}`);
        onRefresh();
      } catch (error) {
        console.error("Error at deleting weekly goal:", error);
      }
    }
  };

  const clearInputs = () => {
    setFormWeeklyData({
      weeklyTargetName: "",
      weeklyTargetHours: 0,
    });
    setIsEditing(false);
  };

  const { language } = useLanguage();

  //con esto carga automátiamente al abrir la ventana
  React.useEffect(() => {
    handleGetWeeklyObjectives();
  }, [onRefresh]); // Dependencia para refrescar la lista cuando se agregue un nuevo objetivo semanal

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="erp-main-display p-6 rounded-xl shadow-2xl w-full max-w-md bg-gray-900 border border-cyan-400">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
          {language === "en"
            ? "New Weekly Goal"
            : language === "fr"
              ? "Nouvel objectif hebdomadaire"
              : language === "de"
                ? "Neues wöchentliches Ziel"
                : "Nuevo objetivo semanal"}{" "}
        </h2>

        {/* se usa un formulario HTML puro para que el navegador controle el submit */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Actividad..."
              className="flex-grow p-3 bg-white text-black rounded"
              value={formWeeklyData.weeklyTargetName}
              onChange={(e) =>
                setFormWeeklyData({
                  ...formWeeklyData,
                  weeklyTargetName: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Horas"
              className="w-24 p-3 bg-white text-black rounded"
              value={formWeeklyData.weeklyTargetHours}
              onChange={(e) =>
                setFormWeeklyData({
                  ...formWeeklyData,
                  weeklyTargetHours: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
            >
              {language === "en"
                ? "Cancel"
                : language === "fr"
                  ? "Annuler"
                  : language === "de"
                    ? "Abbrechen"
                    : "Cancelar"}
            </button>
            <button
              type="submit"
              className="bg-cyan-600 p-2 rounded text-white"
            >
              {language === "en"
                ? "Save"
                : language === "fr"
                  ? "Enregistrer"
                  : language === "de"
                    ? "Speichern"
                    : "Guardar"}
            </button>
          </div>
        </form>

        <h2 className="text-2xl font-bold mb-6 mt-4 text-center text-cyan-400">
          {language === "en"
            ? "All Weekly Goals"
            : language === "fr"
              ? "Tous les objectifs hebdomadaires"
              : language === "de"
                ? "Alle wöchentlichen Ziele"
                : "Todos los objetivos semanales"}
        </h2>
        <ul className="space-y-2">
          {Array.isArray(listWeeklyObjectives) &&
            listWeeklyObjectives.map((weekObj) => (
              <li
                key={weekObj.id}
                className="flex items-center justify-between p-2 border rounded shadow-sm"
              >
                {/* Información a la izquierda */}
                <div className="flex items-center gap-6 font-mono font-bold">
                  <span className="w-24">{weekObj.weeklyTargetName}</span> |
                  <span className="w-8 truncate">
                    {weekObj.weeklyTargetHours}
                  </span>
                </div>

                {/* Botones a la derecha */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(weekObj.id)}
                    className="erp-button-small erp-button-light-green px-3 text-xs md:text-sm"
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
                    onClick={() => handleDelete(weekObj.id)}
                    className="erp-button-small erp-button-red px-3 text-xs md:text-sm"
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
    </div>
  );
};

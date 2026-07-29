import React from "react";
import { useState } from "react";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export const DailyObjective = ({ onClose, onRefresh }) => {
  const [formDailyData, setFormDailyData] = useState({
    dailyTargetName: "",
    dailyTargetHours: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  const [listDailyObjectives, setListDailyObjectives] = React.useState([]);
  const { language } = useLanguage();

  const handleGetDailyObjectives = async (e) => {
    try {
      console.log("inicio de peticion daily goals");
      const response = await api.get(`/api/get-daily-goals`);
      setListDailyObjectives(response.data);
      console.log("Actividades obtenidas:", response.data);
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("¡Formulario enviado de Dailygoals! Datos:", formDailyData);

    let response;

    try {
      if (isEditing) {
        response = await api.put(
          `/api/daily-goal/${formDailyData.id}`,
          formDailyData,
        );
        console.log("Éxito guardando la edición:", response.data);
      } else {
        response = await api.post("/api/daily-goal", formDailyData);
      }

      onRefresh();
      clearInputs();
      //onClose();
    } catch (error) {
      console.error("Error crítico:", error);
      alert("Error: " + error.message);
    }
  };

  const handleEdit = async (dailyGoalId) => {
    //colocar la informacion de la actividad en el formulario para editarla en el input

    try {
      const dailyGoal = listDailyObjectives.find(
        (obj) => obj.id === dailyGoalId,
      );

      if (dailyGoal) {
        console.log("Objetivo diario encontrado para editar:", dailyGoal);

        setFormDailyData({
          id: dailyGoal.id,
          dailyTargetName: dailyGoal.dailyTargetName,
          dailyTargetHours: dailyGoal.dailyTargetHours,
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error al buscar el objetivo diario:", error);
    }
  };

  const handleDelete = async (dailyGoalId) => {
    if (
      window.confirm(
        language === "en"
          ? "Are you sure you want to delete this activity?"
          : language === "fr"
            ? "Êtes-vous sûr de vouloir supprimer cette activité ?"
            : language === "de"
              ? "Sind Sie sicher, dass Sie diese Aktivität löschen möchten?"
              : "¿Estás seguro de que quieres eliminar esta actividad?",
      )
    ) {
      console.log(
        "Token recuperado de localStorage:",
        localStorage.getItem("token"),
      );
      try {
        await api.delete(`/api/daily-goal/${dailyGoalId}`);
        onRefresh();
      } catch (error) {
        console.error("Error at deleting daily goal:", error);
      }
    }
  };

  React.useEffect(() => {
    handleGetDailyObjectives();
  }, [onRefresh]);

  const clearInputs = () => {
    setFormDailyData({
      dailyTargetName: "",
      dailyTargetHours: 0,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="erp-main-display p-6 rounded-xl shadow-2xl w-full max-w-md bg-gray-900 border border-cyan-400">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
          {language === "en"
            ? "New Daily Goal"
            : language === "fr"
              ? "Nouvel objectif quotidien"
              : language === "de"
                ? "Neues tägliches Ziel"
                : "Nuevo objetivo diario"}
        </h2>

        {/* se usa un formulario HTML puro para que el navegador controle el submit */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={
                language === "en"
                  ? "Activity..."
                  : language === "fr"
                    ? "Activité..."
                    : language === "de"
                      ? "Aktivität..."
                      : "Actividad..."
              }
              className="flex-grow p-3 bg-white text-black rounded"
              value={formDailyData.dailyTargetName}
              onChange={(e) =>
                setFormDailyData({
                  ...formDailyData,
                  dailyTargetName: e.target.value,
                })
              }
            />
            <input
              type="number"
              placeholder="Horas"
              className="w-24 p-3 bg-white text-black rounded"
              value={formDailyData.dailyTargetHours}
              onChange={(e) =>
                setFormDailyData({
                  ...formDailyData,
                  dailyTargetHours: Number(e.target.value),
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
            ? "All Daily Goals"
            : language === "fr"
              ? "Tous les objectifs quotidiens"
              : language === "de"
                ? "Alle täglichen Ziele"
                : "Todos los objetivos diarios"}
        </h2>
        <ul className="space-y-2">
          {Array.isArray(listDailyObjectives) &&
            listDailyObjectives.map((dayObj) => (
              <li
                key={dayObj.id}
                className="flex items-center justify-between p-2 border rounded shadow-sm"
              >
                {/* Información a la izquierda */}
                <div className="flex items-center gap-6 font-mono font-bold">
                  <span className="w-24">{dayObj.dailyTargetName}</span> |
                  <span className="w-8 truncate">
                    {dayObj.dailyTargetHours}
                  </span>
                </div>

                {/* Botones a la derecha */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(dayObj.id)}
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
                    onClick={() => handleDelete(dayObj.id)}
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

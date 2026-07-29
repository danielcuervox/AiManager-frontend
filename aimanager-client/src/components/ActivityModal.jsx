import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export const ActivityModal = ({ activity, onClose, onRefresh }) => {
  //const [isChecked, setIsChecked] = useState(false);

  //estado inicial del formulario, si hay una actividad para editar, se llena con sus datos, sino con valores por defecto
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    description: "",
    category: "",
    result: 0,
    comment: "",
    done: false,
  });

  const [listCategories, setListCategories] = useState([]);

  useEffect(() => {
    // Si recibimos una actividad por props, cargamos sus datos en el formulario y se extrae el ID de la categoría
    if (activity) {
      setFormData({
        ...activity,
        category: activity.category ? activity.category.id : "",
      });
    }
  }, [activity]);

  const handleToggle = () => {
    const newState = !formData.done;
    setFormData({ ...formData, done: newState });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activityToSave = {
      ...formData,
      category: { id: formData.category },
    };

    try {
      if (activity) {
        // MODO EDICIÓN (PUT)
        await api.put(`/api/activities/${activity.id}`, activityToSave);
      } else {
        // MODO CREACIÓN (POST)
        await api.post("/api/activities", activityToSave);
      }
      onRefresh(); // Recargar la lista en el componente padre
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al procesar la solicitud");
    }
  };

  const handleGetCategories = async (e) => {
    try {
      console.log("inicio de peticion categories");
      const response = await api.get(`/api/get-categories`);
      setListCategories(response.data);
      console.log("Categorías obtenidas:", response.data);
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    handleGetCategories();
  }, []);
  const { language } = useLanguage();
  console.log(`EN ACTIVITY MODAL ${language}`);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Aplicamos erp-main-display y border para consistencia */}
      <div className="erp-main-display p-6 rounded-xl shadow-2xl w-full max-w-md border border-cyan-400/20">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
          {language === "en"
            ? activity
              ? "Edit Activity"
              : "New Activity"
            : language === "fr"
              ? activity
                ? "Modifier l'activité"
                : "Nouvelle activité"
              : language === "de"
                ? activity
                  ? "Aktivität bearbeiten"
                  : "Neue Aktivität"
                : activity
                  ? "Editar Actividad"
                  : "Nueva Actividad"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="date"
              className="w-1/2 p-3 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              type="time"
              className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
            />
          </div>

          <input
            placeholder={
              language === "en"
                ? "Description"
                : language === "fr"
                  ? "Description"
                  : language === "de"
                    ? "Beschreibung"
                    : "Descripción"
            }
            className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="flex items-center justify-between p-2 border rounded bg-gray-50">
            <label className="font-bold text-gray-700">
              {language === "en"
                ? "Category"
                : language === "fr"
                  ? "Catégorie"
                  : language === "de"
                    ? "Kategorie"
                    : "Categoría"}
            </label>
            <select
              className="p-1 border rounded bg-white border-gray-300 text-gray-800"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {/* Opción por defecto (opcional) */}
              <option value="">
                {language === "en"
                  ? "Select a category"
                  : language === "fr"
                    ? "Sélectionner une catégorie"
                    : language === "de"
                      ? "Kategorie auswählen"
                      : "Selecciona una categoría"}
              </option>

              {/* Mapeo de la lista dinámica */}
              {listCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder={
              language === "en"
                ? "Comment"
                : language === "fr"
                  ? "Commentaire"
                  : language === "de"
                    ? "Kommentar"
                    : "Comentario"
            }
            className="w-full p-3 bg-white border border-gray-300 rounded text-gray-800 placeholder-gray-500"
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
          />

          <div className="flex items-center justify-between p-2 border rounded bg-gray-50">
            <label className="font-bold text-gray-700">
              {language === "en"
                ? "Result"
                : language === "fr"
                  ? "Résultat"
                  : language === "de"
                    ? "Ergebnis"
                    : "Resultado"}
            </label>
            <select
              className="p-1 border rounded bg-white border-gray-300 text-gray-800"
              value={formData.result}
              onChange={(e) =>
                setFormData({ ...formData, result: Number(e.target.value) })
              }
            >
              <option value={0}>0%</option>
              <option value={25}>25%</option>
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-2 border rounded bg-gray-50">
            <span className="font-bold text-gray-700">
              {language === "en"
                ? "Completed"
                : language === "fr"
                  ? "Terminé"
                  : language === "de"
                    ? "Erledigt"
                    : "Cumplido"}
            </span>
            <button
              type="button"
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.done ? "bg-green-600" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.done ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
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
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 font-bold"
            >
              {language === "en"
                ? activity
                  ? "Save Changes"
                  : "Create Activity"
                : language === "fr"
                  ? activity
                    ? "Enregistrer les modifications"
                    : "Créer une activité"
                  : language === "de"
                    ? activity
                      ? "Änderungen speichern"
                      : "Aktivität erstellen"
                    : activity
                      ? "Guardar Cambios"
                      : "Crear Actividad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

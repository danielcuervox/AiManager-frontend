import { useState } from "react";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";

const ActivityLogger = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
    time: new Date().toTimeString().slice(0, 5),
    description: "",
    category: "",
    result: 0,
    comment: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ajusta la ruta según el endpoint de guardado en el backend
      await api.post("/api/activities", formData);
      alert("¡Actividad registrada con éxito!");
      setFormData({
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        description: "",
        category: "",
        comment: "",
        result: 0,
      });
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
    }
  };

  const timeOptions = [];

  for (let hour = 0; hour < 24; hour++) {
    timeOptions.push(
      `${hour.toString().padStart(2, "0")}:00`,
      `${hour.toString().padStart(2, "0")}:30`,
    );
  }

  const { language } = useLanguage();

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Registrar Actividad</h2>

      <div className="flex space-x-2 mb-4">
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />

        <select
          className="w-full p-2 mb-2 border rounded text-center"
          value={formData.time}
          onChange={(e) =>
            setFormData({
              ...formData,
              time: e.target.value,
            })
          }
        >
          <option value="">Hora</option>

          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Descripción (ej: Codificando API)"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <input
        className="w-full p-2 mb-2 border rounded"
        placeholder="Categoría (ej: Desarrollo, Estudio)"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />

      <textarea
        className="w-full p-2 mb-4 border rounded"
        placeholder="Comentario breve"
        value={formData.comment}
        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
      />

      <select
        className="w-full p-2 mb-2 border rounded"
        value={formData.result}
        onChange={(e) =>
          setFormData({
            ...formData,
            result: Number(e.target.value),
          })
        }
      >
        <option value={0}>0</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={75}>75</option>
        <option value={100}>100</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Guardar Actividad
      </button>
    </form>
  );
};

export default ActivityLogger;

import React, { useState, useEffect } from "react";
import api from "../api/api";
import { ResultModal } from "./ResultModal";
import { useLanguage } from "../context/LanguageContext";

export const AiManagerModal = ({ onClose }) => {
  const [isSetCalendarOpen, setIsSetCalendarOpen] = useState(false);
  const [isAiResultModalOpen, setIsAiResultModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [aiResult, setAiResult] = useState("");

  const handleShowCalendar = () => {
    setIsSetCalendarOpen(true);
  };
  const { language } = useLanguage();

  const handleSubmit = async (e) => {
    console.log("se pide el resultado", selectedDate);
    let response;
    try {
      response = await api.post("/api/analytics/daily-report", {
        date: selectedDate,
        language: language,
      });
      console.log(`idioma solicitado ${language}`);
      setAiResult(response.data);
      setIsAiResultModalOpen(true);
      //console.log("Response from backend:", response.data);
    } catch (error) {
      console.error(
        "Error al enviar la fecha:",
        error.response?.data || error.message,
      );
    }
  };

  //verificar que no sea una ffecha superior a la fecha actual
  useEffect(() => {
    if (selectedDate) {
      const today = new Date();
    }
  }, [selectedDate]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="erp-main-display p-6 rounded-xl shadow-2xl w-full max-w-md bg-gray-900 border border-cyan-400">
          {isSetCalendarOpen ? (
            <div className="mb-6">
              <h3 className="text-cyan-400 mb-2">
                {language === "en"
                  ? "Select date:"
                  : language === "fr"
                    ? "Sélectionner la date :"
                    : language === "de"
                      ? "Datum auswählen:"
                      : "Selecciona la fecha:"}
              </h3>
              <input
                type="date"
                className="w-full p-2 rounded bg-gray-800 text-white border border-cyan-400"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button
                onClick={() => setIsSetCalendarOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
              >
                &lt;{" "}
                {language === "en"
                  ? "Back"
                  : language === "fr"
                    ? "Retour"
                    : language === "de"
                      ? "Zurück"
                      : "Volver"}
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
                {language === "en"
                  ? "AI Manager Modal"
                  : language === "fr"
                    ? "Modal de gestion IA"
                    : language === "de"
                      ? "KI-Manager-Modal"
                      : "Modal de Gestor IA"}
              </h2>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-100"
                >
                  {language === "en"
                    ? "Back"
                    : language === "fr"
                      ? "Retour"
                      : language === "de"
                        ? "Zurück"
                        : "Volver"}
                </button>

                <button
                  onClick={() => handleSubmit()}
                  className="bg-cyan-600 p-2 rounded text-white"
                >
                  {language === "en"
                    ? "Report's date:"
                    : language === "fr"
                      ? "Date du rapport :"
                      : language === "de"
                        ? "Berichtsdatum:"
                        : "Fecha del informe:"}{" "}
                  {selectedDate}
                </button>
                <button
                  type="button"
                  onClick={() => handleShowCalendar()}
                  className="bg-cyan-600 p-2 rounded text-white"
                >
                  {language === "en"
                    ? "Change Date"
                    : language === "fr"
                      ? "Changer la date"
                      : language === "de"
                        ? "Datum ändern"
                        : "Cambiar fecha"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {isAiResultModalOpen && (
        <ResultModal
          content={aiResult}
          onClose={() => setIsAiResultModalOpen(false)}
        />
      )}
    </>
  );
};

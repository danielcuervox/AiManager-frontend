import { useState } from "react";
import reactLogo from "../assets/react.svg";
import { useLanguage } from "../context/LanguageContext";

import ActivityLogger from "../components/ActivityLogger";
import { DailyTimetable } from "../components/DailyTimetable";
import { ActivityModal } from "../components/ActivityModal";
import { WeeklyObjectiveModal } from "../components/WeeklyObjectiveModal";
import { DailyObjective } from "../components/DailyObjective";
import { NewCategoryModal } from "../components/NewCategoryModal";
import { AiManagerModal } from "../components/AiManagerModal";
//import api from ".";

export const Activities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAiManagerOpen, setIsAiManagerOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { language, changeLanguage } = useLanguage();

  // --- AÑADE ESTA FUNCIÓN ---
  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleAddWeeklyObjective = () => {
    console.log("Abrir modal de objetivo semanal");
    setIsWeeklyModalOpen(true);
  };

  const handleAddDailyObjective = () => {
    console.log("Abrir modal de objetivo diario");
    setIsDailyModalOpen(true);
  };

  const handleAddCategory = () => {
    console.log("Abrir modal de nueva categoría");
    setIsCategoryModalOpen(true);
  };

  const handleDelete = async (activityId) => {
    //mensaje de confirmación
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta actividad?")
    ) {
      try {
        await api.delete(`/api/activities/${activityId}`);
        // Al borrar, refrescamos la lista para que desaparezca de pantalla
        handleRefresh();
      } catch (error) {
        console.error("Error al borrar:", error);
      }
    }
  };

  const handleGetAiManager = async () => {
    setIsAiManagerOpen(true);
  };

  return (
    <>
      <div className="erp-control-panel container mx-auto p-4 md:p-8">
        <header className="erp-header flex items-center justify-between p-4 mb-6 bg-slate-950/30 rounded-lg shadow-inner">
          <img
            src={reactLogo}
            alt="React Logo"
            className="erp-logo w-10 h-10 animate-spin-slow"
          />
          <h1 className="text-2xl font-black erp-main-title tracking-tighter">
            {language === "en"
              ? "Productivity Manager"
              : language === "fr"
                ? "Gestionnaire de Productivité"
                : language === "de"
                  ? "Produktivitätsmanager"
                  : "Gestor de Productividad"}
          </h1>
          <img
            src={reactLogo}
            alt="React Logo"
            className="erp-logo w-10 h-10 animate-spin-slow"
          />
        </header>
        <div className="container mx-auto p-4">
          {/* div contendor de los dos botones */}
          <section className="p-6 mb-8 bg-slate-900/60 rounded-xl erp-action-panel shadow-md flex flex-col gap-4">
            {/* Fila superior: Selector de idiomas alineado a la derecha */}
            {/* Selector de idiomas con Banderas */}
            <div className="flex gap-1.5 bg-gray-800 p-1.5 rounded-lg border border-gray-700 justify-end">
              {[
                {
                  code: "es",
                  name: "España",
                  flag: "../../public/images/flags/spain_flag.png",
                },
                {
                  code: "en",
                  name: "English",
                  flag: "/images/flags/brit_american_flag.png",
                },
                {
                  code: "fr",
                  name: "Français",
                  flag: "/images/flags/france_flag.png",
                },
                {
                  code: "de",
                  name: "Deutsch",
                  flag: "/images/flags/germany_flag.png",
                },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => changeLanguage(item.code)}
                  title={item.name}
                  className={`p-1 rounded transition-all flex items-center justify-center ${
                    language === item.code
                      ? "bg-cyan-500 shadow-[0_0_10px_rgba(0,242,254,0.5)] scale-105"
                      : "opacity-60 hover:opacity-100 hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={item.flag}
                    alt={item.name}
                    className="w-6 h-4 object-cover rounded-sm shadow-sm"
                    onError={(e) => {
                      // Si falla la imagen, muestra el texto como respaldo de emergencia
                      e.target.style.display = "none";
                      e.target.parentElement.innerText =
                        item.code.toUpperCase();
                    }}
                  />
                </button>
              ))}
            </div>
            {/* Fila inferior: Contenedor de los botones principales */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleAdd}
                className="erp-button erp-button-green"
              >
                <span>
                  {language === "en"
                    ? "+ Add single activity"
                    : language === "fr"
                      ? "+ Ajouter une activité unique"
                      : language === "de"
                        ? "+ Einzelne Aktivität hinzufügen"
                        : "+ Agregar una actividad"}
                </span>
              </button>
              <button
                onClick={handleAddWeeklyObjective}
                className="erp-button erp-button-green"
              >
                <span>
                  {language === "en"
                    ? "+ Add Weekly Objective"
                    : language === "fr"
                      ? "+ Ajouter un objectif hebdomadaire"
                      : language === "de"
                        ? "+ Wöchentliches Ziel hinzufügen"
                        : "+ Agregar una actividad semanal"}
                </span>
              </button>
              <button
                onClick={handleAddDailyObjective}
                className="erp-button erp-button-green"
              >
                <span>
                  {language === "en"
                    ? "+ Add Daily Objective"
                    : language === "fr"
                      ? "+ Ajouter un objectif quotidien"
                      : language === "de"
                        ? "+ Tägliches Ziel hinzufügen"
                        : "+ Añadir objetivo diario"}
                </span>
              </button>
              <button
                onClick={handleAddCategory}
                className="erp-button erp-button-cyan"
              >
                <span>
                  {language === "en"
                    ? "New Category"
                    : language === "fr"
                      ? "Nouvelle catégorie"
                      : language === "de"
                        ? "Neue Kategorie"
                        : "Nueva categoría"}
                </span>
              </button>
              <button
                onClick={handleGetAiManager}
                className="erp-button erp-button-cyan"
              >
                <span>
                  {language === "en"
                    ? "Get AI Manager"
                    : language === "fr"
                      ? "Obtenir le gestionnaire IA"
                      : language === "de"
                        ? "KI-Manager holen"
                        : "Obtener Gerente IA"}
                </span>
              </button>
            </div>
          </section>

          <section className="p-6 bg-slate-900/60 rounded-xl shadow-lg erp-main-display">
            <DailyTimetable
              onEdit={handleEdit}
              refreshTrigger={refreshTrigger}
              onDelete={handleDelete}
            />
          </section>

          {isModalOpen && (
            <ActivityModal
              activity={editingActivity}
              onClose={() => setIsModalOpen(false)}
              onRefresh={handleRefresh}
            />
          )}

          {isWeeklyModalOpen && (
            <WeeklyObjectiveModal
              onClose={() => setIsWeeklyModalOpen(false)}
              onRefresh={handleRefresh}
            />
          )}

          {isDailyModalOpen && (
            <DailyObjective
              onClose={() => setIsDailyModalOpen(false)}
              onRefresh={handleRefresh}
            />
          )}

          {isCategoryModalOpen && (
            <NewCategoryModal
              onClose={() => setIsCategoryModalOpen(false)}
              onRefresh={handleRefresh}
            />
          )}
          {isAiManagerOpen && (
            <AiManagerModal onClose={() => setIsAiManagerOpen(false)} />
          )}
        </div>
        <footer className="mt-12 text-center text-xs text-slate-500 font-mono tracking-widest uppercase pb-4">
          {language === "en"
            ? "Personal ERP v1.0 | Daily Operations"
            : language === "fr"
              ? "ERP Personnel v1.0 | Opérations Quotidiennes"
              : language === "de"
                ? "Persönliches ERP v1.0 | Tägliche Operationen"
                : "ERP Personal v1.0 | Operaciones Diarias"}
        </footer>
      </div>
    </>
  );
};

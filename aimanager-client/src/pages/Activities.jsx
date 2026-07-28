import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "../assets/vite.svg";
import heroImg from "../assets/hero.png";

import ActivityLogger from "../components/ActivityLogger";
import { DailyTimetable } from "../components/DailyTimetable";
import { ActivityModal } from "../components/ActivityModal";
import { WeeklyObjectiveModal } from "../components/WeeklyObjectiveModal";
import { DailyObjective } from "../components/DailyObjective";
import { NewCategoryModal } from "../components/NewCategoryModal";
import { AiManagerModal } from "../components/AiManagerModal";
import api from "../api/api";

export const Activities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAiManagerOpen, setIsAiManagerOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            Gestor de Productividad
          </h1>
          <img
            src={reactLogo}
            alt="React Logo"
            className="erp-logo w-10 h-10 animate-spin-slow"
          />
        </header>
        <div className="container mx-auto p-4">
          {/* div contendor de los dos botones */}
          <section className="p-6 mb-8 bg-slate-900/60 rounded-xl erp-action-panel shadow-md">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleAdd}
                className="erp-button erp-button-green"
              >
                <span>+ Add single activity</span>
              </button>
              <button
                onClick={handleAddWeeklyObjective}
                className="erp-button erp-button-green"
              >
                <span>+ Add Weekly Objective</span>
              </button>
              <button
                onClick={handleAddDailyObjective}
                className="erp-button erp-button-green"
              >
                <span>+ Add Daily Objective</span>
              </button>
              <button
                onClick={handleAddCategory}
                className="erp-button erp-button-cyan"
              >
                <span>New Category</span>
              </button>
              <button
                onClick={handleGetAiManager}
                className="erp-button erp-button-cyan"
              >
                <span>Get Ai-Manager</span>
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
          Personal ERP v1.0 | Operaciones Diarias
        </footer>
      </div>
    </>
  );
};

import React, { useEffect } from "react";
import { WeeklyRadarChart } from "../components/WeeklyRadarChart";
import { StatsChart } from "../components/StatsChart";
import { useLanguage } from "../context/LanguageContext";

export const StatisticsModal = ({ onClose, refreshTrigger }) => {
  const { language } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      {/* Contenedor principal con altura máxima y scroll vertical */}
      <div className="erp-main-display p-6 rounded-xl shadow-2xl w-full max-w-5xl bg-gray-900 border border-cyan-400 max-h-[90vh] overflow-y-auto flex flex-col gap-6">
        {/* Gráficos en grid: 1 columna en móvil, 2 columnas en pantallas grandes (horizontal) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <StatsChart refreshTrigger={refreshTrigger} />
          <WeeklyRadarChart refreshTrigger={refreshTrigger} />
        </div>

        {/* Botón de cerrar fijo al final del scroll */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition"
          >
            {language === "en"
              ? "Close"
              : language === "fr"
                ? "Fermer"
                : language === "de"
                  ? "Schließen"
                  : "Cerrar"}
          </button>
        </div>
      </div>
    </div>
  );
};

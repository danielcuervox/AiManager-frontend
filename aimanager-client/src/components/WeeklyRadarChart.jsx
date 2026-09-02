import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export const WeeklyRadarChart = ({ refreshTrigger }) => {
  const [data, setData] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const response = await api.get(
          "/api/analytics/weekly-goals-comparison",
        );
        setData(response.data);
      } catch (error) {
        console.error("Error al cargar datos semanales:", error);
      }
    };

    fetchWeeklyData();
  }, [refreshTrigger]);

  const titles = {
    es: "Equilibrio de Objetivos Semanales",
    en: "Weekly Goals Balance",
    fr: "Équilibre des Objectifs Hebdomadaires",
    de: "Wöchentlicher Ziel-Ablauf",
  };

  const labelTarget = {
    es: "Meta Semanal (h)",
    en: "Weekly Target (h)",
    fr: "Objectif Semaine (h)",
    de: "Wochenziel (h)",
  };
  const labelCompleted = {
    es: "Logrado Semanal (h)",
    en: "Weekly Actual (h)",
    fr: "Réalisé Semaine (h)",
    de: "Wochen-Ist (h)",
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg text-white w-full">
      <h3 className="text-xl font-bold mb-4 text-center text-cyan-400">
        {titles[language] || titles.es}
      </h3>

      {data.length === 0 ? (
        <p className="text-center text-slate-400 py-8">
          {language === "en"
            ? "No weekly goals found."
            : "Sin objetivos semanales registrados."}
        </p>
      ) : (
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              {/* Red radial de fondo */}
              <PolarGrid stroke="#334155" />
              {/* Nombres de los objetivos en las esquinas */}
              <PolarAngleAxis
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              {/* Escala numérica de horas */}
              <PolarRadiusAxis
                angle={30}
                domain={[0, "dataMax + 2"]}
                stroke="#64748b"
              />

              {/* Polígono de Objetivos (Azul transparente) */}
              <Radar
                name={labelTarget[language] || labelTarget.es}
                dataKey="targetHours"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />

              {/* Polígono de Horas Completadas (Verde/Esmeralda) */}
              <Radar
                name={labelCompleted[language] || labelCompleted.es}
                dataKey="completedHours"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.5}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";

export const StatsChart = ({ refreshTrigger }) => {
  const [data, setData] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await api.get("/api/analytics/goals-comparison");
        console.log("Datos del gráfico recibidos:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error al cargar los datos del gráfico:", error);
      }
    };

    fetchChartData();
  }, [refreshTrigger]);

  const titles = {
    es: "Objetivos Diarios: Plan vs Realizado",
    en: "Daily Goals: Plan vs Actual",
    fr: "Objectifs Quotidiens : Prévu vs Réalisé",
    de: "Tägliche Ziele: Plan vs. Ist",
  };

  const labelTarget = {
    es: "Objetivo (h)",
    en: "Target (h)",
    fr: "Objectif (h)",
    de: "Ziel (h)",
  };
  const labelCompleted = {
    es: "Completado (h)",
    en: "Completed (h)",
    fr: "Réalisé (h)",
    de: "Erledigt (h)",
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg text-white w-full">
      <h3 className="text-xl font-bold mb-4 text-center text-cyan-400">
        {titles[language] || titles.es}
      </h3>

      {data.length === 0 ? (
        <p className="text-center text-slate-400 py-8">
          {language === "en"
            ? "No data available yet."
            : "No hay datos disponibles todavía."}
        </p>
      ) : (
        <div className="w-full h-80" style={{ minHeight: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              {/* Barras de lo propuesto */}
              <Bar
                dataKey="targetHours"
                name={labelTarget[language] || labelTarget.es}
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              {/* Barras de lo completado*/}
              <Bar
                dataKey="completedHours"
                name={labelCompleted[language] || labelCompleted.es}
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

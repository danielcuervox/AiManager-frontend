import React from "react";
import api from "../api/api";

export const Stadistics = () => {
  const [activitiesAverage, setActivitiesAverage] = React.useState();
  const handleGetNumActivities = async (e) => {
    try {
      const response = await api.get(`/api/analytics/average`);
      setActivitiesAverage(response.data);
      console.log("promedio de actividades:", response.data);
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
    }
  };

  return <div>Stadistics: {activitiesAverage}</div>;
};

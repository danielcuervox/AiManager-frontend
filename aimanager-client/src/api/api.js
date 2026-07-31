import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    // Si todo va bien (Status 200, 201, etc.), simplemente dejamos pasar la respuesta.
    return response;
  },
  (error) => {
    // Si el backend nos devuelve un error, se analiza aquí.
    if (error.response && error.response.status === 401) {
      console.warn(
        "Sesión expirada o token inválido. Redirigiendo al login...",
      );

      // se borra el toquen caducado o inválido
      localStorage.removeItem("token");

      // se redirige al usuario a la pantalla de login.
      // se usa window.location.href porque useNavigate() solo funciona dentro de componentes React.
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;

import React from "react";
import { useState } from "react";
import api from "../api/api";

export const NewCategoryModal = ({ onClose, onRefresh }) => {
  const [formCategoryData, setFormCategoryData] = useState({
    categoryName: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [listCategories, setListCategories] = React.useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;

    try {
      if (isEditing) {
        response = await api.put(
          `/api/categories/${formCategoryData.id}`,
          formCategoryData,
        );
        console.log("Éxito guardando la edición:", response.data);
        clearInputs();
      } else {
        response = await api.post("/api/categories", formCategoryData);
        console.log(
          "¡Formularjjio enviado de NewCategory! Datos:",
          response.data,
        );
        clearInputs();
      }

      onRefresh();
      //onClose();
    } catch (error) {
      console.error("Error crítico:", error);
      alert("Error: " + error.message);
    }
  };

  const handleEdit = async (categoryId) => {
    //colocar la informacion de la categoría en el formulario para editarla en el input

    try {
      const category = listCategories.find((obj) => obj.id === categoryId);

      if (category) {
        console.log("Categoría encontrada para editar:", category);

        setFormCategoryData({
          id: category.id,
          categoryName: category.categoryName,
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error al buscar el objetivo diario:", error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")
    ) {
      console.log(
        "Token recuperado de localStorage:",
        localStorage.getItem("token"),
      );
      try {
        await api.delete(`/api/categories/${categoryId}`);
        onRefresh();
      } catch (error) {
        console.error("Error at deleting category:", error);
      }
    }
  };

  const clearInputs = () => {
    setFormCategoryData({
      categoryName: "",
    });
    setIsEditing(false);
  };

  React.useEffect(() => {
    handleGetCategories();
  }, [onRefresh]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="erp-main-display p-6 rounded-xl shadow-2xl w-full max-w-md bg-gray-900 border border-cyan-400">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
          New Category
        </h2>

        {/* se usa un formulario HTML puro para que el navegador controle el submit */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Actividad..."
              className="flex-grow p-3 bg-white text-black rounded"
              value={formCategoryData.categoryName}
              onChange={(e) =>
                setFormCategoryData({
                  ...formCategoryData,
                  categoryName: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="text-white">
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-cyan-600 p-2 rounded text-white"
            >
              Guardar
            </button>
          </div>
        </form>

        <h2 className="text-2xl font-bold mb-6 mt-4 text-center text-cyan-400">
          All Categories
        </h2>
        <ul className="space-y-2">
          {Array.isArray(listCategories) &&
            listCategories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between p-2 border rounded shadow-sm"
              >
                {/* Información a la izquierda */}
                <div className="flex items-center gap-6 font-mono font-bold">
                  <span className="w-24">{category.categoryName}</span>
                </div>

                {/* Botones a la derecha */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category.id)}
                    className="erp-button-small erp-button-light-green px-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="erp-button-small erp-button-red px-3"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";

export const Shop = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar la tienda de FastAPI:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="p-6 text-white text-center">Cargando tienda...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
        Tienda Items 🏛️
      </h2>

      {/* Grilla responsiva */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col items-center shadow-md w-full max-w-xs"
          >
            <div className="w-32 h-32 bg-slate-900 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-1 text-center">
              {item.name}
            </h3>
            <span className="text-xs uppercase bg-slate-700 text-slate-300 px-2 py-0.5 rounded mb-4">
              {item.category}
            </span>

            <div className="flex justify-between w-full items-center mt-auto">
              <span className="text-amber-400 font-bold">{item.price} 🪙</span>
              <button
                onClick={() => handleBuy(item)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

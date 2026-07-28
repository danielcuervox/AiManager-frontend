import React, { useState } from "react";
import api from "../api/api";
import { useSpeech } from "../hooks/useSpeech";


export const ChatManagerModal = ({ content, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: "manager",
      text: `¡Atención! Soy tu comandante (${content.usedStyle}). He revisado tu reporte. ¿Qué observaciones o dudas tienes sobre la jornada?`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { speak } = useSpeech();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMsg = { sender: "user", text: inputMessage };
    const updatedHistory = [...messages, userMsg];

    setMessages(updatedHistory);
    setInputMessage("");
    setLoading(true);

    try {
      // Preparamos el historial para el backend (excluyendo el mensaje inicial si es necesario)
      const historyDto = updatedHistory.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await api.post("/api/analytics/chat", {
        date: content.date,
        message: userMsg.text,
        history: historyDto,
      });

      const managerMsg = {
        sender: "manager",
        text: response.data.reply,
      };

      setMessages((prev) => [...prev, managerMsg]);
    } catch (error) {
      console.error("Error al hablar con el Gerente IA:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[80vh] bg-[#1a233a] border-2 border-cyan-400 rounded-xl p-6 flex flex-col shadow-[0_0_30px_rgba(0,242,254,0.3)]">
        {/* Cabecera del Chat */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
          <img
            src={`/images/ai-profiles/${content.photo}`}
            alt="AI Manager"
            className="w-14 h-14 object-cover rounded-full border-2 border-cyan-400"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/ai-profiles/default.png";
            }}
          />
          <div>
            <h2 className="text-xl font-bold text-cyan-400">
              Canal Táctico - Gerente IA
            </h2>
            <p className="text-sm text-gray-300">{content.usedStyle}</p>
          </div>
        </div>

        {/* Zona de Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 my-4 bg-[#0f172a] rounded-lg border border-gray-700">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg text-sm whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-cyan-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-200 border border-cyan-500/30 rounded-bl-none"
                }`}
              >
                {msg.text}
                {/* Botón de reproducción de voz solo para el Gerente IA */}
                {msg.sender === "manager" && (
                  <button
                    onClick={() => speak(msg.text)} // 3. ¡Usarlo así de simple!
                    className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-gray-900/50 px-2 py-1 rounded border border-cyan-500/20 transition-colors"
                  >
                    🔊 Escuchar
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-cyan-400 text-xs animate-pulse">
              El Gerente IA está redactando su respuesta...
            </div>
          )}
        </div>

        {/* Campo de Entrada de Texto */}
        <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Escribe tu mensaje a la IA..."
            className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
          >
            Enviar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Cerrar
          </button>
        </form>
      </div>
    </div>
  );
};

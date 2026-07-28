import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ChatManagerModal } from "./ChatManagerModal";
import { useSpeech } from "../hooks/useSpeech";

export const ResultModal = ({
  content,
  onClose,
  characterImage,
  characterName,
}) => {
  console.log("ResultModal content:", content.photo);
  {
    /*
    <img
            src={`/images/ai-profiles/${content.photo}`}
            alt="Avatar Personaje"
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-cyan-400"
          />
    */
  }

  const [isChatOpen, setIsChatOpen] = useState(false);
  const { speak, stop } = useSpeech();

  const onOpenChat = () => {
    setIsChatOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full h-full max-w-5xl max-h-[90vh] bg-[#1a233a] border-2 border-cyan-400 rounded-xl p-6 flex flex-col shadow-[0_0_30px_rgba(0,242,254,0.3)]">
          <div className="flex shrink-0 gap-6 mb-6 items-center">
            <div className="flex justify-center mb-4">
              <img
                src={`/images/ai-profiles/${content.photo}`}
                alt="AI Manager"
                className="w-full h-32 sm:w-32 sm:h-56 object-cover rounded-lg border-2 border-cyan-400"
                onError={(e) => {
                  // Si la imagen específica no se encuentra en la carpeta, carga la por defecto
                  e.target.onerror = null;
                  e.target.src = "/images/ai-profiles/default.png";
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-cyan-400">
                Reporte de
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {content.usedStyle}
              </p>
            </div>
          </div>

          <div className="flex-1 bg-[#0f172a] p-6 rounded-lg overflow-y-auto whitespace-pre-line text-white border border-gray-700 min-h-0 text-md shadow-inner">
            {content.summary}
          </div>

          {/*BOTONES DE AUDIO */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => speak(content.summary)}
              className="px-4 py-2 bg-cyan-600 text-white rounded font-bold"
            >
              🔊 Escuchar Reporte
            </button>

            <button
              onClick={stop}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              🔇 Detener Audio
            </button>
          </div>

          {/*BOTONES DE CERRAR Y CHAT */}
          <button
            onClick={onClose}
            className="mt-6 shrink-0 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg text-xl uppercase tracking-wider transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={onOpenChat}
            className="mt-6 shrink-0 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg text-xl uppercase tracking-wider transition-colors"
          >
            Abrir Chat
          </button>
        </div>
      </div>
      {isChatOpen && (
        <ChatManagerModal
          content={content}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
};

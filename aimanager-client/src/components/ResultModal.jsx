import { useState } from "react";
import { ChatManagerModal } from "./ChatManagerModal";
import { useSpeech } from "../hooks/useSpeech";
import { useLanguage } from "../context/LanguageContext";

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
  const { language, changeLanguage } = useLanguage();

  /*   const onOpenChat = () => {
    setIsChatOpen(true);
  }; */

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full h-full max-w-5xl max-h-[90vh] bg-[#1a233a] border-2 border-cyan-400 rounded-xl p-6 flex flex-col shadow-[0_0_30px_rgba(0,242,254,0.3)]">
          {/* CABECERA: FOTO (Ocupa la mitad izquierda) + TÍTULO Y SELECTOR */}
          <div className="flex shrink-0 gap-6 mb-6 items-center justify-between">
            {/* FOTO DEL GERENTE IA: Ocupa la mitad del ancho superior (w-1/2) */}
            <div className="w-1/2 flex justify-center">
              <img
                src={`/images/ai-profiles/${content.photo}`}
                alt="AI Manager"
                className="w-full h-40 sm:h-52 object-cover rounded-lg border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/ai-profiles/default.png";
                }}
              />
            </div>

            {/* TÍTULO Y SELECTOR DE IDIOMAS (Ocupa la otra mitad) */}
            <div className="w-1/2 flex flex-col items-start justify-between h-full gap-4">
              <div className="flex w-full justify-end">
                {/* BOTONES DE SELECCIÓN DE IDIOMAS */}
                <div className="flex gap-1 bg-gray-800 p-1 rounded-lg border border-gray-700">
                  {["es", "en", "fr", "de"].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => changeLanguage(lang)}
                      className={`px-2 py-1 text-xs font-bold rounded uppercase transition-colors ${
                        language === lang
                          ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,242,254,0.5)]"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">
                  {language === "en"
                    ? "Report of"
                    : language === "fr"
                      ? "Rapport de"
                      : language === "de"
                        ? "Bericht von"
                        : "Reporte de"}
                </h2>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {content.usedStyle}
                </p>
              </div>
            </div>
          </div>

          {/* CUERPO DEL REPORTE */}
          <div className="flex-1 bg-[#0f172a] p-6 rounded-lg overflow-y-auto whitespace-pre-line text-white border border-gray-700 min-h-0 text-md shadow-inner">
            {content.summary}
          </div>

          {/* BOTONES DE AUDIO */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => speak(content.summary)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-colors"
            >
              🔊{" "}
              {language === "en"
                ? "Listen Report"
                : language === "fr"
                  ? "Écouter le rapport"
                  : language === "de"
                    ? "Bericht anhören"
                    : "Escuchar Reporte"}
            </button>

            <button
              type="button"
              onClick={stop}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
            >
              🔇{" "}
              {language === "en"
                ? "Stop Audio"
                : language === "fr"
                  ? "Arrêter l'audio"
                  : language === "de"
                    ? "Audio stoppen"
                    : "Detener Audio"}
            </button>
          </div>

          {/* BOTONES DE CERRAR Y CHAT */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 shrink-0 w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg text-lg uppercase tracking-wider transition-colors"
          >
            {language === "en"
              ? "Close"
              : language === "fr"
                ? "Fermer"
                : language === "de"
                  ? "Schließen"
                  : "Cerrar"}
          </button>

          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="mt-2 shrink-0 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg text-lg uppercase tracking-wider transition-colors"
          >
            {language === "en"
              ? "Open Chat"
              : language === "fr"
                ? "Ouvrir le chat"
                : language === "de"
                  ? "Chat öffnen"
                  : "Abrir Chat"}
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

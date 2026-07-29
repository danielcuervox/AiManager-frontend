import { useState, useEffect } from "react";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";
import { useSpeech } from "../hooks/useSpeech";

export const ChatManagerModal = ({ content, onClose }) => {
  const { language, changeLanguage } = useLanguage();
  /*   const [messages, setMessages] = useState([
    {
      sender: "manager",
      text: `¡Atención! Soy tu comandante (${content.usedStyle}). He revisado tu reporte. ¿Qué observaciones o dudas tienes sobre la jornada?`,
    },
  ]); */
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const { speak, startListening, stopListening, isListening } = useSpeech();

  // 🎙️ Función que maneja lo que ocurre cuando el micrófono capta texto     transcript,
  //setTranscript,

  useEffect(() => {
    const welcomeText =
      language === "en"
        ? `Attention! I am your commander (${content.usedStyle}). I have reviewed your report. What observations or questions do you have about the workday?`
        : language === "fr"
          ? `Attention ! Je suis votre commandant (${content.usedStyle}). J'ai examiné votre rapport. Quelles observations ou questions avez-vous concernant la journée ?`
          : language === "de"
            ? `Achtung! Ich bin dein Kommandant (${content.usedStyle}). Ich habe deinen Bericht überprüft. Welche Beobachtungen oder Fragen hast du zum Arbeitstag?`
            : `¡Atención! Soy tu comandante (${content.usedStyle}). He revisado tu reporte. ¿Qué observaciones o dudas tienes sobre la jornada?`;

    setMessages((prev) => {
      if (prev.length <= 1) {
        return [{ sender: "manager", text: welcomeText }];
      }
      return prev;
    });
  }, [language, content.usedStyle]);

  const handleToggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      // Pasamos una función callback limpia para actualizar el input sin useEffects
      startListening((textResult) => {
        setInputMessage((prev) =>
          prev ? `${prev} ${textResult}` : textResult,
        );
      });
    }
  };

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
        language: language,
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
              {language === "en"
                ? "Tactical Channel - AI Manager"
                : language === "fr"
                  ? "Canal Tactique - Gestionnaire IA"
                  : language === "de"
                    ? "Taktischer Kanal - KI-Manager"
                    : "Canal Táctico - Gerente IA"}
            </h2>
            <p className="text-sm text-gray-300">{content.usedStyle}</p>
          </div>

          {/* BOTONES DE SELECCIÓN DE IDIOMAS*/}
          <div className="flex gap-1 bg-gray-800 p-1 rounded-lg border border-gray-700">
            {["es", "en", "fr", "de"].map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                  language === lang
                    ? "bg-cyan-500 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          {/* BOTONES DE SELECCIÓN DE IDIOMAS*/}
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
                    type="button"
                    onClick={() => speak(msg.text)}
                    className="mt-3 flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-gray-900/60 px-2 py-1 rounded border border-cyan-500/30 transition-colors"
                  >
                    🔊{" "}
                    {language === "en"
                      ? "Listen"
                      : language === "fr"
                        ? "Écouter"
                        : language === "de"
                          ? "Anhören"
                          : "Escuchar"}
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

        {/* Campo de Entrada de Texto y MICRÓFONO */}
        <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0">
          {/* Botón de Micrófono */}

          <button
            type="button"
            onClick={handleToggleListen}
            className={`px-4 rounded-lg font-bold flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-600 animate-pulse text-white shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                : "bg-gray-700 hover:bg-gray-600 text-cyan-400 border border-cyan-500/30"
            }`}
            title={
              isListening
                ? language === "en"
                  ? "Stop recording"
                  : language === "fr"
                    ? "Arrêter l'enregistrement"
                    : language === "de"
                      ? "Aufnahme stoppen"
                      : "Detener grabación"
                : language === "en"
                  ? "Dictate message by voice"
                  : language === "fr"
                    ? "Dicter un message par la voix"
                    : language === "de"
                      ? "Nachricht per Sprache diktieren"
                      : "Dictar mensaje por voz"
            }
          >
            {isListening
              ? language === "en"
                ? "🎙️ Listening..."
                : language === "fr"
                  ? "🎙️ Écoute..."
                  : language === "de"
                    ? "🎙️ Höre zu..."
                    : "🎙️ Escuchando..."
              : language === "en"
                ? "🎙️ Dictate"
                : language === "fr"
                  ? "🎙️ Dicter"
                  : language === "de"
                    ? "🎙️ Diktieren"
                    : "🎙️ Dictar"}
          </button>

          {/* entrada TEXTO*/}
          <input
            type="text"
            placeholder={
              language === "en"
                ? "Type your message to the AI..."
                : language === "fr"
                  ? "Tapez votre message à l'IA..."
                  : language === "de"
                    ? "Schreibe deine Nachricht an die KI..."
                    : "Escribe tu mensaje a la IA..."
            }
            className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
          >
            {language === "en"
              ? "Send"
              : language === "fr"
                ? "Envoyer"
                : language === "de"
                  ? "Senden"
                  : "Enviar"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            {language === "en"
              ? "Close"
              : language === "fr"
                ? "Fermer"
                : language === "de"
                  ? "Schließen"
                  : "Cerrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

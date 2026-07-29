import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

export const useSpeech = () => {
  const { language: globalLang } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const getLocaleCode = (lang) => {
    const safeLang = typeof lang === "string" ? lang : globalLang;

    switch (safeLang.toLowerCase()) {
      case "en":
        return "en-US";
      case "fr":
        return "fr-FR";
      case "de":
        return "de-DE";
      case "es":
      default:
        return "es-ES";
    }
  };

  //----------------------------------------------
  // TEXTO A VOZ
  //---------------------------------------------
  // pregargar voces del navegador al montar el hook
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();

      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };

      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  // 🔊 SÍNTESIS DE VOZ (TTS)
  const speak = useCallback(
    (text, lang = globalLang) => {
      if (!("speechSynthesis" in window)) {
        alert("Tu navegador no soporta la reproducción de voz.");
        return;
      }

      // Detener cualquier reproducción en curso
      window.speechSynthesis.cancel();
      if (!text) return;

      const langLocale = getLocaleCode(lang);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langLocale;
      utterance.rate = 0.95; // Ritmo pausado y firme
      utterance.pitch = 0.9; // Tono más grave/masculino

      const voices = window.speechSynthesis.getVoices();
      const langPrefix = langLocale.split("-")[0];

      // 1. Prioridad: Buscar voces "Natural" o de "Google" en español
      let selectedVoice =
        voices.find(
          (v) =>
            v.lang.startsWith(langPrefix) &&
            (v.name.includes("Natural") || v.name.includes("Google")),
        ) || voices.find((v) => v.lang.startsWith(langPrefix));

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    },
    [globalLang],
  );

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const startListening = useCallback(
    (onSpeechResult, lang = globalLang) => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert("Tu navegador no soporta el micrófono.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getLocaleCode(lang);

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const textResult = event.results[0][0].transcript;
        setTranscript(textResult);

        if (onSpeechResult) {
          onSpeechResult(textResult);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      setTranscript("");
      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch (e) {
        console.warn("Error al iniciar micrófono:", e);
      }
    },
    [globalLang],
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [globalLang]);

  return {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isListening,
    transcript,
    setTranscript,
  };
};

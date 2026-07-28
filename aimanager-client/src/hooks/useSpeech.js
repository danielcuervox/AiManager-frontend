import { useState, useEffect, useCallback, useRef } from "react";

export const useSpeech = (defaultLang = "es") => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const getLocaleCode = (lang) => {
    const safeLang = typeof lang === "string" ? lang : "es";
    console.log(`llega un lang >>> ${lang} y ${safeLang}`);
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
  const speak = useCallback((text, lang = defaultLang) => {
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
  }, []);

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  //----------------------------------------------
  // TEXTO A VOZ
  //---------------------------------------------
  /* useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "es-ES";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const textResult = event.results[0][0].transcript;
        setTranscript(textResult);
      };

      recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []); */

  const startListening = useCallback(
    (lang = defaultLang) => {
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
      recognition.onresult = (event) =>
        setTranscript(event.results[0][0].transcript);
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
    [defaultLang],
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [defaultLang]);

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

/* const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no soporta la reproducción de voz.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "es-ES";
    utterance.rate = 0.95;
    utterance.pitch = 0.9;

    const voices = window.speechSynthesis.getVoices();

    const spanishVoice =
      voices.find(
        (v) => v.lang.startsWith("es") && v.name.toLowerCase().includes("male"),
      ) || voices.find((v) => v.lang.startsWith("es"));

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    window.speechSynthesis.speak(utterance);

    // Buscar voces "Naturales" de Microsoft o voces "Google"
    /*  let selectedVoice = voices.find(
      (v) =>
        v.lang.startsWith("es") &&
        (v.name.includes("Natural") || v.name.includes("Google")),
    );

    // 2. Si no encuentra las avanzadas, buscar cualquier voz en español (fallback)
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith("es"));
    }

    // 3. Asignar la voz si la encontró y reproducir
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance); 
  }; 
  */

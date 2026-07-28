import { useEffect, useCallback } from "react";

export const useSpeech = () => {
  // Precargar las voces del navegador al montar el hook
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();

      // En algunos navegadores como Chrome, las voces se cargan asíncronamente
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };

      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback((text) => {
    if (!("speechSynthesis" in window)) {
      alert("Tu navegador no soporta la reproducción de voz.");
      return;
    }

    // Detener cualquier reproducción en curso
    window.speechSynthesis.cancel();

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.95; // Ritmo pausado y firme
    utterance.pitch = 0.9; // Tono más grave/masculino

    const voices = window.speechSynthesis.getVoices();

    // 1. Prioridad: Buscar voces "Natural" o de "Google" en español
    let selectedVoice = voices.find(
      (v) =>
        v.lang.startsWith("es") &&
        (v.name.includes("Natural") || v.name.includes("Google")),
    );

    // 2. Fallback: Buscar cualquier voz en español
    if (!selectedVoice) {
      selectedVoice = voices.find((v) => v.lang.startsWith("es"));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, stop };
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

import React from "react";
import { useLanguage } from "../context/LanguageContext";

export const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: "es", label: "ES" },
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
  ];

  return (
    <div className="flex gap-1 bg-gray-800/80 p-1 rounded-lg border border-cyan-500/30">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
            language === lang.code
              ? "bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,242,254,0.5)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

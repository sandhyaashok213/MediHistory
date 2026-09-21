import { createContext, useContext, useState } from "react";

const VoiceLanguageContext = createContext(null);

export const VOICE_LANGUAGES = [
  {
    code: "en-IN",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "ta-IN",
    label: "Tamil",
    nativeLabel: "தமிழ்",
  },
  {
    code: "hi-IN",
    label: "Hindi",
    nativeLabel: "हिन्दी",
  },
];

export function VoiceLanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("voiceLanguage") || "en-IN";
  });

  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage);
    localStorage.setItem("voiceLanguage", newLanguage);
  };

  const selectedLanguage =
    VOICE_LANGUAGES.find(
      (item) => item.code === language
    ) || VOICE_LANGUAGES[0];

  return (
    <VoiceLanguageContext.Provider
      value={{
        language,
        setLanguage,
        selectedLanguage,
        languages: VOICE_LANGUAGES,
      }}
    >
      {children}
    </VoiceLanguageContext.Provider>
  );
}

export function useVoiceLanguage() {
  const context = useContext(VoiceLanguageContext);

  if (!context) {
    throw new Error(
      "useVoiceLanguage must be used inside VoiceLanguageProvider"
    );
  }

  return context;
}
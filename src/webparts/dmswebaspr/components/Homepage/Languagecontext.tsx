import React, { createContext, useContext, useState } from "react";

interface ILanguageContext {
  isArabic: boolean;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<ILanguageContext | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isArabic, setIsArabic] = useState(
    localStorage.getItem("isArabic") === "ar"
  );

  const toggleLanguage = () => {
    setIsArabic(prev => {
      const next = !prev;
      localStorage.setItem("isArabic", next ? "ar" : "en");
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ isArabic, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};

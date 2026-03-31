import { createContext, useContext } from "react";

export const LanguageContext = createContext({ lang: "en", setLang: () => {} });
export const UnitContext = createContext({ unit: "metric", setUnit: () => {} });

export const useLanguage = () => useContext(LanguageContext);
export const useUnit = () => useContext(UnitContext);
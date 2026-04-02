import { createContext, useContext } from 'react'

export const LanguageContext = createContext('en')
export const UnitContext = createContext('metric')

export const useLanguage = () => useContext(LanguageContext)
export const useUnit = () => useContext(UnitContext)

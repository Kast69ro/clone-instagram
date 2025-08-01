'use client'
import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { createTheme } from '@mui/material/styles'

const ThemeContext = createContext()

export const ThemeProviderCustom = ({ children }) => {
  // Состояние темы, инициализируем из localStorage или по умолчанию 'light'
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  // Синхронизируем класс dark у <html> и localStorage при изменении mode
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', mode)
  }, [mode])

  // Функция переключения темы
  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'))
  }
  // Создаем MUI тему с нужным режимом
  const theme = useMemo(() => createTheme({
    cssVarPrefix: 'mui',
    cssVariables: true,
    palette: { mode },
    typography: { fontFamily: 'var(--font-roboto)' },
  }), [mode])

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Хук для использования темы
export const useThemeMode = () => useContext(ThemeContext)

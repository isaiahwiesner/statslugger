import { useMediaQuery } from '@mui/material'
import React, { useEffect, useReducer } from 'react'

export const ThemeContext = React.createContext()

export const themeReducer = (state, action) => {
  switch (action.type) {
    case 'DARK_MODE':
      localStorage.setItem('__statslugger_theme__', JSON.stringify({...state, darkMode: true}))
      return { darkMode: true }
      case 'DEFAULT':
      localStorage.setItem('__statslugger_theme__', JSON.stringify({...state, darkMode: false}))
      return { darkMode: false }
    default:
      return state
  }
}
export function ThemeContextProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, {
    darkMode: false
  })

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  useEffect(() => {
    const theme = JSON.parse(localStorage.getItem('__statslugger_theme__'))
    if (!theme) {
      if (prefersDarkMode) {
        dispatch({type: 'DARK_MODE'})
      }
      else {
        dispatch({type: 'DEFAULT'})
      }
    }
    else {
      if (theme.darkMode) {
        dispatch({type: 'DARK_MODE'})
      }
      else {
        dispatch({type: 'DEFAULT'})
      }
    }
  }, [])

  const value = {
    ...state,
    dispatch
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
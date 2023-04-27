import React, { useEffect, useReducer, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import logo from '../vectors/StatSlugger-Red_White.svg'

export const AuthContext = React.createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    case 'UPDATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  useEffect(() => {
    const unsubscribe = async () => {
      const user = JSON.parse(localStorage.getItem('__statslugger_user__'))
      if (!user) {
        dispatch({ type: 'LOGOUT' })
        setLoading(false)
        return
      }
      try {
        const response = await fetch(process.env.REACT_APP_API_ROOT + '/api/user', {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        })
        const json = await response.json()
        if (response.ok) {
          const { accessToken } = user
          localStorage.setItem('__statslugger_user__', JSON.stringify({ ...json, accessToken }))
          dispatch({ type: 'LOGIN', payload: { ...json, accessToken } })
          setLoading(false)
        }
        else {
          dispatch({ type: 'LOGOUT' })
          localStorage.removeItem('__statslugger_user__')
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
        setError(e.message)
      }
    }
    unsubscribe()
  }, [])

  const value = {
    ...state,
    dispatch
  }

  return (
    <AuthContext.Provider value={value}>
      {loading && (
        <Box sx={{ display: 'grid', placeItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <img src={logo} alt="Stat Slugger" style={{ width: '10rem', height: 'auto' }} />
            <CircularProgress sx={{ color: '#ef4444' }} />
          </Box>
        </Box>
      )}
      {error && (
        <Box sx={{ display: 'grid', placeItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <img src={logo} alt="Stat Slugger" style={{ width: '10rem', height: 'auto' }} />
            <Typography>Unable to connect to API. Please try again later.</Typography>
          </Box>
        </Box>
      )}
      {!loading && !error && children}
    </AuthContext.Provider>
  )
}
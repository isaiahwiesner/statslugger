import React, { useEffect, useReducer, useState } from 'react'

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
      const response = await fetch(process.env.REACT_APP_API_ROOT + '/auth', {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        }
      })
      const json = await response.json()
      if (response.ok && json.validUser) {
        const { accessToken } = user
        localStorage.setItem('__statslugger_user__', JSON.stringify({...json, accessToken}))
        dispatch({ type: 'LOGIN', payload: {...json, accessToken} })
        setLoading(false)
      }
      else {
        dispatch({ type: 'LOGOUT' })
        localStorage.removeItem('__statslugger_user__')
        setLoading(false)
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
      {!loading && children}
    </AuthContext.Provider>
  )
}
import React, { useEffect, useReducer } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

export const PlayersContext = React.createContext()

export const playersReducer = (state, action) => {
  switch (action.type) {
    case 'ENABLE_LOADING':
      return { ...state, loading: true }
    case 'DISABLE_LOADING':
      return { ...state, loading: false }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] }
    case 'DELETE_PLAYER':
      return { ...state, players: [...state.players].filter(player => player._id !== action.payload)}
    case 'SET_PLAYERS':
      return { ...state, players: action.payload }
    case 'CLEAR_PLAYERS':
      return { ...state, players: null }

    default:
      return state
  }
}

export function PlayersProvider({ children }) {
  const { user } = useAuthContext()
  const [state, dispatch] = useReducer(playersReducer, {
    players: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    refreshPlayers()
  }, [user])

  const refreshPlayers = async () => {
    dispatch({ type: 'SET_ERROR', payload: null })
    dispatch({ type: 'ENABLE_LOADING' })
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: null })
      dispatch({ type: 'CLEAR_PLAYERS' })
      dispatch({ type: 'DISABLE_LOADING' })
      return
    }
    try {
      const response = await fetch(process.env.REACT_APP_API_ROOT + '/api/players', {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        }
      })
      const json = await response.json()
      if (!response.ok) {
        dispatch({ type: 'SET_ERROR', payload: json.error })
        dispatch({ type: 'CLEAR_PLAYERS' })
        dispatch({ type: 'DISABLE_LOADING' })
        return
      }
      dispatch({ type: 'SET_PLAYERS', payload: json })
      dispatch({ type: 'DISABLE_LOADING' })
    } catch (e) {
      dispatch({ type: 'DISABLE_LOADING' })
      dispatch({ type: 'SET_PLAYERS', payload: null })
    }
  }

  const value = {
    ...state,
    dispatch,
    refreshPlayers,
  }

  return (
    <PlayersContext.Provider value={value}>
      {children}
    </PlayersContext.Provider>
  )
}
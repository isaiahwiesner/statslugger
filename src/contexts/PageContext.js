import React, { useReducer } from 'react'

export const PageContext = React.createContext()

export const pageReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PAGE':
      return { page: action.payload }
    default:
      return state
  }
}

export function PageProvider({ children }) {
  const [state, dispatch] = useReducer(pageReducer, {
    page: null
  })

  const value = {
    ...state,
    dispatch
  }

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  )
}
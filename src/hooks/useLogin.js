import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorFields, setErrorFields] = useState([])
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setErrorFields([])
    setIsLoading(true)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
      if (json.errorFields) setErrorFields(json.errorFields)
    }
    if (response.ok) {
      localStorage.setItem('__statslugger_user__', JSON.stringify(json))
      dispatch({ type: 'LOGIN', payload: json })
      setIsLoading(false)
      setError(null)
      setErrorFields([])
    }
  }

  return {
    login,
    error,
    errorFields,
    isLoading
  }
}
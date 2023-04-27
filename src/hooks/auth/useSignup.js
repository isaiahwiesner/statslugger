import { useState } from 'react'
import { useAuthContext } from '../useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [errorFields, setErrorFields] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (displayName, email, password, confirmPassword) => {
    setError(null)
    setErrorFields([])
    setIsLoading(true)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ displayName, email, password, confirmPassword })
    })
    const json = await response.json()
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
      if (json.errorFields) setErrorFields(json.errorFields)
    }
    if (response.ok) {
      localStorage.setItem('__statslugger_user__', JSON.stringify(json))
      dispatch({type: 'LOGIN', payload: json})
      setIsLoading(false)
      setError(null)
      setErrorFields([])
    }
  }

  return {
    signup,
    error,
    errorFields,
    isLoading
  }
}
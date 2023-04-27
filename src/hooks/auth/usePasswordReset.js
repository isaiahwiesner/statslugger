import { useState } from 'react'

export const usePasswordReset = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorFields, setErrorFields] = useState([])

  const sendPasswordResetEmail = async (email) => {
    setIsLoading(true)
    setError(null)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/auth/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    if (response.ok) {
      setIsLoading(false)
      return json.email
    }
  }

  const validateToken = async (token) => {
    setIsLoading(true)
    setError(null)
    setErrorFields([])
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/auth/reset-password?token=' + token)
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    if (response.ok) {
      setIsLoading(false)
      return true
    }
  }

  const handlePasswordReset = async (token, password, confirmPassword) => {
    setIsLoading(true)
    setError(null)
    setErrorFields([])
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, password, confirmPassword })
    })
    const json = response.json()
    if (!response.ok) {
      setError(json.error)
      if (json.errorFields) setErrorFields(json.errorFields)
      setIsLoading(false)
      return false
    }
    if (response.ok) {
      setIsLoading(false)
      return true
    }
  }

  return {
    sendPasswordResetEmail,
    validateToken,
    handlePasswordReset,
    error,
    errorFields,
    isLoading,
  }
}
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useEmailConfirmation = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthContext()

  const sendConfirmation = async () => {
    setIsLoading(true)
    setError(null)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/auth/confirmation-email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      setIsLoading(false)
    }
    if (response.ok) {
      setIsLoading(false)
    }
  }

  const confirmEmail = async (token) => {
    setIsLoading(true)
    setError(null)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/auth/confirm-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.accessToken}`
      },
      body: JSON.stringify({ token })
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      setIsLoading(false)
      return json
    }
    if (response.ok) {
      setError(null)
      setIsLoading(false)
      return json
    }
  }

  return {
    sendConfirmation,
    confirmEmail,
    error,
    isLoading
  }
}
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useResetPhotoURL = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch, user } = useAuthContext()

  const resetPhotoURL = async () => {
    setError(null)
    setIsLoading(true)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/api/user/reset-profile-image', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    if (response.ok) {
      dispatch({ type: 'UPDATE', payload: { user: { ...user, photoURL: null } } })
      setIsLoading(false)
      return true
    }
  }

  return {
    resetPhotoURL,
    error, setError,
    isLoading
  }
}
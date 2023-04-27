import { useState } from 'react'
import { useAuthContext } from '../useAuthContext'

export const useChangePhotoURL = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch, user } = useAuthContext()

  const changePhotoURL = async (photoURL) => {
    setError(null)
    setIsLoading(true)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/api/user/update-profile-image', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ photoURL })
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      setIsLoading(false)
      return false
    }
    if (response.ok) {
      dispatch({ type: 'UPDATE', payload: { user: { ...user, photoURL } } })
      setIsLoading(false)
      return true
    }
  }

  return {
    changePhotoURL,
    error, setError,
    isLoading
  }
}
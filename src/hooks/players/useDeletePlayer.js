import { useState } from 'react'
import { useAuthContext } from '../useAuthContext'

export const useDeletePlayer = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { user } = useAuthContext()

  const deletePlayer = async (_id) => {
    setIsLoading(_id)
    setError(null)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/api/players/' + _id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      setIsLoading(null)
    }
    if (response.ok) {
      setIsLoading(null)
      return json
    }
  }

  return {
    deletePlayer,
    error,
    isLoading
  }
}
import { useState } from 'react'
import { useAuthContext } from '../useAuthContext'

export const useChangeDisplayName = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorFields, setErrorFields] = useState([])
  const { dispatch, user } = useAuthContext()

  const changeDisplayName = async (displayName) => {
    setError(null)
    setErrorFields([])
    setIsLoading(true)
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/api/user/update-displayname', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ displayName })
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      if (json.errorFields) setErrorFields(json.errorFields)
      setIsLoading(false)
      return false
    }
    if (response.ok) {
      dispatch({ type: 'UPDATE', payload: { user: { ...user, displayName } } })
      setIsLoading(false)
      return true
    }
  }

  return {
    changeDisplayName,
    error, setError,
    errorFields, setErrorFields,
    isLoading
  }
}
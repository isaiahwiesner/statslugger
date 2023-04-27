import { useState } from 'react'
import { useAuthContext } from '../useAuthContext'
import { useLogout } from '../auth/useLogout'

export const useChangeEmail = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorFields, setErrorFields] = useState([])
  const { user } = useAuthContext()
  const { logout } = useLogout()

  const changeEmail = async (email, password, agree) => {
    setError(null)
    setErrorFields([])
    setIsLoading(true)
    if (!agree) {
      setError('You must agree')
      setIsLoading(false)
      return
    }
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/api/user/update-email', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const json = await response.json()
    if (!response.ok) {
      setError(json.error)
      if (json.errorFields) setErrorFields(json.errorFields)
      setIsLoading(false)
      return false
    }
    if (response.ok) {
      logout()
    }
  }

  return {
    changeEmail,
    error, setError,
    errorFields, setErrorFields,
    isLoading
  }
}
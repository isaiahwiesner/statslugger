import { useState } from 'react'
import { useAuthContext } from '../useAuthContext'
import { usePlayersContext } from '../usePlayersContext'

export const useAddPlayer = () => {
  const { user } = useAuthContext()
  const { dispatch } = usePlayersContext()
  const [error, setError] = useState(null)
  const [errorFields, setErrorFields] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const addPlayer = async (firstName, lastName, number, position, privacy, teamID) => {
    const { uid } = user
    const data = { firstName, lastName, number, position, privacy }
    if (teamID) data.creator = { teamID }
    if (!teamID) data.creator = { uid }
    const response = await fetch(process.env.REACT_APP_API_ROOT + '/api/players', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const json = await response.json()
    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
      if (json.errorFields) setErrorFields(json.errorFields)
    }
    if (response.ok) {
      dispatch({ type: 'ADD_PLAYER', payload: json.player })
      setIsLoading(false)
      setError(null)
      setErrorFields([])
    }
    return json
  }

  return {
    addPlayer,
    error, setError,
    errorFields, setErrorFields,
    isLoading,
  }
}
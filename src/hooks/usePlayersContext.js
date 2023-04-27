import { PlayersContext } from '../contexts/PlayersContext'
import { useContext } from 'react'

export const usePlayersContext = () => {
  const context = useContext(PlayersContext)
  if (!context) {
    throw Error('usePlayersContext must be used in an PlayersContext provider')
  }
  return context
}
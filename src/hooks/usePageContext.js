import { PageContext } from '../contexts/PageContext'
import { useContext } from 'react'

export const usePageContext = () => {
  const context = useContext(PageContext)
  if (!context) {
    throw Error('usePageContext must be used in an PageContext provider')
  }
  return context
}
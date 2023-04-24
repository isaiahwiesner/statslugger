import { useEffect } from 'react'
import { usePageContext } from '../hooks/usePageContext'

export default function PageWrapper({ name, id, children }) {
  const { dispatch } = usePageContext()
  useEffect(() => {
    dispatch({ type: 'SET_PAGE', payload: { name, id } })
    document.title = name + ' | Stat Slugger'
  }, [name])
  return children
}
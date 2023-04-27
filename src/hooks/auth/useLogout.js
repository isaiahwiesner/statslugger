import { useAuthContext } from '../useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const logout = () => {
    localStorage.removeItem('__statslugger_user__')
    dispatch({type: 'LOGOUT'})
  }
  return {
    logout
  }
}
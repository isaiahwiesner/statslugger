import React, { useEffect } from 'react'
import { useEmailConfirmation } from '../../hooks/auth/useEmailConfirmation'
import { useParams } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Alert, Container } from '@mui/material'

export default function EmailConfirmation() {
  const { confirmEmail, error } = useEmailConfirmation()
  const { token } = useParams()
  const { dispatch, user } = useAuthContext()

  const handleConfirmation = async () => {
    const email = await confirmEmail(token)
    if (!email.error) {
      dispatch({ type: 'UPDATE', payload: { user: { ...user, emailVerified: true } } })
    }
  }
  useEffect(() => {
    handleConfirmation()
  }, [])

  return (
    <Container sx={{ mt: 10, mb: 2, display: 'flex', justifyContent: 'center' }}>
      {error && <Alert severity="error" sx={{ maxWidth: '30rem' }}>{error}</Alert>}
    </Container>
  )
}

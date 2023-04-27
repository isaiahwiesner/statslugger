import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useEmailConfirmation } from '../../hooks/auth/useEmailConfirmation'
import { Alert, Box, Button, Container, Typography } from '@mui/material'

export default function ConfirmEmail() {
  const { sendConfirmation, error, isLoading } = useEmailConfirmation()
  const { user } = useAuthContext()

  const handleClick = async () => {
    await sendConfirmation()
  }

  const handleClose = () => {
    window.close()
  }

  return (
    <Container sx={{
      mt: 10,
      mb: 2,
      display: 'flex',
      justifyContent: 'center'
    }}>
      {user.emailVerified && (
        <Box sx={{
          width: '100%',
          maxWidth: '30rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h1" sx={{ textAlign: 'center' }}>Email Verified</Typography>
          <Alert severity="success">You can close this page and return to your browser.</Alert>
          <Button variant="contained" onClick={handleClose}>Close</Button>
        </Box>
      )}
      {!user.emailVerified && (
        <Box sx={{
          width: '100%',
          maxWidth: '30rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h1" sx={{ textAlign: 'center' }}>Check your inbox</Typography>
          {!isLoading && !error && <Alert severity="success">We have sent a confirmation email to {user.email}. Click the link in the email to verify your address.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" disabled={isLoading} onClick={handleClick}>Send Email Confirmation</Button>
        </Box>
      )}
    </Container>
  )
}

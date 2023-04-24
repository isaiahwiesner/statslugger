import React, { useState } from 'react'
import { usePasswordReset } from '../hooks/usePasswordReset'
import { Alert, Box, Button, Card, Container, TextField, Typography } from '@mui/material'
import Loading from '../components/Loading'

export default function ForgotPassword() {
  const { sendPasswordResetEmail, error, isLoading } = usePasswordReset()

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const wasSent = await sendPasswordResetEmail(email)
    setSent(wasSent)
  }

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: '30rem', mt: 10, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            gap: 2,
            p: 2
          }}>
            <Loading loading={isLoading} />

            <Typography variant="h3" sx={{ textAlign: 'center' }}>Reset Password</Typography>

            {error && <Alert severity="error">{error}</Alert>}
            {sent && <Alert severity="success">Password reset link sent to {sent}</Alert>}

            <TextField
              type="email"
              label="Email"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" variant="contained" disabled={isLoading||!email}>
              Send Reset Link
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  )
}

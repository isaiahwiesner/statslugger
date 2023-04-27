import React, { useEffect, useState } from 'react'
import { usePasswordReset } from '../../hooks/auth/usePasswordReset'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Box, Button, Card, Container, Typography } from '@mui/material'
import Loading from '../../components/Loading'
import PasswordInput from '../../components/PasswordInput'

export default function ResetPassword() {
  const { validateToken, handlePasswordReset, error, errorFields, isLoading } = usePasswordReset()
  const { token } = useParams()
  const navigate = useNavigate()

  const [validated, setValidated] = useState(false)
  const validate = async () => {
    const success = await validateToken(token)
    setValidated(success)
  }
  useEffect(() => {
    validate()
  }, [])

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hidePass, setHidePass] = useState(true)
  const [hideConfirmPass, setHideConfirmPass] = useState(true)
  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await handlePasswordReset(token, password, confirmPassword)
    if (success) {
      navigate('/login')
    }
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

            {error && !errorFields && <Alert severity="error">{error}</Alert>}

            <PasswordInput
              label="New Password"
              disabled={isLoading}
              error={errorFields.includes('password')}
              helperText={errorFields.includes('password') && error}
              hidden={hidePass}
              toggle={() => setHidePass(!hidePass)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordInput
              label="Confirm New Password"
              disabled={isLoading}
              error={errorFields.includes('confirmPassword')}
              helperText={errorFields.includes('confirmPassword') && error}
              hidden={hideConfirmPass}
              toggle={() => setHideConfirmPass(!hideConfirmPass)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" variant="contained" disabled={isLoading || !validated || !password || !confirmPassword}>
              Reset Password
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  )
}

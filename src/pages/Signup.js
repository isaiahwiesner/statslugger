import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useSignup } from '../hooks/useSignup'
import { Alert, Box, Button, Card, Container, Link, TextField, Typography } from '@mui/material'
import Loading from '../components/Loading'
import PasswordInput from '../components/PasswordInput'

export default function Signup() {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hidePass, setHidePass] = useState(true)
  const [hideConfirmPass, setHideConfirmPass] = useState(true)
  const { signup, error, errorFields, isLoading } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await signup(displayName, email, password, confirmPassword)
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

            <Typography variant="h3" sx={{ textAlign: 'center' }}>Sign Up</Typography>

            {error && !errorFields && <Alert severity="error">{error}</Alert>}

            <TextField
              type="text"
              label="Name"
              disabled={isLoading}
              error={errorFields.includes('displayName')}
              helperText={errorFields.includes('displayName') && error}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <TextField
              type="email"
              label="Email"
              disabled={isLoading}
              error={errorFields.includes('email')}
              helperText={errorFields.includes('email') && error}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              label="Password"
              disabled={isLoading}
              error={errorFields.includes('password')}
              helperText={errorFields.includes('password') && error}
              hidden={hidePass}
              toggle={() => setHidePass(!hidePass)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordInput
              label="Confirm Password"
              disabled={isLoading}
              error={errorFields.includes('confirmPassword')}
              helperText={errorFields.includes('confirmPassword') && error}
              hidden={hideConfirmPass}
              toggle={() => setHideConfirmPass(!hideConfirmPass)}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button type="submit" variant="contained" disabled={isLoading || !displayName || !email || !password || !confirmPassword}>
              Sign up
            </Button>

            <Box>
              <Link component={RouterLink} to="/login" underline="always" color="link">
                <Typography>Have an account? Log in</Typography>
              </Link>
            </Box>
          </Box>
        </form>
      </Card>
    </Container>
  )
}

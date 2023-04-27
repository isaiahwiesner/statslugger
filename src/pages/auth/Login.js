import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useLogin } from '../../hooks/auth/useLogin'
import { Alert, Box, Button, Card, Container, Link, TextField, Typography } from '@mui/material'
import Loading from '../../components/Loading'
import PasswordInput from '../../components/PasswordInput'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hidePass, setHidePass] = useState(true)
  const { login, error, errorFields, isLoading } = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
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

            <Typography variant="h3" sx={{ textAlign: 'center' }}>Log In</Typography>

            {error && !errorFields && <Alert severity="error">{error}</Alert>}

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
              hidden={hidePass}
              toggle={() => setHidePass(!hidePass)}
              error={errorFields.includes('password')}
              helperText={errorFields.includes('password') && error}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" variant="contained" disabled={isLoading || !email || !password}>
              Log In
            </Button>

            <Box>
              <Link component={RouterLink} to="/signup" underline="always" color="link">
                <Typography>Need an account? Sign up</Typography>
              </Link>
              <Link component={RouterLink} to="/forgot-password" underline="always" color="link">
                <Typography>Forgot password</Typography>
              </Link>
            </Box>
          </Box>
        </form>
      </Card>
    </Container>
  )
}

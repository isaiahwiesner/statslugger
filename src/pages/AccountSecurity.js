import React, { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  TextField,
  Typography
} from '@mui/material'
import { useAuthContext } from '../hooks/useAuthContext'
import { useChangeEmail } from '../hooks/useChangeEmail'
import { useChangePassword } from '../hooks/useChangePassword'
import Loading from '../components/Loading'
import PasswordInput from '../components/PasswordInput'

export default function AccountSecurity() {
  const { user } = useAuthContext()
  const {
    changeEmail,
    error: emailError, setError: setEmailError,
    errorFields: emailErrorFields, setErrorFields: setEmailErrorFields,
    isLoading: emailIsLoading
  } = useChangeEmail()
  const {
    changePassword,
    error: passwordError, setError: setPasswordError,
    errorFields: passwordErrorFields, setErrorFields: setPasswordErrorFields,
    isLoading: passwordIsLoading
  } = useChangePassword()

  const [email, setEmail] = useState(user.email)
  const [emailPass, setEmailPass] = useState('')
  const [emailAgree, setEmailAgree] = useState(false)
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    await changeEmail(email, emailPass, emailAgree)
  }
  const handleEmailAgree = () => {
    setEmailAgree(!emailAgree)
  }
  const handleResetEmailForm = () => {
    setEmail(user.email)
    setEmailPass('')
  }
  const handleCloseEmailError = () => {
    setEmailError(null)
    setEmailErrorFields([])
  }
  const [hideEmailFormPass, setHideEmailFormPass] = useState(true)

  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passAgree, setPassAgree] = useState(false)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    await changePassword(currentPass, newPass, confirmPass, passAgree)
  }
  const handlePasswordAgree = () => {
    setPassAgree(!passAgree)
  }
  const handleResetPassForm = () => {
    setCurrentPass('')
    setNewPass('')
    setConfirmPass('')
  }
  const handleClosePassError = () => {
    setPasswordError(null)
    setPasswordErrorFields([])
  }
  const [hidePassFormPasswords, setHidePassFormPasswords] = useState({
    current: true,
    new: true,
    confirm: true
  })

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: '30Rem', mt: 10, mb: 2 }}>
        <form onSubmit={handleEmailSubmit}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            gap: 2,
            p: 2
          }}>
            <Loading loading={emailIsLoading} />

            <Typography variant="h3" sx={{ textAlign: 'center' }}>Change Email</Typography>

            {emailError && !emailErrorFields && <Alert severity="error" onClose={handleCloseEmailError}>{emailError}</Alert>}

            <TextField
              type="text"
              label="Email"
              disabled={emailIsLoading}
              error={emailErrorFields.includes('email')}
              helperText={emailErrorFields.includes('email') && emailError}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              label="Password"
              disabled={emailIsLoading}
              error={emailErrorFields.includes('password')}
              helperText={emailErrorFields.includes('password') && emailError}
              hidden={hideEmailFormPass}
              toggle={() => setHideEmailFormPass(!hideEmailFormPass)}
              value={emailPass}
              onChange={(e) => setEmailPass(e.target.value)}
            />

            <FormControlLabel control={
              <Checkbox disabled={emailIsLoading} checked={emailAgree} onClick={handleEmailAgree} />
            } label="I understand that I will be logged out" />

            <Button type="submit" variant="contained" disabled={emailIsLoading || email === user.email || !email || !emailPass || !emailAgree}>
              Change Email
            </Button>

            <Button type="button" variant="outlined" onClick={handleResetEmailForm} disabled={emailIsLoading || (email === user.email && !emailPass)}>
              Cancel
            </Button>
          </Box>
        </form>
        <Divider />
        <form onSubmit={handlePasswordSubmit}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            position: 'relative',
            p: 2
          }}>
            <Loading loading={passwordIsLoading} />

            <Typography variant="h3" sx={{ textAlign: 'center' }}>Change Password</Typography>

            {passwordError && <Alert severity="error" onClose={handleClosePassError}>{passwordError}</Alert>}

            <PasswordInput
              label="Current Password"
              disabled={passwordIsLoading}
              error={passwordErrorFields.includes('currentPassword')} helperText={passwordErrorFields.includes('currentPassword') && passwordError}
              hidden={hidePassFormPasswords.current}
              toggle={() => setHidePassFormPasswords({ ...hidePassFormPasswords, current: !hidePassFormPasswords.current })}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
            />

            <PasswordInput
              label="New Password"
              disabled={passwordIsLoading}
              error={passwordErrorFields.includes('password')} helperText={passwordErrorFields.includes('password') && passwordError}
              hidden={hidePassFormPasswords.new}
              toggle={() => setHidePassFormPasswords({ ...hidePassFormPasswords, new: !hidePassFormPasswords.new })}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />

            <PasswordInput
              label="Confirm New Password"
              disabled={passwordIsLoading}
              error={passwordErrorFields.includes('confirmPassword')} helperText={passwordErrorFields.includes('confirmPassword') && passwordError}
              hidden={hidePassFormPasswords.confirm}
              toggle={() => setHidePassFormPasswords({ ...hidePassFormPasswords, confirm: !hidePassFormPasswords.confirm })}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <FormControlLabel control={
              <Checkbox disabled={passwordIsLoading} checked={passAgree} onClick={handlePasswordAgree} />
            } label="I understand that I will be logged out" />

            <Button type="submit" variant="contained" disabled={passwordIsLoading || !currentPass || !newPass || !confirmPass || !passAgree}>
              Change Password
            </Button>

            <Button type="button" variant="outlined" onClick={handleResetPassForm} disabled={passwordIsLoading || (!currentPass && !newPass && !confirmPass)}>
              Cancel
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  )
}

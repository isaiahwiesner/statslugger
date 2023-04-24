import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { useThemeContext } from './hooks/useThemeContext'

// Theme
import { CssBaseline, ThemeProvider } from '@mui/material'
import defaultTheme from './themes/defaultTheme'
import darkTheme from './themes/darkTheme'

// Components
import Navbar from './components/Navbar'
import PageWrapper from './components/PageWrapper'

// Pages
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AccountProfile from './pages/AccountProfile'
import AccountSecurity from './pages/AccountSecurity'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EmailConfirmation from './pages/EmailConfirmation'
import ConfirmEmail from './pages/ConfirmEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {
  const { user } = useAuthContext()
  const { darkMode } = useThemeContext()
  return (
    <Router>
      <ThemeProvider theme={darkMode ? darkTheme : defaultTheme}>
        <CssBaseline />
        <Navbar />
        <Routes>

          <Route path="/" element={
            user
              ? user.emailVerified
                ? <PageWrapper name="Dashboard" id="dashboard"><Dashboard /></PageWrapper>
                : <Navigate to="/confirm-email" />
              : <PageWrapper name="Home" id="home"><Home /></PageWrapper>
          } />

          <Route path="/account/profile" element={
            user
              ? user.emailVerified
                ? <PageWrapper name="Profile" id="account-profile"><AccountProfile /></PageWrapper>
                : <Navigate to="/confirm-email" />
              : <Navigate to="/login" />
          } />

          <Route path="/account/security" element={
            user
              ? user.emailVerified
                ? <PageWrapper name="Security" id="account-security"><AccountSecurity /></PageWrapper>
                : <Navigate to="/confirm-email" />
              : <Navigate to="/login" />
          } />

          <Route path="/login" element={
            user
              ? user.emailVerified
                ? <Navigate to="/" />
                : <Navigate to="/confirm-email" />
              : <PageWrapper name="Log In" id="login"><Login /></PageWrapper>
          } />
          <Route path="/signup" element={
            user
              ? user.emailVerified
                ? <Navigate to="/" />
                : <Navigate to="/confirm-email" />
              : <PageWrapper name="Sign Up" id="signup"><Signup /></PageWrapper>
          } />
          <Route path="/emailconfirmation/:token" element={
            user
              ? user.emailVerified
                ? <Navigate to="/confirm-email" />
                : <PageWrapper name="Confirm Email" id="confirm-email"><EmailConfirmation /></PageWrapper>
              : <Navigate to="/login" />
          } />
          <Route path="/confirm-email" element={
            user
              ? <PageWrapper name="Confirm Email" id="confirm-email"><ConfirmEmail /></PageWrapper>
              : <Navigate to="/login" />
          } />
          <Route path="/forgot-password" element={
            user
              ? <Navigate to="/" />
              : <PageWrapper name="Reset Password" id="reset-password"><ForgotPassword /></PageWrapper>
          } />
          <Route path="/reset-password/:token" element={
            user
              ? <Navigate to="/" />
              : <PageWrapper name="Reset Password" id="reset-password"><ResetPassword /></PageWrapper>
          } />

        </Routes>
      </ThemeProvider>
    </Router>
  )
}

export default App

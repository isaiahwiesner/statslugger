import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Providers
import { AuthProvider } from './contexts/AuthContext'
import { PageProvider } from './contexts/PageContext'
import { ThemeContextProvider } from './contexts/ThemeContext'
import { PlayersProvider } from './contexts/PlayersContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PlayersProvider>
        <ThemeContextProvider>
          <PageProvider>
            <App />
          </PageProvider>
        </ThemeContextProvider>
      </PlayersProvider>
    </AuthProvider>
  </React.StrictMode>
)
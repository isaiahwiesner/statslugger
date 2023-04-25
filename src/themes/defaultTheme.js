import { createTheme } from '@mui/material'
import '@fontsource/roboto'

const defaultTheme = createTheme({
  palette: {
    primary: {
      light: '#ffdede',
      main: '#ef4444',
      dark: '#b91c1c',
      navbar: '#b91c1c'
    },
    background: {
      default: '#fafafa'
    },
    link: '#2196f3',
    admin: '#1aac83'
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    }
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      }
    }
  }
})

export default defaultTheme
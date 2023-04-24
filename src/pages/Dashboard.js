import React from 'react'
import { Container, Typography } from '@mui/material'

export default function Dashboard() {
  return (
    <Container sx={{ mt: 10, mb: 2 }}>
      <Typography variant="h1" sx={{ textAlign: 'center' }}>
        Dashboard
      </Typography>
    </Container>
  )
}

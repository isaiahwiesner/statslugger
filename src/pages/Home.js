import React from 'react'
import { Container, Typography } from '@mui/material'

export default function Home() {
  return (
    <Container sx={{ mt: 10, mb: 2 }}>
      <Typography variant="h1" sx={{ textAlign: 'center' }}>
        Home
      </Typography>
    </Container>
  )
}

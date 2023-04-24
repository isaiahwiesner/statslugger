import { Box, CircularProgress } from '@mui/material'
import React from 'react'

export default function Loading({ loading }) {
  return (
    <Box sx={{ display: loading?'grid':'none', placeItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <CircularProgress />
    </Box>
  )
}

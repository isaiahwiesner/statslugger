import React from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'

export default function PasswordInput({ variant, label, disabled, error, helperText, value, onChange, hidden, toggle }) {
  return (
    <TextField type={hidden?'password':'text'} variant={variant} label={label} disabled={disabled} error={error} helperText={helperText} value={value} onChange={onChange} InputProps={{
      endAdornment: <IconButton size="small" sx={{ width: 24, height: 24}} onClick={toggle}>
        {hidden?<VisibilityOff sx={{ width: 18, height: 18 }} />:<Visibility sx={{ width: 18, height: 18 }} />}
      </IconButton>
    }} />
  )
}

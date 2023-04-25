import React, { useState } from 'react'
import { useImageUpload } from '../hooks/useImageUpload'
import { Alert, Box, Button, Card, Divider, IconButton, Modal, TextField, Typography } from '@mui/material'
import { Add, Clear, Delete } from '@mui/icons-material'
import getBase64 from '../utils/getBase64'
import Loading from './Loading'
import isImage from '../utils/isImage'

export default function ImageUploadModal({ open, onClose, onSuccess }) {
  const { uploadImage, error, setError, isLoading, setIsLoading } = useImageUpload()
  const [file, setFile] = useState(null)
  const [base64, setBase64] = useState(null)
  const [selectFileError, setSelectFileError] = useState(null)
  const [photoURL, setPhotoURL] = useState(null)
  const [urlError, setUrlError] = useState(null)
  const [urlErrorFields, setUrlErrorFields] = useState([])
  const handleSelectFile = (e) => {
    setSelectFileError(null)
    const selectedFile = e.target.files[0]
    if (!selectedFile) return
    if (selectedFile.size > 10000000) {
      setSelectFileError('File too large')
    }
    else {
      setFile(selectedFile)
      getBase64(selectedFile, setBase64)
    }
  }

  const handleUpload = async () => {
    if (base64) {
      const link = await uploadImage(base64)
      if (link) {
        onSuccess(link)
        handleOnClose()
      }
    }
    if (photoURL) {
      setIsLoading(true)
      setUrlError(null)
      setUrlErrorFields([])
      const valid = await isImage(photoURL)
      if (!valid) {
        setUrlError('Invalid image URL')
        setUrlErrorFields(['photoURL'])
        setIsLoading(false)
      }
      if (valid) {
        onSuccess(photoURL)
        handleOnClose()
      }
    }
  }

  const handleOnClose = () => {
    onClose()
    setIsLoading(false)
    setFile(null)
    setError(null)
    setSelectFileError(null)
    setBase64(null)
    setPhotoURL(null)
    setUrlError(null)
    setUrlErrorFields([])
  }

  const handleResetPhotoURL = () => {
    setPhotoURL('')
    setUrlError(null)
    setUrlErrorFields([])
  }

  const handleResetFile = () => {
    setFile(null)
    setError(null)
    setSelectFileError(null)
    setBase64(null)
  }

  return (
    <Modal open={open} onClose={!isLoading ? handleOnClose : null} sx={{ display: 'grid', placeItems: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: '30rem', position: 'relative' }}>
        <Loading loading={isLoading} />
        <Box sx={{ p: 2 }}>
          <Typography variant="h3">Upload Image</Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          {selectFileError && <Alert severity="error" sx={{ width: '100%' }}>{selectFileError}</Alert>}
          {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
          <label htmlFor="upload-btn">
            <input
              style={{ display: 'none' }}
              id="upload-btn"
              type="file"
              onChange={handleSelectFile}
              accept='.png,.jpeg,.jpg,.gif'
              disabled={isLoading || photoURL}
            />

            <Button variant="outlined" component="span" disabled={isLoading || photoURL}>
              <Add />
            </Button>
          </label>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography>{file ? file.name : 'Select File'}</Typography>
            {file && (
              <IconButton size="small" sx={{ width: 24, height: 24 }} onClick={handleResetFile}>
              <Delete sx={{ width: 18, height: 18 }} />
            </IconButton>
            )}
          </Box>
        </Box>
        <Divider>OR</Divider>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
          {urlError && !urlErrorFields && <Alert severity="error" sx={{ width: '100%' }}>{urlError}</Alert>}
          <TextField
            type="text"
            label="Paste image URL"
            sx={{ width: '100%' }}
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            disabled={isLoading || base64 || file}
            error={urlError}
            helperText={urlErrorFields.includes('photoURL') && urlError}
            InputProps={{
              endAdornment: <IconButton size="small" sx={{ width: 24, height: 24 }} onClick={handleResetPhotoURL}>
                {photoURL && <Clear sx={{ width: 18, height: 18 }} />}
              </IconButton>
            }}
          />
        </Box>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'end', gap: 2 }}>
          <Button variant="text" onClick={handleOnClose} disabled={isLoading}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload} disabled={isLoading || (!base64 && !photoURL)}>Upload</Button>
        </Box>
      </Card>
    </Modal>
  )
}

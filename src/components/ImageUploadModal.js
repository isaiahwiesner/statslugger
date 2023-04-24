import React, { useState } from 'react'
import { useImageUpload } from '../hooks/useImageUpload'
import { Alert, Box, Button, Card, Divider, IconButton, Modal, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import getBase64 from '../utils/getBase64'
import Loading from './Loading'

export default function ImageUploadModal({ open, onClose, onSuccess }) {
  const { uploadImage, error, setError, isLoading } = useImageUpload()
  const [file, setFile] = useState(null)
  const [base64, setBase64] = useState(null)
  const [selectFileError, setSelectFileError] = useState(null)
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
    const link = await uploadImage(base64)
    if (link) {
      onSuccess(link)
      handleOnClose()
    }
  }

  const handleOnClose = () => {
    onClose()
    setError(null)
    setFile(null)
    setBase64(null)
    setSelectFileError(null)
  }

  return (
    <Modal open={open} onClose={!isLoading?handleOnClose:null} sx={{ display: 'grid', placeItems: 'center' }}>
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
            />

            <Button variant="outlined" component="span" disabled={isLoading}>
              <Add />
            </Button>
          </label>
          <Typography>{file?file.name:'Select File'}</Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'end', gap: 2 }}>
          <Button variant="text" onClick={handleOnClose} disabled={isLoading}>Cancel</Button>
          <Button variant="contained" onClick={handleUpload} disabled={isLoading||!file}>Upload</Button>
        </Box>
      </Card>
    </Modal>
  )
}

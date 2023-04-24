import React, { useState } from 'react'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { useChangeDisplayName } from '../hooks/useChangeDisplayName'
import { useAuthContext } from '../hooks/useAuthContext'
import ImageUploadModal from '../components/ImageUploadModal'
import { useChangePhotoURL } from '../hooks/useChangePhotoURL copy'
import { useResetPhotoURL } from '../hooks/useResetPhotoURL'
import Loading from '../components/Loading'


export default function AccountProfile() {
  const { user } = useAuthContext()
  const {
    changeDisplayName,
    error: displayNameError, setError: setDisplayNameError,
    errorFields: displayNameErrorFields, setErrorFields: setDisplayNameErrorFields,
    isLoading: displayNameIsLoading
  } = useChangeDisplayName()
  const {
    changePhotoURL,
    error: changePhotoError, setError: setChangePhotoError,
    isLoading: changePhotoIsLoading
  } = useChangePhotoURL()
  const {
    resetPhotoURL,
    error: resetPhotoError, setError: setResetPhotoError,
    isLoading: resetPhotoIsLoading
  } = useResetPhotoURL()

  const [displayName, setDisplayName] = useState(user.displayName)
  const [displayNameSuccess, setDisplayNameSuccess] = useState(false)
  const handleNameSubmit = async (e) => {
    e.preventDefault()
    const success = await changeDisplayName(displayName)
    setDisplayNameSuccess(success)
  }
  const handleResetDisplayName = () => {
    setDisplayName(user.displayName)
    setDisplayNameError(null)
    setDisplayNameErrorFields([])
  }
  const handleCloseDisplayNameError = () => {
    setDisplayNameError(null)
    setDisplayNameErrorFields([])
  }

  const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false)
  const handleOpenImageUploadModal = () => {
    setImageUploadModalOpen(true)
  }
  const handleCloseImageUploadModal = () => {
    setImageUploadModalOpen(false)
  }
  const [photoUrl, setPhotoUrl] = useState(null)
  const [imageSuccess, setImageSuccess] = useState(false)
  const handleImageSubmit = async () => {
    const success = await changePhotoURL(photoUrl)
    setPhotoUrl(null)
    if (success) setImageSuccess('Profile image updated!')
  }
  const handleImageReset = async () => {
    const success = await resetPhotoURL()
    if (success) setImageSuccess('Profile image removed!')
  }

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ width: '100%', maxWidth: '30Rem', mt: 10, mb: 2 }}>
        <form onSubmit={handleNameSubmit}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            gap: 2,
            p: 2
          }}>
            <Loading loading={displayNameIsLoading} />

            <Typography variant="h3" sx={{ textAlign: 'center' }}>Change Name</Typography>

            {displayNameError && !displayNameErrorFields && <Alert severity="error" onClose={handleCloseDisplayNameError}>{displayNameError}</Alert>}
            {displayNameSuccess && <Alert severity="success" onClose={() => setDisplayNameSuccess(false)}>Name successfully updated!</Alert>}

            <TextField
              type="text"
              label="Name"
              disabled={displayNameIsLoading}
              error={displayNameErrorFields.includes('displayName')}
              helperText={displayNameErrorFields.includes('displayName') && displayNameError}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <Button type="submit" variant="contained" disabled={displayNameIsLoading || displayName === user.displayName || displayName === ''}>
              Change name
            </Button>

            <Button type="button" variant="outlined" disabled={displayNameIsLoading || displayName === user.displayName} onClick={handleResetDisplayName}>
              Cancel
            </Button>
          </Box>
        </form>
        <Divider />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          gap: 2,
          p: 2
        }}>
          <Loading loading={changePhotoIsLoading || resetPhotoIsLoading} />

          <Typography variant="h3" sx={{ textAlign: 'center' }}>Change Profile Image</Typography>

          {changePhotoError && <Alert severity="error" onClose={() => setChangePhotoError(null)}>{changePhotoError}</Alert>}
          {resetPhotoError && <Alert severity="error" onClose={() => setResetPhotoError(null)}>{resetPhotoError}</Alert>}
          {imageSuccess && <Alert severity="success" onClose={() => setImageSuccess(null)}>{imageSuccess}</Alert>}

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Upload image">
              <IconButton sx={{ color: 'white' }} onClick={handleOpenImageUploadModal}>
                <Avatar alt={user.displayName} src={photoUrl || user.photoURL} sx={{ width: '6rem', height: '6rem' }} />
              </IconButton>
            </Tooltip>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="contained" onClick={handleImageSubmit} disabled={changePhotoIsLoading || resetPhotoIsLoading || !photoUrl}>Save</Button>
              <Button variant="outlined" onClick={handleImageReset} disabled={changePhotoIsLoading || resetPhotoIsLoading || !user.photoURL}>Reset Image</Button>
            </Box>
          </Box>
          <ImageUploadModal open={imageUploadModalOpen} onClose={handleCloseImageUploadModal} onSuccess={setPhotoUrl} />
        </Box>
      </Card>
    </Container>
  )
}

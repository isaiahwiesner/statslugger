import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Avatar, Box, Button, Card, Modal, Typography } from '@mui/material'
import { useDeletePlayer } from '../hooks/players/useDeletePlayer'
import Loading from './Loading'
import { usePlayersContext } from '../hooks/usePlayersContext'
import { useAuthContext } from '../hooks/useAuthContext'

export default function PlayerCard({ player }) {
  const { user } = useAuthContext()
  const { dispatch } = usePlayersContext()
  const { deletePlayer, isLoading } = useDeletePlayer()
  const [confirmModal, setConfirmModal] = useState(false)
  const handleOpenConfirm = () => {
    setConfirmModal(true)
  }
  const handleCloseConfirm = () => {
    setConfirmModal(false)
  }
  const handleDeletePlayer = async () => {
    handleCloseConfirm()
    const json = await deletePlayer(player._id)
    if (json.player) {
      dispatch({ type: 'DELETE_PLAYER', payload: player._id })
    }
  }
  return (
    <Card sx={{ width: '100%', p: 2, position: 'relative', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
        <Avatar sx={{ width: '4rem', height: '4rem' }} src={player.photoURL} alt={`${player.firseName} ${player.lastName}`} />
        <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography noWrap sx={{ width: '100%' }}>
            <Typography variant="span" color="text.secondary">#{player.number}</Typography> {player.firstName} {player.lastName}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* <Button disabled={Boolean(isLoading)} variant="text" component={RouterLink} to={`/players/${player._id}`}>
            View
          </Button> */}
          <Button disabled={Boolean(isLoading)} variant="text">
            View
          </Button>
          {(user.uid === player.creator.uid || player.editors.includes(user.uid)) && (
            // <Button disabled={Boolean(isLoading)} variant="outlined" component={RouterLink} to={`/players/${player._id}/edit`}>
            //   Edit
            // </Button>
            <Button disabled={Boolean(isLoading)} variant="outlined">
              Edit
            </Button>
          )}
        </Box>
        {user.uid === player.creator.uid && (
          <Button disabled={Boolean(isLoading)} variant="contained" onClick={handleOpenConfirm}>
            Delete
          </Button>
        )}
      </Box>
      <Modal open={confirmModal} onClose={handleCloseConfirm} sx={{ display: 'grid', placeItems: 'center' }}>
        <Box sx={{ minWidth: '20rem', maxWidth: '100%', position: 'relative', p: { xs: 2, md: 0 } }}>
          <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', p: 2 }}>
            <Typography sx={{ textAlign: 'center' }}>Are you sure you want to delete <strong>"{player.firstName} {player.lastName}"</strong>?</Typography>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)', width: '100%' }}>
              <Button variant="text" onClick={handleDeletePlayer}>Yes</Button>
              <Button variant="contained" onClick={handleCloseConfirm}>No</Button>
            </Box>
          </Card>
        </Box>
      </Modal>
      <Loading loading={isLoading === player._id} />
    </Card>
  )
}

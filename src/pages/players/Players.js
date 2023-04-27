import React, { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, Container, FormControl, IconButton, InputLabel, Link, ListItemIcon, Menu, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import Loading from '../../components/Loading'
import PlayerCard from '../../components/PlayerCard'
import { Add, Cancel, Sort } from '@mui/icons-material'
import { usePlayersContext } from '../../hooks/usePlayersContext'
import { useAddPlayer } from '../../hooks/players/useAddPlayer'

export default function Players() {
  const {
    players,
    loading: playersContextLoading,
    error: playersContextError,
    refreshPlayers,
  } = usePlayersContext()
  const {
    addPlayer,
    isLoading: addIsLoading,
    error: addError, setError: setAddError,
    errorFields: addErrorFields, setErrorFields: setAddErrorFields,
  } = useAddPlayer()

  const sort = {
    name: {
      name: 'Name',
      cb: (a, b) => {
        if (a.lastName > b.lastName) return 1
        if (a.lastName < b.lastName) return -1
        if (a.firstName > b.firstName) return 1
        if (a.firstName < b.firstName) return -1
        if (a.number > b.number) return 1
        if (a.number < b.number) return -1
        return 0
      }
    },
    nameReverse: {
      name: 'Name (Reverse)',
      cb: (a, b) => {
        if (a.lastName > b.lastName) return -1
        if (a.lastName < b.lastName) return 1
        if (a.firstName > b.firstName) return -1
        if (a.firstName < b.firstName) return 1
        if (a.number > b.number) return 1
        if (a.number < b.number) return -1
        return 0
      }
    },
    number: {
      name: 'Number',
      cb: (a, b) => {
        if (a.number > b.number) return 1
        if (a.number < b.number) return -1
        if (a.lastName > b.lastName) return 1
        if (a.lastName < b.lastName) return -1
        if (a.firstName > b.firstName) return 1
        if (a.firstName < b.firstName) return -1
        return 0
      }
    },
    numberReverse: {
      name: 'Number (Reverse)',
      cb: (a, b) => {
        if (a.number > b.number) return -1
        if (a.number < b.number) return 1
        if (a.lastName > b.lastName) return 1
        if (a.lastName < b.lastName) return -1
        if (a.firstName > b.firstName) return 1
        if (a.firstName < b.firstName) return -1
        return 0
      }
    },
  }
  const [search, setSearch] = useState('')
  const [currentSort, setCurrentSort] = useState(sort.name)
  const [searchPlayers, setSearchPlayers] = useState([])
  const updateSearchPlayers = () => {
    if (!players) return
    const sorted = [...players].sort(currentSort.cb)
    if (!search) return setSearchPlayers(sorted)
    const searched = sorted.filter((player) => {
      if (player.lastName.toLowerCase().includes(search.toLowerCase())) return player
      if (player.firstName.toLowerCase().includes(search.toLowerCase())) return player
      if (player.number.toString().includes(search.toLowerCase())) return player
      return null
    })
    setSearchPlayers(searched)
  }
  const handleClearSearch = () => {
    setSearch('')
    setSearchPlayers(players)
  }
  useEffect(() => {
    updateSearchPlayers()
  }, [players, currentSort])
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      updateSearchPlayers()
    }, 100)
    return () => clearTimeout(debounceTimeout)
  }, [search])
  const [sortMenu, setSortMenu] = useState(null)
  const handleOpenSortMenu = (e) => {
    setSortMenu(e.currentTarget)
  }
  const handleCloseSortMenu = () => {
    setSortMenu(null)
  }

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [number, setNumber] = useState(1)
  const [position, setPosition] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const handleAddPlayer = async (e) => {
    e.preventDefault()
    const player = await addPlayer(firstName, lastName, number, position, privacy)
    if (!player.error) {
      handleCloseAddModal()
    }
  }
  const [addModal, setAddModal] = useState(false)
  const handleOpenAddModal = () => {
    setAddModal(true)
  }
  const handleCloseAddModal = () => {
    setAddModal(false)
    setAddError(null)
    setAddErrorFields([])
    setFirstName('')
    setLastName('')
    setNumber(1)
    setPosition('')
    setPrivacy('public')
  }

  if (playersContextLoading) return (
    <Loading loading={true} />
  )

  if (playersContextError) return (
    <Box sx={{ display: 'grid', placeItems: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography>Unable to fetch players. Please try again later.</Typography>
        <Button variant="contained" sx={{ width: '100%', maxWidth: '30rem' }} onClick={() => refreshPlayers()}>
          Refresh
        </Button>
      </Box>
    </Box>
  )

  return (
    <Container sx={{ mt: 10, mb: 2, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
        <Box sx={{
          width: { xs: '20rem', md: '41rem', lg: '62rem' },
          display: 'grid',
          gap: 1,
          gridTemplateColumns: '1fr auto'
        }}>
          <TextField
            type="text"
            label="Search Players"
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: search && (
                <IconButton size="small" sx={{ width: 24, height: 24 }} onClick={handleClearSearch}>
                  <Cancel sx={{ width: 18, height: 18 }} />
                </IconButton>
              )
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'end', gap: 1 }}>
            <IconButton size="small" onClick={handleOpenAddModal}>
              <Add />
            </IconButton>
            <IconButton size="small" onClick={handleOpenSortMenu}>
              <Sort />
            </IconButton>
            <Menu
              open={Boolean(sortMenu)}
              anchorEl={sortMenu}
              onClose={handleCloseSortMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top' }}
            >
              {Object.keys(sort).map((id) => {
                return (
                  <MenuItem
                    key={id}
                    onClick={() => {
                      handleCloseSortMenu()
                      setCurrentSort(sort[id])
                    }}
                    selected={Boolean(currentSort.name === sort[id].name)}
                  >
                    {sort[id].name}
                  </MenuItem>
                )
              })}
            </Menu>
          </Box>
        </Box>
        {searchPlayers && (
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '20rem', md: 'repeat(2, 20rem)', lg: 'repeat(3, 20rem)' } }}>
            {searchPlayers.map((player) => {
              return <PlayerCard key={player._id} player={player} />
            })}
          </Box>
        )}
        {search && searchPlayers?.length < 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <Typography sx={{ textAlign: 'center' }}>
              No results
            </Typography>
            <Typography sx={{ textAlign: 'center' }}>
              <Link color="text.secondary" onClick={handleClearSearch} sx={{ cursor: 'pointer' }}>
                Clear search
              </Link>
            </Typography>
          </Box>
        )}
      </Box>

      <Modal open={addModal} onClose={!addIsLoading ? handleCloseAddModal : null} sx={{ display: 'grid', placeItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '30rem', position: 'relative', p: { xs: 2, md: 0 } }}>
          <Card sx={{ width: '100%', maxHeight: '80vh', overFlow: 'scroll' }}>
            <form onSubmit={handleAddPlayer}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                gap: 2,
                p: 2
              }}>
                <Loading loading={addIsLoading} />

                <Typography variant="h3" sx={{ textAlign: 'center' }}>Add Player</Typography>

                {addError && !addErrorFields && <Alert severity="error">{addError}</Alert>}

                <TextField
                  type="text"
                  label="First Name"
                  disabled={addIsLoading}
                  error={addErrorFields.includes('firstName')}
                  helperText={addErrorFields.includes('firstName') && addError}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <TextField
                  type="text"
                  label="Last Name"
                  disabled={addIsLoading}
                  error={addErrorFields.includes('lastName')}
                  helperText={addErrorFields.includes('lastName') && addError}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />

                <TextField
                  type="number"
                  label="Number"
                  disabled={addIsLoading}
                  error={addErrorFields.includes('number')}
                  helperText={addErrorFields.includes('number') && addError}
                  value={number}
                  InputProps={{ inputProps: { min: 1, max: 99 } }}
                  onChange={(e) => {
                    const v = e.target.value
                    if (!parseInt(v) || isNaN(parseInt(v))) return setNumber(1)
                    if (v < 1) return setNumber(1)
                    if (v > 99) return setNumber(99)
                    setNumber(e.target.value)
                  }}
                />

                <FormControl variant="standard">
                  <InputLabel>Position</InputLabel>
                  <Select value={position} onChange={(e) => setPosition(e.target.value)} disabled={addIsLoading}>
                    <MenuItem value="p">Pitcher</MenuItem>
                    <MenuItem value="c">Catcher</MenuItem>
                    <MenuItem value="1b">First Base</MenuItem>
                    <MenuItem value="2b">Second Base</MenuItem>
                    <MenuItem value="3b">Third Base</MenuItem>
                    <MenuItem value="ss">Shortstop</MenuItem>
                    <MenuItem value="lf">Left Field</MenuItem>
                    <MenuItem value="cf">Center Field</MenuItem>
                    <MenuItem value="rf">Right Field</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="standard">
                  <InputLabel>Privacy</InputLabel>
                  <Select value={privacy} onChange={(e) => setPrivacy(e.target.value)} disabled={addIsLoading}>
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}>
                  <Button variant="text" onClick={handleCloseAddModal} disabled={addIsLoading}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={addIsLoading || (!firstName || !lastName || !number || !position)}>Add</Button>
                </Box>
              </Box>
            </form>
          </Card>
        </Box>
      </Modal>
    </Container>
  )
}

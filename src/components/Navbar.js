import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Avatar,
  Box,
  Collapse,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Switch,
  Tooltip,
  Typography
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Lock as SecurityIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as AccountIcon,
  PersonAdd as SignupIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  CheckCircle as EmailVerifiedIcon,
  Error as EmailUnverifiedIcon,
  VerifiedUser as AdminIcon,
} from '@mui/icons-material'

import { useAuthContext } from '../hooks/useAuthContext'
import { usePageContext } from '../hooks/usePageContext'
import { useLogout } from '../hooks/useLogout'

import logo from '../vectors/StatSlugger-White_Red.svg'
import { useThemeContext } from '../hooks/useThemeContext'

export default function Navbar() {
  const { page } = usePageContext()
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const { dispatch, darkMode } = useThemeContext()

  const [anchorElUser, setAnchorElUser] = useState(null)
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const [navMenu, setNavMenu] = useState(false)
  const handleOpenNavMenu = () => {
    setNavMenu(true)
  }
  const handleCloseNavMenu = () => {
    setNavMenu(false)
  }
  const navItems = [
    {
      name: 'Home',
      id: 'home',
      path: '/',
      auth: false,
      icon: HomeIcon
    },
    {
      name: 'Dashboard',
      id: 'dashboard',
      path: '/',
      auth: true,
      icon: DashboardIcon
    }
  ]
  const authItems = [
    {
      name: 'Log in',
      id: 'login',
      path: '/login',
      auth: false,
      icon: LoginIcon
    },
    {
      name: 'Sign up',
      id: 'signup',
      path: '/signup',
      auth: false,
      icon: SignupIcon
    },
    {
      name: 'Account',
      id: 'account',
      auth: true,
      icon: SettingsIcon,
      subpages: [
        {
          name: 'Profile',
          id: 'account-profile',
          path: '/account/profile',
          auth: true,
          icon: AccountIcon
        },
        {
          name: 'Security',
          id: 'account-security',
          path: '/account/security',
          auth: true,
          icon: SecurityIcon
        },
        {
          name: 'Log out',
          id: 'logout',
          action: logout,
          auth: true,
          icon: LogoutIcon
        }
      ]
    },
  ]

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      height: '4rem',
      bgcolor: 'primary.navbar'
    }}>
      <Container sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        height: '100%'
      }}>

        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size="medium" sx={{ color: 'white' }} onClick={handleOpenNavMenu}>
            <MenuIcon sx={{ width: '2rem', height: '2rem' }} />
          </IconButton>
          <Typography noWrap variant="h3" sx={{ color: 'white', display: {xs: 'none', md: 'block'} }}>
            {page?.name}
          </Typography>
        </Box>

        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography noWrap variant="h3" sx={{ color: 'white', display: {xs: 'block', md: 'none'} }}>
            {page?.name}
          </Typography>
          <Link component={RouterLink} to="/" sx={{ display: {xs: 'none', md: 'block'} }}>
            <img src={logo} alt="Stat Slugger" style={{ height: '2.5rem', width: 'auto' }} />
          </Link>
        </Box>

        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
          <IconButton size="medium" sx={{ color: 'white' }} onClick={handleOpenUserMenu}>
            <Avatar alt={user && user.displayName} src={user && user.photoURL} />
          </IconButton>
          <UserMenu />
        </Box>
      </Container>
      <Drawer
        anchor="left"
        open={navMenu}
        onClose={handleCloseNavMenu}
      >
        <Box
          sx={{ top: 0, bottom: 0, width: 250 }}
          role="presentation"
        >
          <List>
            {navItems.map((item) => {
              return <NavItem item={item} key={item.id} />
            })}
            <Divider />
            {authItems.map((item) => {
              return <NavItem item={item} key={item.id} />
            })}
            <ListItem disablePadding sx={{ py: 0.5 }}>
              <ListItemIcon>
                <Switch checked={darkMode} onClick={(e) => {
                  if (e.target.checked) {
                    dispatch({ type: 'DARK_MODE' })
                  }
                  else {
                    dispatch({ type: 'DEFAULT' })
                  }
                }} />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" sx={{ ml: 1.5 }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  )

  function UserMenu() {
    return (
      <Menu
        sx={{ mt: 6, py: 0 }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {user && (
          <Box sx={{ px: 1.5, py: 0.5, width: '20rem', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
              <Avatar alt={user.displayName} src={user.photoURL} sx={{ width: '4rem', height: '4rem' }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography noWrap sx={{ fontSize: '20px', maxWidth: '11.75rem' }}>{user.displayName}</Typography>
                  {user.emailVerified && user.group === 'admin' && (
                    <Tooltip title="Admin">
                      <AdminIcon sx={{ color: 'admin' }} />
                    </Tooltip>
                  )}
                  {!user.emailVerified && (
                    <Tooltip title="Email Unverified">
                      <EmailUnverifiedIcon color="warning" />
                    </Tooltip>
                  )}
                </Box>
                <Typography noWrap sx={{ maxWidth: '13.5rem', fontSize: '14px' }}>{user.email}</Typography>
              </Box>
            </Box>
          </Box>
        )}
        {!user && (
          <Box sx={{ px: 1, py: 0.5, width: '20rem', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 2 }}>
            <Avatar alt={null} src={null} sx={{ width: '4rem', height: '4rem' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography noWrap sx={{ fontSize: '20px' }}>Logged out</Typography>
            </Box>
          </Box>
        )}
      </Menu>
    )
  }

  function NavItem({ item, subitem }) {
    const [collapseOpen, setCollapseOpen] = useState(false)
    if (!user && item.auth) return null
    if (user && !item.auth) return null
    if (item.subpages) return (
      <div>
        <ListItemButton onClick={() => setCollapseOpen(!collapseOpen)} sx={subitem ? { pl: 4 } : {}}>
          <ListItemIcon sx={(page?.id === item.id || item.subpages.filter(sub => sub.id === page?.id).length > 0) ? { color: 'primary.main' } : {}}>
            <item.icon />
          </ListItemIcon>
          <ListItemText primary={item.name} sx={(page?.id === item.id || item.subpages.filter(sub => sub.id === page?.id).length > 0) ? { color: 'primary.main' } : {}} />
          {collapseOpen
            ? <ExpandLess sx={(page?.id === item.id || item.subpages.filter(sub => sub.id === page?.id).length > 0) ? { color: 'primary.main' } : {}} />
            : <ExpandMore sx={(page?.id === item.id || item.subpages.filter(sub => sub.id === page?.id).length > 0) ? { color: 'primary.main' } : {}} />
          }
        </ListItemButton>
        <Collapse
          in={collapseOpen}
          timeout="auto"
          unmountOnExit
        >
          <List component="div">
            {item.subpages.map((subitem) => {
              return <NavItem subitem item={subitem} key={subitem.id} />
            })}
          </List>
        </Collapse>
      </div>
    )
    if (item.action) return (
      <ListItemButton onClick={() => {
        item.action()
        handleCloseNavMenu()
      }} sx={subitem ? { pl: 4 } : {}}>
        <ListItemIcon sx={page?.id === item.id ? { color: 'primary.main' } : {}}>
          <item.icon />
        </ListItemIcon>
        <ListItemText primary={item.name} sx={page?.id === item.id ? { color: 'primary.main' } : {}} />
      </ListItemButton>
    )
    return (
      <ListItemButton onClick={handleCloseNavMenu} component={RouterLink} to={item.path} sx={subitem ? { pl: 4 } : {}}>
        <ListItemIcon sx={page?.id === item.id ? { color: 'primary.main' } : {}}>
          <item.icon />
        </ListItemIcon>
        <ListItemText primary={item.name} sx={page?.id === item.id ? { color: 'primary.main' } : {}} />
      </ListItemButton>
    )
  }
}

'use client'
import * as React from 'react';
import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem, Tooltip} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdbIcon from '@mui/icons-material/Adb';
import Link from 'next/link';

const pages = ['login', 'signup'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);


  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#0f2749',height:'56px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flex: 1, display:'flex', alignItems:'center' }}>
            <AdbIcon sx={{ display: 'flex', mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontFamily: 'monospace',
                fontWeight: 700,
                // letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ChatWave
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block',padding:'0 8px' }}
                >
                  <Link href={`/${page}`}>{page}</Link>
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ flexGrow: 0, justifySelf: 'flex-end' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* <Avatar alt="Remy Sharp" src="/vercel.svdg" /> */}
                <AccountCircleIcon sx={{ color: 'white', fontSize: '35px' }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseUserMenu}>
                   <Link href={`/${page}`}>{page}</Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;

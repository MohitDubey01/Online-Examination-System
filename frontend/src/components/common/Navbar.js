import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  BarChart as ResultsIcon
} from '@mui/icons-material';

import { logout } from '../../store/actions/authActions';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/');
  };

  const handleMenuDrawerToggle = () => {
    setMenuDrawerOpen(!menuDrawerOpen);
  };

  // This decides where to navigate based on user role
  const goToDashboard = () => {
    handleMenuClose();
    if (user && user.role === 'ADMIN') {
      navigate('/admin');
    } else {
      navigate('/student');
    }
  };

  // Menu for authenticated users
  const authMenu = (
    <Box>
      <Button
        onClick={handleProfileMenuOpen}
        startIcon={
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: user?.role === 'ADMIN' ? 'secondary.main' : 'primary.main'
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
        }
        color="inherit"
        sx={{ ml: 2 }}
      >
        {!isMobile && user?.name && user.name.split(' ')[0]}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={goToDashboard}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        
        {user?.role === 'STUDENT' && (
          <MenuItem onClick={() => { handleMenuClose(); navigate('/student/exams'); }}>
            <ListItemIcon>
              <AssignmentIcon fontSize="small" />
            </ListItemIcon>
            My Exams
          </MenuItem>
        )}
        
        {user?.role === 'STUDENT' && (
          <MenuItem onClick={() => { handleMenuClose(); navigate('/student/results'); }}>
            <ListItemIcon>
              <ResultsIcon fontSize="small" />
            </ListItemIcon>
            My Results
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );

  // Menu items for mobile drawer
  const drawerItems = [
    {
      text: 'Home',
      icon: <DashboardIcon />,
      onClick: () => navigate('/')
    }
  ];

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      drawerItems.push({
        text: 'Admin Dashboard',
        icon: <DashboardIcon />,
        onClick: () => navigate('/admin')
      });
    } else {
      drawerItems.push(
        {
          text: 'Student Dashboard',
          icon: <DashboardIcon />,
          onClick: () => navigate('/student')
        },
        {
          text: 'My Exams',
          icon: <AssignmentIcon />,
          onClick: () => navigate('/student/exams')
        },
        {
          text: 'My Results',
          icon: <ResultsIcon />,
          onClick: () => navigate('/student/results')
        }
      );
    }
    drawerItems.push({
      text: 'Logout',
      icon: <LogoutIcon />,
      onClick: handleLogout
    });
  } else {
    drawerItems.push({
      text: 'Login / Register',
      icon: <PersonIcon />,
      onClick: () => navigate('/auth')
    });
  }

  // Mobile drawer
  const mobileDrawer = (
    <Box>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleMenuDrawerToggle}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={menuDrawerOpen}
        onClose={handleMenuDrawerToggle}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleMenuDrawerToggle}
        >
          <List>
            {drawerItems.map((item, index) => (
              <ListItem button key={index} onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );

  // Render the navbar
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && mobileDrawer}
          
          {/* Logo and Title */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            OnlineExam
          </Typography>

          {/* Desktop Nav Links */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              <Button
                component={RouterLink}
                to="/"
                sx={{ color: 'white', display: 'block', mx: 1 }}
              >
                Home
              </Button>
              
              {isAuthenticated && user?.role === 'ADMIN' && (
                <Button
                  component={RouterLink}
                  to="/admin"
                  sx={{ color: 'white', display: 'block', mx: 1 }}
                >
                  Dashboard
                </Button>
              )}
              
              {isAuthenticated && user?.role === 'STUDENT' && (
                <>
                  <Button
                    component={RouterLink}
                    to="/student"
                    sx={{ color: 'white', display: 'block', mx: 1 }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/student/exams"
                    sx={{ color: 'white', display: 'block', mx: 1 }}
                  >
                    Exams
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/student/results"
                    sx={{ color: 'white', display: 'block', mx: 1 }}
                  >
                    Results
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Login/Register or User Menu */}
          {isAuthenticated ? (
            authMenu
          ) : (
            !isMobile && (
              <Button
                color="inherit"
                component={RouterLink}
                to="/auth"
                startIcon={<PersonIcon />}
              >
                Login / Register
              </Button>
            )
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  Badge,
  Box,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.9)} 0%, ${alpha(theme.palette.primary.main, 0.95)} 100%)`,
  backdropFilter: 'blur(12px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
  borderBottom: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
  transition: theme.transitions.create(['width', 'margin', 'background'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 12,
    marginTop: theme.spacing(1),
    minWidth: 220,
    background: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.default, 0.9)
      : alpha(theme.palette.background.paper, 0.95),
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    '& .MuiMenu-list': {
      padding: '8px 0',
    },
    '& .MuiMenuItem-root': {
      padding: '10px 16px',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
      '& .MuiSvgIcon-root': {
        color: theme.palette.primary.main,
      },
    },
  },
}));

const WaveDivider = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '3px',
  background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.secondary.light, 0.7)}, transparent)`,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.light}, transparent)`,
    animation: 'waveAnimation 3s linear infinite',
  },
  '@keyframes waveAnimation': {
    '0%': { transform: 'translateX(-50%)' },
    '100%': { transform: 'translateX(0%)' },
  }
}));

const AdminNavbar = ({ open, toggleDrawer, toggleTheme, darkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    handleClose();
  };

  const notificationsCount = 5;

  return (
    <StyledAppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        ...(open && {
          marginLeft: 280,
          width: `calc(100% - 280px)`,
        }),
        ...(scrolled && {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          background: `linear-gradient(90deg, ${alpha(theme.palette.primary.dark, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.98)} 100%)`,
        }),
      }}
    >
      <WaveDivider />
      <Toolbar sx={{ minHeight: '64px!important' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{
            marginRight: 3,
            transform: 'scale(1.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.2)',
              backgroundColor: alpha(theme.palette.primary.light, 0.2),
            }
          }}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <MenuIcon fontSize="medium" />
          </motion.div>
        </IconButton>
        
        <Typography 
          variant="h6" 
          noWrap 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '0.5px',
            background: `linear-gradient(90deg, ${theme.palette.common.white}, ${theme.palette.secondary.light})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Panel de Administración
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="large"
            color="inherit"
            onClick={toggleTheme}
            sx={{
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              borderRadius: '50%',
              padding: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.light, 0.2),
                transform: 'rotate(30deg)',
              }
            }}
          >
            {darkMode ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>
          
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            sx={{
              position: 'relative',
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              borderRadius: '50%',
              padding: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.light, 0.2),
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Badge 
              badgeContent={notificationsCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  right: 3,
                  top: 8,
                  boxShadow: `0 0 8px ${theme.palette.error.main}`,
                  animation: 'pulse 1.5s infinite',
                },
                '@keyframes pulse': {
                  '0%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0.7)}` },
                  '70%': { boxShadow: `0 0 0 8px ${alpha(theme.palette.error.main, 0)}` },
                  '100%': { boxShadow: `0 0 0 0 ${alpha(theme.palette.error.main, 0)}` },
                }
              }}
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              backgroundColor: alpha(theme.palette.primary.light, 0.1),
              borderRadius: '50%',
              padding: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.light, 0.2),
                transform: 'scale(1.1)',
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: theme.palette.secondary.main,
                boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.light, 0.5)}`,
                transition: 'all 0.3s ease',
              }}
            >
              A
            </Avatar>
          </IconButton>
        </Box>
        
        <StyledMenu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          disableScrollLock={true}
        >
          <MenuItem onClick={() => navigate('/admin/profile')}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" fontWeight={500}>Perfil</Typography>
              <Typography variant="caption" color="textSecondary">
                Configura tu cuenta
              </Typography>
            </ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => navigate('/admin/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" fontWeight={500}>Configuración</Typography>
              <Typography variant="caption" color="textSecondary">
                Personaliza el sistema
              </Typography>
            </ListItemText>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" fontWeight={500}>Cerrar sesión</Typography>
              <Typography variant="caption" color="textSecondary">
                Salir del sistema
              </Typography>
            </ListItemText>
          </MenuItem>
        </StyledMenu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AdminNavbar;
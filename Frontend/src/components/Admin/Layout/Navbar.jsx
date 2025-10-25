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
  ListItemText,
  Chip
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Grass as GrassIcon,
  Spa as SpaIcon,
  EcoOutlined as EcoOutlinedIcon,
  AdminPanelSettings as AdminPanelSettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled, alpha, useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Paleta de colores verde mejorada
const greenTheme = {
  primary: '#00791a',
  secondary: '#064273',
  accent: '#27ae60',
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  dark: '#1a3c27',
  light: '#e8f5e9',
  gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
  gradientLight: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
  glass: 'rgba(255, 255, 255, 0.98)',
  shadow: '0 20px 60px rgba(0, 121, 26, 0.15)',
  shadowHover: '0 30px 80px rgba(0, 121, 26, 0.25)'
};

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: greenTheme.gradient,
  backdropFilter: 'blur(20px)',
  boxShadow: greenTheme.shadow,
  borderBottom: `1px solid ${alpha(greenTheme.primary, 0.2)}`,
  transition: theme.transitions.create(['width', 'margin', 'background'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 16,
    marginTop: theme.spacing(1),
    minWidth: 260,
    background: greenTheme.glass,
    backdropFilter: 'blur(20px)',
    boxShadow: greenTheme.shadowHover,
    border: `1px solid ${alpha(greenTheme.primary, 0.1)}`,
    overflow: 'hidden',
    '& .MuiMenu-list': {
      padding: '8px 0',
    },
    '& .MuiMenuItem-root': {
      padding: '12px 20px',
      transition: 'all 0.3s ease',
      margin: '0 8px',
      borderRadius: 8,
      '&:hover': {
        backgroundColor: alpha(greenTheme.primary, 0.08),
        transform: 'translateX(4px)',
        '& .MuiListItemIcon-root': {
          color: greenTheme.primary,
          transform: 'scale(1.1)',
        },
      },
      '& .MuiSvgIcon-root': {
        color: greenTheme.primary,
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
  background: `linear-gradient(90deg, transparent, ${alpha(greenTheme.accent, 0.6)}, transparent)`,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '100%',
    background: `linear-gradient(90deg, transparent, ${greenTheme.success}, transparent)`,
    animation: 'waveAnimation 3s linear infinite',
  },
  '@keyframes waveAnimation': {
    '0%': { transform: 'translateX(-50%)' },
    '100%': { transform: 'translateX(0%)' },
  }
}));

const EcoPulse = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: -2,
  right: -2,
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: greenTheme.success,
  border: `2px solid ${greenTheme.light}`,
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.8)',
      boxShadow: `0 0 0 0 ${alpha(greenTheme.success, 0.7)}`
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 6px ${alpha(greenTheme.success, 0)}`
    },
    '100%': {
      transform: 'scale(0.8)',
      boxShadow: `0 0 0 0 ${alpha(greenTheme.success, 0)}`
    }
  }
}));

const StatusIndicator = styled('div')(({ theme, status }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: status === 'online' ? greenTheme.success : greenTheme.warning,
  marginRight: 8,
  boxShadow: `0 0 8px ${status === 'online' ? alpha(greenTheme.success, 0.5) : alpha(greenTheme.warning, 0.5)}`,
  animation: status === 'online' ? 'pulse 2s infinite' : 'none'
}));

const AdminNavbar = ({ open, toggleDrawer, toggleTheme, darkMode, stats = {}, user = {} }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    handleClose();
  };

  // Datos por defecto mejorados
  const notificationsCount = stats.notifications || 3;
  const ecoHotels = stats.ecoHotels || 12;
  const pendingReviews = stats.pendingReviews || 5;
  const userData = {
    name: user?.name || 'Administrador',
    role: user?.role || 'Super Admin',
    email: user?.email || 'admin@ecohotels.com',
    status: 'online'
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          boxShadow: greenTheme.shadowHover,
          background: `linear-gradient(135deg, ${alpha(greenTheme.primary, 0.98)} 0%, ${alpha(greenTheme.dark, 0.95)} 100%)`,
        }),
      }}
    >
      <WaveDivider />
      <Toolbar sx={{ minHeight: '70px!important', py: 1 }}>
        {/* Botón del menú */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{
            marginRight: 3,
            backgroundColor: alpha(greenTheme.light, 0.1),
            borderRadius: '12px',
            padding: '10px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: alpha(greenTheme.light, 0.2),
              transform: 'scale(1.1) rotate(90deg)',
            }
          }}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <MenuIcon fontSize="medium" />
          </motion.div>
        </IconButton>
        
        {/* Título y estadísticas */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <SpaIcon sx={{ fontSize: 28, color: greenTheme.light }} />
            </motion.div>
            <Typography 
              variant="h5" 
              noWrap 
              component="div" 
              sx={{ 
                fontWeight: 800,
                letterSpacing: '0.5px',
                background: `linear-gradient(135deg, ${greenTheme.light}, #ffffff)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              Paraiso Admin
            </Typography>
          </Box>
          
          {/* Stats en tiempo real */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1.5 }}>
            <Chip
              icon={<GrassIcon sx={{ fontSize: 16 }} />}
              label={`${ecoHotels} Hoteles Verdes`}
              variant="outlined"
              sx={{
                backgroundColor: alpha(greenTheme.success, 0.1),
                border: `1px solid ${alpha(greenTheme.success, 0.3)}`,
                color: greenTheme.light,
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: greenTheme.success,
                }
              }}
            />
            
            <Chip
              icon={<NotificationsIcon sx={{ fontSize: 16 }} />}
              label={`${pendingReviews} Revisiones`}
              variant="outlined"
              sx={{
                backgroundColor: alpha(greenTheme.warning, 0.1),
                border: `1px solid ${alpha(greenTheme.warning, 0.3)}`,
                color: greenTheme.light,
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: greenTheme.warning,
                }
              }}
            />

            {/* Reloj en tiempo real */}
            <Box sx={{ 
              display: { xs: 'none', xl: 'flex' }, 
              alignItems: 'center', 
              gap: 1,
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: alpha(greenTheme.light, 0.1),
              border: `1px solid ${alpha(greenTheme.light, 0.2)}`,
            }}>
              <Typography variant="caption" fontWeight="600" color={greenTheme.light}>
                {formatTime(currentTime)}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Controles de usuario */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Toggle Theme */}
          <IconButton
            size="large"
            color="inherit"
            onClick={toggleTheme}
            sx={{
              backgroundColor: alpha(greenTheme.light, 0.1),
              borderRadius: '12px',
              padding: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(greenTheme.light, 0.2),
                transform: 'rotate(30deg) scale(1.1)',
              }
            }}
          >
            <motion.div
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {darkMode ? (
                <LightModeIcon fontSize="small" />
              ) : (
                <DarkModeIcon fontSize="small" />
              )}
            </motion.div>
          </IconButton>
          
          {/* Notifications */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            sx={{
              position: 'relative',
              backgroundColor: alpha(greenTheme.light, 0.1),
              borderRadius: '12px',
              padding: '8px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(greenTheme.light, 0.2),
                transform: 'translateY(-2px)',
              }
            }}
          >
            <Badge 
              badgeContent={notificationsCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  right: 4,
                  top: 8,
                  backgroundColor: greenTheme.warning,
                  boxShadow: `0 0 8px ${alpha(greenTheme.warning, 0.5)}`,
                  animation: 'pulse 1.5s infinite',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                },
              }}
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          
          {/* User Menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              position: 'relative',
              backgroundColor: alpha(greenTheme.light, 0.1),
              borderRadius: '12px',
              padding: '6px',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(greenTheme.light, 0.2),
                transform: 'scale(1.05)',
              }
            }}
          >
            <EcoPulse />
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
                background: greenTheme.gradient,
                boxShadow: `0 4px 12px ${alpha(greenTheme.primary, 0.3)}`,
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </IconButton>
        </Box>
        
        {/* Menú de usuario */}
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
          {/* Header del usuario */}
          <MenuItem sx={{ flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  background: greenTheme.gradient,
                  mr: 2
                }}
              >
                <AdminPanelSettingsIcon />
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight={700} color={greenTheme.dark}>
                  {userData.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {userData.email}
                </Typography>
              </Box>
              <StatusIndicator status={userData.status} />
            </Box>
            <Chip 
              label={userData.role} 
              size="small" 
              color="success" 
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
              {formatDate(currentTime)}
            </Typography>
          </MenuItem>
          
          <Divider sx={{ 
            my: 1, 
            background: `linear-gradient(90deg, transparent, ${alpha(greenTheme.primary, 0.2)}, transparent)`,
          }} />
          
          <MenuItem onClick={() => navigate('/admin/profile')}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" fontWeight={600} color={greenTheme.dark}>
                Mi Perfil
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Administrar cuenta
              </Typography>
            </ListItemText>
          </MenuItem>
          
          <MenuItem onClick={() => navigate('/admin/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" fontWeight={600} color={greenTheme.dark}>
                Configuración
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Personalizar sistema
              </Typography>
            </ListItemText>
          </MenuItem>
          
          <Divider sx={{ 
            my: 1, 
            background: `linear-gradient(90deg, transparent, ${alpha(greenTheme.primary, 0.2)}, transparent)`,
          }} />
          
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" fontWeight={600} color={greenTheme.dark}>
                Cerrar Sesión
              </Typography>
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
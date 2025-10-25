import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Tooltip, 
  Typography, 
  Box,
  Avatar
} from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Hotel as HotelIcon,
  Place as PlaceIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  Nature as NatureIcon,
  Grass as GrassIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Paleta de colores verde (misma que HotelList)
const greenTheme = {
  primary: '#00791a',
  secondary: '#064273',
  accent: '#27ae60',
  success: '#2ecc71',
  warning: '#f39c12',
  dark: '#1a3c27',
  light: '#e8f5e9',
  gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
  gradientLight: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
  glass: 'rgba(255, 255, 255, 0.95)',
  shadow: '0 20px 60px rgba(0, 121, 26, 0.15)',
  shadowHover: '0 30px 80px rgba(0, 121, 26, 0.25)'
};

// Constantes de diseño
const drawerWidth = 280;
const collapsedWidth = 80;
const iconSize = 24;

// Componentes estilizados con la paleta verde
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    background: greenTheme.gradientLight,
    borderRight: 'none',
    boxShadow: greenTheme.shadow,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    zIndex: theme.zIndex.drawer,
    backdropFilter: 'blur(20px)',
    borderRight: `1px solid ${alpha(greenTheme.primary, 0.1)}`,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3, 2),
  ...theme.mixins.toolbar,
  background: `linear-gradient(135deg, ${alpha(greenTheme.primary, 0.05)} 0%, transparent 100%)`,
  borderBottom: `1px solid ${alpha(greenTheme.primary, 0.1)}`,
}));

const BrandContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const NavItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: 12,
  margin: theme.spacing(0.5, 2),
  padding: theme.spacing(1.25, 2),
  transition: 'all 0.3s ease',
  background: selected ? alpha(greenTheme.primary, 0.1) : 'transparent',
  border: selected ? `1px solid ${alpha(greenTheme.primary, 0.2)}` : '1px solid transparent',
  
  '&:hover': {
    backgroundColor: alpha(greenTheme.primary, 0.08),
    border: `1px solid ${alpha(greenTheme.primary, 0.2)}`,
    transform: 'translateX(4px)',
    '& .MuiListItemIcon-root': {
      color: greenTheme.primary,
      transform: 'scale(1.1)',
    },
    '& .MuiTypography-root': {
      color: greenTheme.primary,
      fontWeight: 600,
    }
  },
  
  ...(selected && {
    backgroundColor: alpha(greenTheme.primary, 0.15),
    border: `1px solid ${alpha(greenTheme.primary, 0.3)}`,
    '& .MuiListItemIcon-root': {
      color: greenTheme.primary,
      transform: 'scale(1.1)',
    },
    '& .MuiTypography-root': {
      fontWeight: 700,
      color: greenTheme.primary,
      background: greenTheme.gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
  }),
}));

const NavText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    color: theme.palette.text.primary,
  },
}));

const NavIcon = styled(ListItemIcon)(({ theme, selected }) => ({
  minWidth: '40px',
  color: selected ? greenTheme.primary : theme.palette.text.secondary,
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  '& svg': {
    fontSize: iconSize
  }
}));

const ToggleButton = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1.5),
  cursor: 'pointer',
  borderRadius: '50%',
  margin: theme.spacing(2, 'auto'),
  background: alpha(greenTheme.primary, 0.1),
  color: greenTheme.primary,
  border: `1px solid ${alpha(greenTheme.primary, 0.2)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(greenTheme.primary, 0.2),
    transform: 'scale(1.1)',
    boxShadow: `0 4px 20px ${alpha(greenTheme.primary, 0.3)}`,
  },
  '& svg': {
    fontSize: '1.25rem'
  }
}));

const EcoBadge = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: -4,
  right: -4,
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: greenTheme.success,
  border: `2px solid ${greenTheme.light}`,
}));

const StatsBadge = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: -6,
  right: -6,
  minWidth: 20,
  height: 20,
  borderRadius: 10,
  background: greenTheme.accent,
  color: 'white',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 6px',
  border: `2px solid ${greenTheme.light}`,
}));

const AdminSidebar = ({ open, toggleDrawer, stats = {} }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      path: '/admin', 
      icon: <DashboardIcon />, 
      text: 'Dashboard',
      badge: stats.total || 0
    },
    { 
      path: '/admin/users', 
      icon: <PeopleIcon />, 
      text: 'Usuarios',
      badge: stats.users || 0
    },
    { 
      path: '/admin/hotels', 
      icon: <HotelIcon />, 
      text: 'Hoteles',
      badge: stats.hotels || 0,
      featured: true
    },
    { 
      path: '/admin/sites', 
      icon: <PlaceIcon />, 
      text: 'Sitios Turísticos',
      badge: stats.sites || 0
    },
    { 
      path: '/admin/settings', 
      icon: <SettingsIcon />, 
      text: 'Configuración',
      eco: true
    },
  ];

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : collapsedWidth,
        },
      }}
    >
      <DrawerHeader>
        <BrandContainer>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              sx={{ 
                background: greenTheme.gradient,
                width: 44, 
                height: 44,
                fontSize: '1.25rem',
                fontWeight: 'bold',
                boxShadow: `0 4px 20px ${alpha(greenTheme.primary, 0.3)}`,
              }}
            >
              <GrassIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <EcoBadge />
          </Box>
          {open && (
            <Box>
              <Typography 
                variant="h6" 
                noWrap 
                sx={{ 
                  fontWeight: 800,
                  background: greenTheme.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Paraiso Verde
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: greenTheme.primary,
                  fontWeight: 600,
                  opacity: 0.8
                }}
              >
                Panel 
              </Typography>
            </Box>
          )}
        </BrandContainer>
      </DrawerHeader>

      <Divider sx={{ 
        my: 1, 
        background: `linear-gradient(90deg, transparent 0%, ${alpha(greenTheme.primary, 0.2)} 50%, transparent 100%)`,
        height: 2 
      }} />

      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <Tooltip 
            key={item.path} 
            title={!open ? item.text : ''} 
            placement="right"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: greenTheme.dark,
                  color: 'white',
                  '& .MuiTooltip-arrow': {
                    color: greenTheme.dark,
                  }
                }
              }
            }}
          >
            <NavItem
              button
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
              sx={{
                position: 'relative',
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <NavIcon selected={location.pathname === item.path}>
                  {item.icon}
                </NavIcon>
                {item.badge > 0 && (
                  <StatsBadge>
                    {item.badge > 99 ? '99+' : item.badge}
                  </StatsBadge>
                )}
                {item.eco && (
                  <EcoBadge />
                )}
              </Box>
              <NavText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  ml: item.featured ? 0.5 : 0
                }} 
              />
              {item.featured && open && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: greenTheme.accent,
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          transform: 'scale(0.95)',
                          boxShadow: `0 0 0 0 ${alpha(greenTheme.accent, 0.7)}`
                        },
                        '70%': {
                          transform: 'scale(1)',
                          boxShadow: `0 0 0 6px ${alpha(greenTheme.accent, 0)}`
                        },
                        '100%': {
                          transform: 'scale(0.95)',
                          boxShadow: `0 0 0 0 ${alpha(greenTheme.accent, 0)}`
                        }
                      }
                    }}
                  />
                </Box>
              )}
            </NavItem>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ 
        my: 1, 
        background: `linear-gradient(90deg, transparent 0%, ${alpha(greenTheme.primary, 0.2)} 50%, transparent 100%)`,
        height: 2 
      }} />

      <ToggleButton onClick={toggleDrawer}>
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </ToggleButton>
    </StyledDrawer>
  );
};

export default AdminSidebar;
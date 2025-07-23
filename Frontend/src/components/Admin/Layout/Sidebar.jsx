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
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Constantes de diseño
const drawerWidth = 280;
const collapsedWidth = 80;
const iconSize = 24;

// Componentes estilizados
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRight: 'none',
    boxShadow: theme.shadows[1],
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    zIndex: theme.zIndex.drawer
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3, 2),
  ...theme.mixins.toolbar,
}));

const BrandContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const NavItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 2),
  padding: theme.spacing(1.25, 2),
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    }
  },
  ...(selected && {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiTypography-root': {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
  }),
}));

const NavText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-root': {
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'opacity 0.3s ease, color 0.2s ease',
  },
}));

const NavIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: '40px',
  color: theme.palette.text.secondary,
  justifyContent: 'center',
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
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    transform: 'scale(1.05)'
  },
  '& svg': {
    fontSize: '1.25rem'
  }
}));

const AdminSidebar = ({ open, toggleDrawer }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: <DashboardIcon />, text: 'Dashboard' },
    { path: '/admin/users', icon: <PeopleIcon />, text: 'Usuarios' },
    { path: '/admin/hotels', icon: <HotelIcon />, text: 'Hoteles' },
    { path: '/admin/sites', icon: <PlaceIcon />, text: 'Sitios Turísticos' },
    { path: '/admin/settings', icon: <SettingsIcon />, text: 'Configuración' },
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
          <Avatar 
            sx={{ 
              bgcolor: theme.palette.primary.main,
              width: 40, 
              height: 40,
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}
          >
            A
          </Avatar>
          {open && (
            <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
              Admin Panel
            </Typography>
          )}
        </BrandContainer>
      </DrawerHeader>

      <Divider sx={{ my: 1 }} />

      <List>
        {navItems.map((item) => (
          <Tooltip 
            key={item.path} 
            title={!open ? item.text : ''} 
            placement="right"
            arrow
          >
            <NavItem
              button
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </NavItem>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ my: 1 }} />

      <ToggleButton onClick={toggleDrawer}>
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </ToggleButton>
    </StyledDrawer>
  );
};

export default AdminSidebar;
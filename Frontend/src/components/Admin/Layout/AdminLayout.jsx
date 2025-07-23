import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import AdminNavbar from './Navbar';
import AdminSidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminNavbar open={open} toggleDrawer={toggleDrawer} />
      <AdminSidebar open={open} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: `-${open ? 240 : 57}px`,
          ...(open && {
            transition: (theme) => theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
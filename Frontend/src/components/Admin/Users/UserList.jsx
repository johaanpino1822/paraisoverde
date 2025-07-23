import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Box,
  Avatar,
  Chip,
  useTheme,
  InputAdornment,
  Tooltip,
  Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { debounce } from 'lodash';
import api from '../../../Api/config';

const UserList = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleApiError = (err, fallbackMessage) => {
    console.error(err);
    setError(err.response?.data?.message || fallbackMessage);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (err) {
        if (err.isAdminPermissionError) {
          setError('Necesitas permisos de administrador para acceder a esta sección.');
        } else {
          handleApiError(err, 'No se pudieron cargar los usuarios. Intenta nuevamente.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const debouncedSearch = useCallback(
    debounce((value) => setSearchTerm(value.toLowerCase()), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    const results = users.filter(user =>
      (user?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (user?.email || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/users/${selectedUser._id}`);
      setUsers(prev => prev.filter(user => user._id !== selectedUser._id));
      setOpenDeleteDialog(false);
    } catch (err) {
      handleApiError(err, 'Error al eliminar el usuario. Intenta nuevamente.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  const getRandomColor = (str) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.success.main,
    ];
    return colors[Math.floor(str?.charCodeAt(0) % colors.length)];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <AdminIcon fontSize="large" /> Gestión de Usuarios
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Administra los usuarios registrados en la plataforma
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nombre o email..."
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '50px',
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1]
              }
            }}
          />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ 
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[2]
      }}>
        {loading ? (
          <Box p={3}>
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton width="60%" height={24} />
                  <Skeleton width="40%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={40} height={40} />
              </Box>
            ))}
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ 
                backgroundColor: theme.palette.mode === 'light' 
                  ? theme.palette.grey[50] 
                  : theme.palette.grey[800]
              }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Información</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }} align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow 
                    key={user._id}
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: getRandomColor(user.name),
                            width: 40, 
                            height: 40 
                          }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="medium">
                            {user.name}
                            {user.isVerified && (
                              <Tooltip title="Usuario verificado">
                                <VerifiedIcon 
                                  color="primary" 
                                  fontSize="small" 
                                  sx={{ ml: 0.5, verticalAlign: 'middle' }} 
                                />
                              </Tooltip>
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {user._id.substring(0, 8)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography sx={{ mb: 0.5 }}>
                          <strong>Email:</strong> {user.email}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {user.roles?.includes('admin') && (
                            <Chip 
                              icon={<AdminIcon fontSize="small" />}
                              label="Administrador"
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Editar usuario">
                          <IconButton
                            aria-label={`Editar usuario ${user.name}`}
                            color="primary"
                            sx={{ 
                              backgroundColor: theme.palette.action.hover,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.contrastText
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                          <IconButton
                            aria-label={`Eliminar usuario ${user.name}`}
                            onClick={() => handleDeleteClick(user)}
                            color="error"
                            sx={{ 
                              backgroundColor: theme.palette.error.light + '33',
                              '&:hover': {
                                backgroundColor: theme.palette.error.main,
                                color: theme.palette.error.contrastText
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        color: theme.palette.text.disabled
                      }}>
                        <PersonIcon sx={{ fontSize: 60, mb: 1 }} />
                        <Typography variant="h6">No se encontraron usuarios</Typography>
                        <Typography variant="body2">
                          {searchTerm ? 'Prueba con otro término de búsqueda' : 'No hay usuarios registrados'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.contrastText,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon /> Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: getRandomColor(selectedUser?.name),
                width: 48, 
                height: 48,
                mr: 2
              }}
            >
              {selectedUser?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight="medium">
              {selectedUser?.name}
            </Typography>
          </Box>
          <Typography>
            ¿Estás seguro de que deseas eliminar permanentemente este usuario? Esta acción no se puede deshacer.
          </Typography>
          <Box sx={{ 
            backgroundColor: theme.palette.warning.light + '22',
            p: 2,
            borderRadius: '8px',
            mt: 2,
            borderLeft: `4px solid ${theme.palette.warning.main}`
          }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Advertencia:</strong> Todos los datos asociados a este usuario serán eliminados.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: '8px' }}
          >
            {deleting ? 'Eliminando...' : 'Confirmar Eliminación'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          onClose={handleCloseSnackbar}
          variant="filled"
          sx={{ 
            borderRadius: '8px',
            boxShadow: theme.shadows[3]
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList;
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
  Grid,
  Card,
  CardContent,
  alpha,
  Fade,
  Zoom,
  Slide,
  styled,
  Badge
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreIcon,
  Shield as ShieldIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Grass as GrassIcon,
  Spa as SpaIcon,
  Eco as EcoIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../Api/config';

// Paleta de colores verde idéntica a la navbar
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '20px',
  overflow: 'hidden',
  background: greenTheme.glass,
  border: `1px solid ${alpha(greenTheme.primary, 0.1)}`,
  boxShadow: greenTheme.shadow,
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: greenTheme.shadowHover,
  }
}));

const StyledCard = styled(Card)(({ theme, color = greenTheme.primary }) => ({
  background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
  border: `1px solid ${alpha(color, 0.2)}`,
  borderRadius: '16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 25px ${alpha(color, 0.15)}`
  }
}));

const EcoBadge = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: -4,
  right: -4,
  width: 16,
  height: 16,
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
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    verified: 0,
    recent: 0
  });

  const handleApiError = (err, fallbackMessage) => {
    console.error(err);
    setError(err.response?.data?.message || fallbackMessage);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/users');
        const usersData = response.data;
        setUsers(usersData);
        
        // Calcular estadísticas
        const admins = usersData.filter(user => user.roles?.includes('admin')).length;
        const verified = usersData.filter(user => user.isVerified).length;
        const recent = usersData.filter(user => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(user.createdAt) > weekAgo;
        }).length;

        setStats({
          total: usersData.length,
          admins,
          verified,
          recent
        });
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
      (user?.email || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
      (user?._id || '').toLowerCase().includes((searchTerm || '').toLowerCase())
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
      setError('');
    } catch (err) {
      handleApiError(err, 'Error al eliminar el usuario. Intenta nuevamente.');
    } finally {
      setDeleting(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      handleApiError(err, 'Error al actualizar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError('');
  };

  const getRandomColor = (str) => {
    const colors = [
      greenTheme.primary,
      greenTheme.secondary,
      greenTheme.accent,
      greenTheme.success,
      greenTheme.warning,
      greenTheme.error,
    ];
    return colors[Math.floor((str?.charCodeAt(0) || 0) % colors.length)];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ icon, title, value, color, delay = 0 }) => (
    <Zoom in={!loading} style={{ transitionDelay: `${delay}ms` }}>
      <StyledCard color={color}>
        <CardContent sx={{ p: '16px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {value}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {title}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '12px',
                backgroundColor: alpha(color, 0.1),
                color: color
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
    </Zoom>
  );

  return (
    <Box sx={{ 
      p: 3, 
      background: greenTheme.gradientLight,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '300px',
        background: greenTheme.gradient,
        zIndex: 0,
        opacity: 0.1
      }
    }}>
      {/* Header Section */}
      <Slide direction="down" in={true} timeout={500}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={6}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <SpaIcon sx={{ 
                    fontSize: 40, 
                    color: greenTheme.primary,
                    filter: 'drop-shadow(0 4px 8px rgba(0,121,26,0.3))'
                  }} />
                </motion.div>
                <Box>
                  <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 800,
                      background: greenTheme.gradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 0.5
                    }}
                  >
                    Gestión de Usuarios
                  </Typography>
                  <Typography variant="h6" color={greenTheme.dark} sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.8 }}>
                    <AdminIcon sx={{ color: greenTheme.primary }} />
                    Administra y supervisa todos los usuarios de la plataforma
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar usuarios por nombre, email o ID..."
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: greenTheme.primary }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: 'white',
                    boxShadow: greenTheme.shadow,
                    '&:hover': {
                      boxShadow: greenTheme.shadowHover
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(greenTheme.primary, 0.2),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(greenTheme.primary, 0.4),
                    },
                  }
                }}
              />
              <Tooltip title="Actualizar lista">
                <IconButton 
                  onClick={handleRefresh}
                  sx={{ 
                    backgroundColor: 'white',
                    boxShadow: greenTheme.shadow,
                    borderRadius: '12px',
                    color: greenTheme.primary,
                    '&:hover': {
                      backgroundColor: greenTheme.primary,
                      color: 'white',
                      transform: 'rotate(180deg)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Slide>

      {/* Statistics Cards */}
      <Fade in={!loading} timeout={800}>
        <Grid container spacing={3} sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<PersonIcon />}
              title="Total Usuarios"
              value={stats.total}
              color={greenTheme.primary}
              delay={100}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ShieldIcon />}
              title="Administradores"
              value={stats.admins}
              color={greenTheme.warning}
              delay={200}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<VerifiedIcon />}
              title="Verificados"
              value={stats.verified}
              color={greenTheme.success}
              delay={300}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CalendarIcon />}
              title="Nuevos (7 días)"
              value={stats.recent}
              color={greenTheme.secondary}
              delay={400}
            />
          </Grid>
        </Grid>
      </Fade>

      {/* Users Table */}
      <StyledPaper sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ position: 'relative' }}>
          <WaveDivider />
        </Box>
        {loading ? (
          <Box p={3}>
            {[...Array(6)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2 }}>
                <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton width="60%" height={28} sx={{ mb: 1 }} />
                  <Skeleton width="40%" height={20} />
                </Box>
                <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: '8px' }} />
              </Box>
            ))}
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ 
                background: `linear-gradient(135deg, ${alpha(greenTheme.primary, 0.05)} 0%, ${alpha(greenTheme.secondary, 0.05)} 100%)`
              }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: greenTheme.dark }}>
                      <BadgeIcon sx={{ color: greenTheme.primary }} />
                      Información del Usuario
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, color: greenTheme.dark }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ color: greenTheme.primary }} />
                      Contacto
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, color: greenTheme.dark }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ color: greenTheme.primary }} />
                      Fecha de Registro
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, color: greenTheme.dark }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <Fade in={true} timeout={500} key={user._id}>
                    <TableRow 
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha(greenTheme.primary, 0.02),
                          transform: 'scale(1.002)'
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            badgeContent={<EcoBadge />}
                          >
                            <Avatar 
                              sx={{ 
                                bgcolor: getRandomColor(user.name),
                                width: 48, 
                                height: 48,
                                boxShadow: `0 4px 12px ${alpha(getRandomColor(user.name), 0.3)}`,
                                fontWeight: 'bold'
                              }}
                            >
                              {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: greenTheme.dark }}>
                              {user.name}
                              {user.isVerified && (
                                <Tooltip title="Usuario verificado">
                                  <VerifiedIcon 
                                    sx={{ 
                                      color: greenTheme.success,
                                      filter: 'drop-shadow(0 2px 4px rgba(46,204,113,0.3))',
                                      fontSize: '18px'
                                    }} 
                                  />
                                </Tooltip>
                              )}
                            </Typography>
                            <Typography variant="body2" sx={{ color: alpha(greenTheme.dark, 0.7) }}>
                              ID: {user._id.substring(0, 10)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography sx={{ mb: 1, fontWeight: 'medium', color: greenTheme.dark }}>
                            {user.email}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {user.roles?.includes('admin') && (
                              <Chip 
                                icon={<AdminIcon fontSize="small" />}
                                label="Administrador"
                                size="small"
                                sx={{ 
                                  fontWeight: 'bold',
                                  backgroundColor: alpha(greenTheme.warning, 0.1),
                                  color: greenTheme.warning,
                                  border: `1px solid ${alpha(greenTheme.warning, 0.3)}`,
                                  boxShadow: `0 2px 8px ${alpha(greenTheme.warning, 0.2)}`
                                }}
                              />
                            )}
                            {user.isVerified && (
                              <Chip 
                                icon={<VerifiedIcon fontSize="small" />}
                                label="Verificado"
                                size="small"
                                sx={{ 
                                  fontWeight: 'bold',
                                  backgroundColor: alpha(greenTheme.success, 0.1),
                                  color: greenTheme.success,
                                  border: `1px solid ${alpha(greenTheme.success, 0.3)}`,
                                  boxShadow: `0 2px 8px ${alpha(greenTheme.success, 0.2)}`
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: alpha(greenTheme.dark, 0.7) }}>
                          {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="Editar usuario">
                            <IconButton
                              aria-label={`Editar usuario ${user.name}`}
                              sx={{ 
                                backgroundColor: alpha(greenTheme.primary, 0.1),
                                color: greenTheme.primary,
                                '&:hover': {
                                  backgroundColor: greenTheme.primary,
                                  color: 'white',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar usuario">
                            <IconButton
                              aria-label={`Eliminar usuario ${user.name}`}
                              onClick={() => handleDeleteClick(user)}
                              sx={{ 
                                backgroundColor: alpha(greenTheme.error, 0.1),
                                color: greenTheme.error,
                                '&:hover': {
                                  backgroundColor: greenTheme.error,
                                  color: 'white',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </Fade>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        color: alpha(greenTheme.dark, 0.5)
                      }}>
                        <PersonIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h5" gutterBottom sx={{ color: greenTheme.dark }}>
                          No se encontraron usuarios
                        </Typography>
                        <Typography variant="body1" sx={{ color: alpha(greenTheme.dark, 0.7) }}>
                          {searchTerm ? 'Prueba con otro término de búsqueda' : 'No hay usuarios registrados en este momento'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </StyledPaper>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => !deleting && setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            maxWidth: '500px',
            background: greenTheme.glass,
            boxShadow: greenTheme.shadowHover,
            border: `1px solid ${alpha(greenTheme.primary, 0.1)}`
          }
        }}
      >
        <DialogTitle sx={{ 
          background: greenTheme.gradient,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 3
        }}>
          <DeleteIcon sx={{ fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold">
            Confirmar Eliminación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3, 
            p: 2, 
            borderRadius: '12px', 
            backgroundColor: alpha(greenTheme.error, 0.05),
            border: `1px solid ${alpha(greenTheme.error, 0.2)}`
          }}>
            <Avatar 
              sx={{ 
                bgcolor: getRandomColor(selectedUser?.name),
                width: 56, 
                height: 56,
                mr: 2,
                boxShadow: `0 4px 12px ${alpha(getRandomColor(selectedUser?.name), 0.3)}`
              }}
            >
              {selectedUser?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: greenTheme.dark }}>
                {selectedUser?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: alpha(greenTheme.dark, 0.7) }}>
                {selectedUser?.email}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" paragraph sx={{ color: greenTheme.dark }}>
            ¿Estás seguro de que deseas eliminar permanentemente este usuario? Esta acción no se puede deshacer y eliminará todos los datos asociados.
          </Typography>
          <Box sx={{ 
            backgroundColor: alpha(greenTheme.warning, 0.1),
            p: 2,
            borderRadius: '12px',
            borderLeft: `4px solid ${greenTheme.warning}`
          }}>
            <Typography variant="body2" sx={{ color: alpha(greenTheme.dark, 0.8), display: 'flex', alignItems: 'center', gap: 1 }}>
              <strong>⚠️ Advertencia crítica:</strong> Esta acción afectará permanentemente todos los registros del sistema.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            disabled={deleting}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              fontWeight: 'bold',
              borderColor: alpha(greenTheme.primary, 0.3),
              color: greenTheme.primary,
              '&:hover': {
                borderColor: greenTheme.primary,
                backgroundColor: alpha(greenTheme.primary, 0.1)
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              fontWeight: 'bold',
              background: greenTheme.gradient,
              boxShadow: `0 4px 15px ${alpha(greenTheme.primary, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${greenTheme.dark} 0%, ${greenTheme.primary} 100%)`,
                boxShadow: `0 6px 20px ${alpha(greenTheme.primary, 0.4)}`
              }
            }}
          >
            {deleting ? 'Eliminando...' : 'Eliminar Permanentemente'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
      >
        <Alert 
          severity="error" 
          onClose={handleCloseSnackbar}
          variant="filled"
          sx={{ 
            borderRadius: '12px',
            boxShadow: greenTheme.shadow,
            fontWeight: 'medium',
            alignItems: 'center',
            background: greenTheme.gradient
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList;
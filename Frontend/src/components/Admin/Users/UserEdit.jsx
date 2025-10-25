import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Chip,
  Avatar,
  useTheme,
  Grid,
  FormHelperText,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  alpha,
  Fade,
  Slide,
  styled,
  Zoom,
} from '@mui/material';
import { 
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
  Visibility,
  VisibilityOff,
  AdminPanelSettings as AdminIcon,
  Shield as ShieldIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Grass as GrassIcon,
  Spa as SpaIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../Api/config';

// Paleta de colores verde idéntica
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
  borderRadius: '24px',
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

const StatusIndicator = styled('div')(({ status, theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: status ? greenTheme.success : greenTheme.error,
  marginRight: 8,
  boxShadow: `0 0 8px ${status ? alpha(greenTheme.success, 0.5) : alpha(greenTheme.error, 0.5)}`,
  animation: status ? 'pulse 2s infinite' : 'none'
}));

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    isActive: true,
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (id !== 'new') {
          const { data } = await api.get(`/users/${id}`);
          setFormData({
            username: data.username,
            email: data.email,
            role: data.role,
            isActive: data.isActive,
            password: '',
            confirmPassword: ''
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del usuario');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      errors.username = 'Nombre de usuario requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email requerido';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (id === 'new') {
      if (!formData.password) {
        errors.password = 'Contraseña requerida';
      } else if (formData.password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (passwordStrength < 75) {
        errors.password = 'La contraseña debe ser más segura';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calcular fuerza de contraseña
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive
      };

      if (id === 'new') {
        userData.password = formData.password;
        await api.post('/users/register', userData);
        setSuccess('✅ Usuario creado exitosamente');
      } else {
        await api.put(`/users/${id}`, userData);
        setSuccess('✅ Usuario actualizado exitosamente');
      }
      
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         (id === 'new' ? 'Error al crear el usuario' : 'Error al actualizar el usuario');
      setError(`❌ ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return greenTheme.error;
    if (passwordStrength < 50) return greenTheme.warning;
    if (passwordStrength < 75) return greenTheme.accent;
    return greenTheme.success;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return greenTheme.error;
      case 'admin': return greenTheme.warning;
      default: return greenTheme.primary;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin': return <ShieldIcon />;
      case 'admin': return <AdminIcon />;
      default: return <PersonIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        background: greenTheme.gradientLight
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: greenTheme.primary,
              filter: 'drop-shadow(0 4px 8px rgba(0,121,26,0.3))'
            }} 
          />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 900, 
      mx: 'auto', 
      p: 3,
      background: greenTheme.gradientLight,
      minHeight: '100vh'
    }}>
      <Slide direction="down" in={true} timeout={500}>
        <StyledPaper>
          {/* Header Section */}
          <Box sx={{
            background: greenTheme.gradient,
            color: 'white',
            p: 4,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              opacity: 0.1,
              transform: 'scale(2) rotate(45deg)'
            }}>
              <SpaIcon sx={{ fontSize: 120 }} />
            </Box>
            
            <Stack direction="row" alignItems="center" spacing={2}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Avatar sx={{ 
                  bgcolor: 'white',
                  width: 64, 
                  height: 64,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }}>
                  <VerifiedUserIcon 
                    sx={{ 
                      fontSize: 32,
                      background: greenTheme.gradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }} 
                  />
                </Avatar>
              </motion.div>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h3" component="h1" fontWeight="800" sx={{ mb: 0.5 }}>
                  {id === 'new' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {id === 'new' ? 'Agregar un nuevo usuario al sistema' : 'Modificar información del usuario'}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <Chip 
                  label={id === 'new' ? 'NUEVO REGISTRO' : formData.isActive ? 'USUARIO ACTIVO' : 'USUARIO INACTIVO'} 
                  color={formData.isActive ? 'success' : 'error'} 
                  size="medium"
                  icon={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StatusIndicator status={formData.isActive} />
                      {formData.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    </Box>
                  }
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    backgroundColor: formData.isActive ? alpha(greenTheme.success, 0.2) : alpha(greenTheme.error, 0.2),
                    color: 'white',
                    border: `1px solid ${alpha('white', 0.3)}`
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <AnimatePresence>
              {error && (
                <Fade in={true}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: '12px',
                      border: `1px solid ${alpha(greenTheme.error, 0.2)}`,
                      backgroundColor: alpha(greenTheme.error, 0.05)
                    }}
                    icon={<ErrorIcon />}
                  >
                    <Typography fontWeight="600">{error}</Typography>
                  </Alert>
                </Fade>
              )}
              
              {success && (
                <Fade in={true}>
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mb: 3,
                      borderRadius: '12px',
                      border: `1px solid ${alpha(greenTheme.success, 0.2)}`,
                      backgroundColor: alpha(greenTheme.success, 0.05)
                    }}
                    icon={<CheckCircleIcon />}
                  >
                    <Typography fontWeight="600">{success}</Typography>
                  </Alert>
                </Fade>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Información Básica */}
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="600" sx={{ 
                    color: greenTheme.dark,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <PersonIcon />
                    Información Básica
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <TextField
                      fullWidth
                      label="Nombre de usuario"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!formErrors.username}
                      helperText={formErrors.username}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: greenTheme.primary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: alpha(greenTheme.light, 0.5),
                          '&:hover': {
                            backgroundColor: alpha(greenTheme.primary, 0.05)
                          }
                        }
                      }}
                    />
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      margin="normal"
                      required
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: greenTheme.primary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: alpha(greenTheme.light, 0.5),
                          '&:hover': {
                            backgroundColor: alpha(greenTheme.primary, 0.05)
                          }
                        }
                      }}
                    />
                  </motion.div>
                </Grid>

                {/* Contraseñas para nuevo usuario */}
                {id === 'new' && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" fontWeight="600" sx={{ 
                        color: greenTheme.dark,
                        mb: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <LockIcon />
                        Seguridad
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <TextField
                          fullWidth
                          label="Contraseña"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          margin="normal"
                          required
                          error={!!formErrors.password}
                          helperText={formErrors.password}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: greenTheme.primary }} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  sx={{ color: greenTheme.primary }}
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: alpha(greenTheme.light, 0.5),
                              '&:hover': {
                                backgroundColor: alpha(greenTheme.primary, 0.05)
                              }
                            }
                          }}
                        />
                      </motion.div>
                      
                      {/* Indicador de fuerza de contraseña */}
                      {formData.password && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ color: greenTheme.dark, fontWeight: 'medium' }}>
                            Fortaleza de la contraseña:
                          </Typography>
                          <Box sx={{ 
                            width: '100%', 
                            height: 6, 
                            backgroundColor: alpha(greenTheme.primary, 0.1),
                            borderRadius: '3px',
                            mt: 0.5,
                            overflow: 'hidden'
                          }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                              transition={{ duration: 0.5 }}
                              style={{
                                height: '100%',
                                backgroundColor: getPasswordStrengthColor(),
                                borderRadius: '3px'
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ color: getPasswordStrengthColor(), fontWeight: 'bold' }}>
                            {passwordStrength < 25 && 'Muy débil'}
                            {passwordStrength >= 25 && passwordStrength < 50 && 'Débil'}
                            {passwordStrength >= 50 && passwordStrength < 75 && 'Moderada'}
                            {passwordStrength >= 75 && 'Fuerte'}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <TextField
                          fullWidth
                          label="Confirmar Contraseña"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          margin="normal"
                          required
                          error={!!formErrors.confirmPassword}
                          helperText={formErrors.confirmPassword}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockIcon sx={{ color: greenTheme.primary }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: alpha(greenTheme.light, 0.5),
                              '&:hover': {
                                backgroundColor: alpha(greenTheme.primary, 0.05)
                              }
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                  </>
                )}
                
                {/* Configuración de permisos */}
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="600" sx={{ 
                    color: greenTheme.dark,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <ShieldIcon />
                    Configuración de Permisos
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <FormControl 
                      fullWidth 
                      margin="normal" 
                      error={!!formErrors.role}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: alpha(greenTheme.light, 0.5),
                          '&:hover': {
                            backgroundColor: alpha(greenTheme.primary, 0.05)
                          }
                        }
                      }}
                    >
                      <InputLabel>Rol del usuario</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        label="Rol del usuario"
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="user">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <PersonIcon sx={{ color: greenTheme.primary }} />
                            <span>Usuario</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="admin">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <AdminIcon sx={{ color: greenTheme.warning }} />
                            <span>Administrador</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="superadmin">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ShieldIcon sx={{ color: greenTheme.error }} />
                            <span>Super Administrador</span>
                          </Stack>
                        </MenuItem>
                      </Select>
                      {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
                    </FormControl>
                  </motion.div>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <FormControl 
                      fullWidth 
                      margin="normal"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: alpha(greenTheme.light, 0.5),
                          '&:hover': {
                            backgroundColor: alpha(greenTheme.primary, 0.05)
                          }
                        }
                      }}
                    >
                      <InputLabel>Estado de la cuenta</InputLabel>
                      <Select
                        name="isActive"
                        value={formData.isActive}
                        label="Estado de la cuenta"
                        onChange={(e) => setFormData({...formData, isActive: e.target.value})}
                        required
                      >
                        <MenuItem value={true}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ActiveIcon sx={{ color: greenTheme.success }} />
                            <span>Activo</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value={false}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <InactiveIcon sx={{ color: greenTheme.error }} />
                            <span>Inactivo</span>
                          </Stack>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </motion.div>
                </Grid>
              </Grid>

              <Divider sx={{ 
                my: 4, 
                background: `linear-gradient(90deg, transparent, ${alpha(greenTheme.primary, 0.2)}, transparent)`,
              }} />

              {/* Acciones */}
              <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/admin/users')}
                    sx={{ 
                      minWidth: 140,
                      borderRadius: '12px',
                      borderColor: alpha(greenTheme.primary, 0.3),
                      color: greenTheme.primary,
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: greenTheme.primary,
                        backgroundColor: alpha(greenTheme.primary, 0.1)
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    disabled={submitting}
                    sx={{ 
                      minWidth: 200,
                      borderRadius: '12px',
                      background: greenTheme.gradient,
                      boxShadow: `0 4px 15px ${alpha(greenTheme.primary, 0.3)}`,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${greenTheme.dark} 0%, ${greenTheme.primary} 100%)`,
                        boxShadow: `0 6px 20px ${alpha(greenTheme.primary, 0.4)}`
                      }
                    }}
                  >
                    {submitting ? (
                      id === 'new' ? 'Creando...' : 'Guardando...'
                    ) : (
                      id === 'new' ? 'Crear Usuario' : 'Guardar Cambios'
                    )}
                  </Button>
                </motion.div>
              </Stack>
            </form>
          </CardContent>
        </StyledPaper>
      </Slide>
    </Box>
  );
};

export default UserEdit;
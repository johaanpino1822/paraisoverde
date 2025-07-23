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
  IconButton
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
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../Api/config';

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

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) errors.username = 'Nombre de usuario requerido';
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
        setSuccess('Usuario creado exitosamente');
      } else {
        await api.put(`/users/${id}`, userData);
        setSuccess('Usuario actualizado exitosamente');
      }
      
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         (id === 'new' ? 'Error al crear el usuario' : 'Error al actualizar el usuario');
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ 
        p: 4, 
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main,
            width: 56, 
            height: 56
          }}>
            <VerifiedUserIcon fontSize="large" />
          </Avatar>
          <Typography variant="h4" component="h1" fontWeight="600">
            {id === 'new' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
          </Typography>
          <Chip 
            label={id === 'new' ? 'Nuevo' : formData.isActive ? 'Activo' : 'Inactivo'} 
            color={formData.isActive ? 'success' : 'error'} 
            size="small"
            icon={formData.isActive ? <ActiveIcon /> : <InactiveIcon />}
            sx={{ ml: 'auto' }}
          />
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
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
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {id === 'new' && (
              <>
                <Grid item xs={12} md={6}>
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
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
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
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={!!formErrors.role}>
                <InputLabel>Rol del usuario</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Rol del usuario"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="superadmin">Super Administrador</MenuItem>
                </Select>
                {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
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
                      <ActiveIcon color="success" />
                      <span>Activo</span>
                    </Stack>
                  </MenuItem>
                  <MenuItem value={false}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <InactiveIcon color="error" />
                      <span>Inactivo</span>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/admin/users')}
              sx={{ minWidth: 120 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={submitting}
              sx={{ minWidth: 180 }}
            >
              {submitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  {id === 'new' ? 'Creando...' : 'Guardando...'}
                </>
              ) : (
                id === 'new' ? 'Crear Usuario' : 'Guardar Cambios'
              )}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default UserEdit;
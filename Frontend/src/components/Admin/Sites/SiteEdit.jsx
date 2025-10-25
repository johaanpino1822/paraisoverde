import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardMedia,
  Grid,
  Fade,
  Zoom,
  Slide,
  Divider,
  InputAdornment,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Delete as DeleteIcon,
  AddPhotoAlternate,
  ArrowBack,
  Save,
  LocationOn,
  Category,
  Attractions,
  Paid,
  Description,
  Star,
  Add,
  Remove,
  CloudUpload
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../Api/config';

const SiteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    category: '',
    entranceFee: '',
    highlights: [],
    newHighlight: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  // Paleta de colores basada en la navbar
  const colors = {
    primary: '#00791a',
    secondary: '#064273',
    accent: '#3498db',
    light: '#e8f5e9',
    dark: '#2c3e50',
    gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
    gradientHover: 'linear-gradient(135deg, #009922 0%, #085a9c 100%)',
    glass: 'rgba(255, 255, 255, 0.95)',
    shadow: '0 8px 32px rgba(0, 121, 26, 0.1)'
  };

  const steps = ['Información Básica', 'Detalles', 'Imágenes y Características'];

  useEffect(() => {
    const fetchSite = async () => {
      if (!id || id === 'new') {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/sites/${id}`);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          location: data.location || '',
          category: data.category || '',
          entranceFee: data.entranceFee || '',
          highlights: data.highlights || [],
          newHighlight: '',
          images: data.images || []
        });
        setImagePreviews(data.images || []);
      } catch (err) {
        console.error('Error al cargar el sitio:', err);
        setError('Error al cargar el sitio');
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHighlightAdd = () => {
    const trimmed = formData.newHighlight.trim();
    if (trimmed && !formData.highlights.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, trimmed],
        newHighlight: ''
      }));
    }
  };

  const handleHighlightDelete = (highlightToDelete) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h !== highlightToDelete)
    }));
  };

  const handleImageDelete = (imageToDelete) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToDelete)
    }));
    setImagePreviews(prev => prev.filter(image => image !== imageToDelete));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));

    setImagePreviews(prev => [...prev, ...newPreviews]);
    setNewImages(prev => [...prev, ...files]);
    e.target.value = null;
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('entranceFee', formData.entranceFee);
      formDataToSend.append('highlights', formData.highlights.join(','));

      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      if (!id || id === 'new') {
        await api.post('/sites', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('✨ Sitio creado exitosamente');
      } else {
        await api.put(`/sites/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('✅ Sitio actualizado exitosamente');
      }

      setTimeout(() => navigate('/admin/sites'), 2000);
    } catch (err) {
      console.error('Error al guardar sitio:', err);
      setError(err.response?.data?.message || 'Error al guardar el sitio');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: colors.primary,
              filter: `drop-shadow(0 4px 8px ${colors.primary}40)`
            }} 
          />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      py: 4,
      px: 2
    }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 4,
            p: 3,
            borderRadius: 4,
            background: colors.glass,
            backdropFilter: 'blur(10px)',
            boxShadow: colors.shadow,
            border: `1px solid ${colors.primary}20`
          }}>
            <Tooltip title="Volver al listado">
              <IconButton 
                onClick={() => navigate('/admin/sites')}
                sx={{
                  background: colors.gradient,
                  color: 'white',
                  '&:hover': {
                    background: colors.gradientHover,
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Box>
              <Typography 
                variant="h3" 
                fontWeight="bold"
                sx={{
                  background: colors.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {id === 'new' ? 'Registrar Nuevo Sitio' : 'Editar Sitio'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {id === 'new' ? 'Completa la información del nuevo sitio turístico' : 'Actualiza la información del sitio existente'}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper sx={{ 
            p: 3, 
            mb: 4,
            background: colors.glass,
            backdropFilter: 'blur(10px)',
            boxShadow: colors.shadow
          }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel 
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 600,
                        color: colors.dark
                      }
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: colors.shadow
                }}
              >
                ❌ {error}
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: colors.shadow
                }}
              >
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Content */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ 
            p: 4, 
            borderRadius: 4,
            background: colors.glass,
            backdropFilter: 'blur(10px)',
            boxShadow: colors.shadow,
            border: `1px solid ${colors.primary}20`
          }}>
            <form onSubmit={handleSubmit}>
              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre del sitio"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Attractions sx={{ color: colors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: colors.primary,
                          },
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Descripción"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={4}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Description sx={{ color: colors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: colors.primary,
                          },
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Ubicación"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      fullWidth
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn sx={{ color: colors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: colors.primary,
                          },
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        label="Categoría"
                        onChange={handleChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <Category sx={{ color: colors.primary, ml: 1 }} />
                          </InputAdornment>
                        }
                        sx={{
                          borderRadius: 3,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.primary,
                          },
                        }}
                      >
                        <MenuItem value="Naturaleza">🌿 Naturaleza</MenuItem>
                        <MenuItem value="Cultural">🏛️ Cultural</MenuItem>
                        <MenuItem value="Aventura">🧗 Aventura</MenuItem>
                        <MenuItem value="Histórico">📜 Histórico</MenuItem>
                        <MenuItem value="Gastronómico">🍽️ Gastronómico</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Costo de entrada (COP)"
                      name="entranceFee"
                      value={formData.entranceFee}
                      onChange={handleChange}
                      type="number"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Paid sx={{ color: colors.primary }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: colors.primary,
                          },
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      border: `2px dashed ${colors.primary}40`,
                      background: `${colors.light}40`
                    }}>
                      <Typography variant="h6" gutterBottom sx={{ color: colors.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star sx={{ color: colors.primary }} />
                        Características Destacadas
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                        <TextField
                          label="Nueva característica"
                          name="newHighlight"
                          value={formData.newHighlight}
                          onChange={handleChange}
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            }
                          }}
                        />
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="contained" 
                            onClick={handleHighlightAdd}
                            startIcon={<Add />}
                            sx={{
                              background: colors.gradient,
                              borderRadius: 2,
                              px: 3,
                              '&:hover': {
                                background: colors.gradientHover,
                              }
                            }}
                          >
                            Agregar
                          </Button>
                        </motion.div>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <AnimatePresence>
                          {formData.highlights.map((h, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              layout
                            >
                              <Chip
                                label={h}
                                onDelete={() => handleHighlightDelete(h)}
                                deleteIcon={<Remove />}
                                sx={{
                                  background: colors.gradient,
                                  color: 'white',
                                  fontWeight: 600,
                                  '&:hover': {
                                    background: colors.gradientHover,
                                  }
                                }}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {activeStep === 2 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      border: `2px dashed ${colors.primary}40`,
                      background: `${colors.light}40`
                    }}>
                      <Typography variant="h6" gutterBottom sx={{ color: colors.dark, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddPhotoAlternate sx={{ color: colors.primary }} />
                        Galería de Imágenes
                      </Typography>

                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <AnimatePresence>
                          {imagePreviews.map((image, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Card sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden' }}>
                                  <CardMedia
                                    component="img"
                                    height="140"
                                    image={image}
                                    alt={`Preview ${index + 1}`}
                                  />
                                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleImageDelete(image)}
                                        sx={{
                                          backgroundColor: 'rgba(255,255,255,0.9)',
                                          '&:hover': {
                                            backgroundColor: 'white'
                                          }
                                        }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </motion.div>
                                  </Box>
                                </Card>
                              </motion.div>
                            </Grid>
                          ))}
                        </AnimatePresence>
                      </Grid>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<CloudUpload />}
                          fullWidth
                          sx={{
                            border: `2px dashed ${colors.primary}`,
                            borderRadius: 3,
                            py: 2,
                            color: colors.primary,
                            '&:hover': {
                              border: `2px dashed ${colors.secondary}`,
                              background: `${colors.primary}08`
                            }
                          }}
                        >
                          Subir Imágenes
                          <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Button>
                      </motion.div>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${colors.primary}20`
              }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    onClick={activeStep === 0 ? () => navigate('/admin/sites') : handleBack}
                    startIcon={<ArrowBack />}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      borderColor: colors.primary,
                      color: colors.primary,
                      '&:hover': {
                        borderColor: colors.secondary,
                        background: `${colors.primary}08`
                      }
                    }}
                  >
                    {activeStep === 0 ? 'Cancelar' : 'Atrás'}
                  </Button>
                </motion.div>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep < steps.length - 1 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                          background: colors.gradient,
                          borderRadius: 3,
                          px: 4,
                          '&:hover': {
                            background: colors.gradientHover,
                          }
                        }}
                      >
                        Siguiente
                      </Button>
                    </motion.div>
                  )}

                  {activeStep === steps.length - 1 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        sx={{
                          background: colors.gradient,
                          borderRadius: 3,
                          px: 4,
                          '&:hover': {
                            background: colors.gradientHover,
                          }
                        }}
                      >
                        {id === 'new' ? '✨ Registrar Sitio' : '💾 Guardar Cambios'}
                      </Button>
                    </motion.div>
                  )}
                </Box>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SiteEdit;
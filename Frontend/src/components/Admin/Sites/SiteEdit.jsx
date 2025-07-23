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
  MenuItem
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Delete as DeleteIcon,
  AddPhotoAlternate,
  ArrowBack,
  Save
} from '@mui/icons-material';
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
        setSuccess('Sitio creado exitosamente');
      } else {
        await api.put(`/sites/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Sitio actualizado exitosamente');
      }

      setTimeout(() => navigate('/admin/sites'), 2000);
    } catch (err) {
      console.error('Error al guardar sitio:', err);
      setError(err.response?.data?.message || 'Error al guardar el sitio');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Tooltip title="Volver">
          <IconButton onClick={() => navigate('/admin/sites')}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">
          {id === 'new' ? 'Registrar Nuevo Sitio' : 'Editar Sitio'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          ❌ {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          ✅ {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre del sitio"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />

          <TextField
            label="Ubicación"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Categoría"
              onChange={handleChange}
            >
              <MenuItem value="beach">Playa</MenuItem>
              <MenuItem value="mountain">Montaña</MenuItem>
              <MenuItem value="historical">Histórico</MenuItem>
              <MenuItem value="cultural">Cultural</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Costo de entrada (COP)"
            name="entranceFee"
            value={formData.entranceFee}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="normal"
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Características
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Nueva característica"
                name="newHighlight"
                value={formData.newHighlight}
                onChange={handleChange}
                size="small"
              />
              <Button variant="outlined" onClick={handleHighlightAdd}>
                Agregar
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.highlights.map((h, index) => (
                <Chip
                  key={index}
                  label={h}
                  onDelete={() => handleHighlightDelete(h)}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Imágenes
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              {imagePreviews.map((image, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <Avatar
                    src={image}
                    variant="square"
                    sx={{ width: 100, height: 100 }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.9)'
                      }
                    }}
                    onClick={() => handleImageDelete(image)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternate />}
            >
              Agregar imágenes
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => navigate('/admin/sites')}
              startIcon={<ArrowBack />}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Save />}
            >
              {id === 'new' ? 'Registrar Sitio' : 'Guardar Cambios'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default SiteEdit;

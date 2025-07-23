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
  Chip,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Delete, AddPhotoAlternate, ArrowBack, Save } from '@mui/icons-material';
import api from '../../../Api/config';

const HotelEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    priceRange: '$$',
    amenities: [],
    newAmenity: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id || id === 'new') {
        setLoading(false); // No fetch necesario si es nuevo
        return;
      }

      try {
        const { data } = await api.get(`/hotels/${id}`);
        setFormData({
          name: data.name || '',
          description: data.description || '',
          location: data.location || '',
          priceRange: data.priceRange || '$$',
          amenities: data.amenities || [],
          newAmenity: '',
          images: data.images || []
        });
        setImagePreviews(data.images || []);
      } catch (err) {
        setError('Error al cargar el hotel');
        console.error('Error al obtener el hotel:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityAdd = () => {
    const trimmed = formData.newAmenity.trim();
    if (trimmed && !formData.amenities.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, trimmed],
        newAmenity: ''
      }));
    }
  };

  const handleAmenityDelete = (amenityToDelete) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToDelete)
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
      formDataToSend.append('priceRange', formData.priceRange);
      formDataToSend.append('amenities', formData.amenities.join(','));

      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      if (!id || id === 'new') {
        await api.post('/hotels', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Hotel creado exitosamente');
      } else {
        await api.put(`/hotels/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSuccess('Hotel actualizado exitosamente');
      }

      setTimeout(() => navigate('/admin/hotels'), 2000);
    } catch (err) {
      console.error('Error al guardar hotel:', err);
      setError(err.response?.data?.message || 'Error al guardar el hotel');
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
          <IconButton onClick={() => navigate('/admin/hotels')}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">
          {id === 'new' ? 'Registrar Nuevo Hotel' : 'Editar Hotel'}
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
            label="Nombre del hotel"
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
            <InputLabel>Rango de precios</InputLabel>
            <Select
              name="priceRange"
              value={formData.priceRange}
              label="Rango de precios"
              onChange={handleChange}
            >
              <MenuItem value="$">Económico ($)</MenuItem>
              <MenuItem value="$$">Moderado ($$)</MenuItem>
              <MenuItem value="$$$">Costoso ($$$)</MenuItem>
              <MenuItem value="$$$$">Lujoso ($$$$)</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Comodidades
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                label="Nueva comodidad"
                name="newAmenity"
                value={formData.newAmenity}
                onChange={handleChange}
                size="small"
              />
              <Button variant="outlined" onClick={handleAmenityAdd}>
                Agregar
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.amenities.map((amenity, index) => (
                <Chip
                  key={index}
                  label={amenity}
                  onDelete={() => handleAmenityDelete(amenity)}
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
                    <Delete fontSize="small" />
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
              onClick={() => navigate('/admin/hotels')}
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
              {id === 'new' ? 'Registrar Hotel' : 'Guardar Cambios'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default HotelEdit;

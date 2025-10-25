import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, TextField, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Avatar, Chip, Typography, Stack, Skeleton,
  TablePagination, Alert, Menu, MenuItem, Fab, Grid, Card, CardContent,
  InputAdornment, Badge, useMediaQuery, alpha
} from '@mui/material';
import { 
  Edit, Delete, Add, Visibility, MoreVert, Search, FilterList,
  Refresh, LocationOn, Star, Hotel, Wifi, Pool, Restaurant,
  LocalParking, AcUnit, FitnessCenter, BusinessCenter, Spa,
  Whatshot, TrendingUp, Bookmark, BookmarkBorder,
  Nature, Park, Landscape, Grass
} from '@mui/icons-material';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import api from '../../../Api/config';
import { useNavigate } from 'react-router-dom';

// Sistema de diseño único con paleta verde
const designSystem = {
  colors: {
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
  },
  animations: {
    spring: { type: "spring", stiffness: 300, damping: 30 },
    fadeIn: { opacity: 1, transition: { duration: 0.6 } }
  }
};

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActionHotel, setSelectedActionHotel] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [stats, setStats] = useState({ total: 0, featured: 0, eco: 0 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(max-width:1024px)');
  const navigate = useNavigate();

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/hotels');
      setHotels(data);
      calculateStats(data);
    } catch (err) {
      setError('Error al cargar los hoteles. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const calculateStats = (hotelsData) => {
    setStats({
      total: hotelsData.length,
      featured: hotelsData.filter(h => h.featured).length,
      eco: hotelsData.filter(h => h.category === 'Ecológico').length
    });
  };

  const filteredAndSortedHotels = useMemo(() => {
    let filtered = hotels.filter(hotel =>
      hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.amenities?.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(hotel => hotel.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'eco':
          return (b.category === 'Ecológico' ? 1 : 0) - (a.category === 'Ecológico' ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [hotels, searchTerm, selectedCategory, sortBy]);

  const paginatedHotels = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredAndSortedHotels.slice(start, start + rowsPerPage);
  }, [filteredAndSortedHotels, page, rowsPerPage]);

  const handleDelete = async () => {
    try {
      await api.delete(`/hotels/${selectedHotel._id}`);
      setHotels(prev => prev.filter(h => h._id !== selectedHotel._id));
      setOpenDeleteDialog(false);
      setSuccess('Hotel eliminado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al eliminar el hotel');
    }
  };

  const handleFeatureToggle = async (hotel) => {
    try {
      const updatedHotel = { ...hotel, featured: !hotel.featured };
      await api.put(`/hotels/${hotel._id}`, updatedHotel);
      setHotels(hotels.map(h => h._id === hotel._id ? updatedHotel : h));
      setSuccess(updatedHotel.featured ? 'Marcado como destacado' : 'Quitado de destacados');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Error al actualizar el hotel');
    }
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi fontSize="small" />,
      pool: <Pool fontSize="small" />,
      restaurant: <Restaurant fontSize="small" />,
      parking: <LocalParking fontSize="small" />,
      'aire acondicionado': <AcUnit fontSize="small" />,
      gym: <FitnessCenter fontSize="small" />,
      'centro de negocios': <BusinessCenter fontSize="small" />,
      spa: <Spa fontSize="small" />,
      ecológico: <Grass fontSize="small" />,
      naturaleza: <Nature fontSize="small" />,
      parque: <Park fontSize="small" />,
    };
    return icons[amenity.toLowerCase()] || <Star fontSize="small" />;
  };

  const getPriceRangeColor = (priceRange) => {
    const colors = {
      '$': designSystem.colors.success,
      '$$': designSystem.colors.accent,
      '$$$': designSystem.colors.warning,
      '$$$$': designSystem.colors.primary,
    };
    return colors[priceRange] || designSystem.colors.dark;
  };

  const HotelCard = ({ hotel, index }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ ...designSystem.animations.spring, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <Card sx={{
        height: '100%',
        background: designSystem.colors.glass,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(designSystem.colors.primary, 0.1)}`,
        borderRadius: 4,
        boxShadow: designSystem.colors.shadow,
        overflow: 'visible',
        position: 'relative',
        '&:hover': {
          boxShadow: designSystem.colors.shadowHover,
        }
      }}>
        {hotel.featured && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            style={{
              position: 'absolute',
              top: -12,
              right: -12,
              zIndex: 2
            }}
          >
            <Chip
              icon={<Whatshot />}
              label="Destacado"
              size="small"
              sx={{
                background: designSystem.colors.gradient,
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 20px rgba(0, 121, 26, 0.4)'
              }}
            />
          </motion.div>
        )}

        {hotel.category === 'Ecológico' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
            style={{
              position: 'absolute',
              top: -12,
              left: -12,
              zIndex: 2
            }}
          >
            <Chip
              icon={<Grass />}
              label="Ecológico"
              size="small"
              sx={{
                background: designSystem.colors.success,
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 20px rgba(46, 204, 113, 0.4)'
              }}
            />
          </motion.div>
        )}

        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
            <Badge
              color="success"
              overlap="circular"
              badgeContent={hotel.featured ? <Star sx={{ fontSize: 12 }} /> : null}
            >
              <Avatar 
                src={hotel.images?.[0]} 
                variant="rounded"
                sx={{ 
                  width: 80, 
                  height: 80,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                }}
              />
            </Badge>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="h6" 
                fontWeight="800"
                sx={{
                  background: designSystem.colors.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mb: 0.5,
                  lineHeight: 1.2
                }}
              >
                {hotel.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                mb: 1 
              }}>
                <LocationOn fontSize="small" /> 
                {hotel.location}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={hotel.category} 
                  size="small"
                  sx={{
                    background: alpha(designSystem.colors.primary, 0.1),
                    color: designSystem.colors.primary,
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}
                />
                <Chip 
                  label={hotel.priceRange || 'Consultar'} 
                  size="small"
                  sx={{
                    background: alpha(getPriceRangeColor(hotel.priceRange), 0.1),
                    color: getPriceRangeColor(hotel.priceRange),
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}
                />
              </Box>
            </Box>
          </Stack>

          <Typography variant="body2" sx={{ 
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            color: 'text.primary',
            opacity: 0.8
          }}>
            {hotel.description}
          </Typography>

          {hotel.amenities && hotel.amenities.length > 0 && (
            <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                <Tooltip key={idx} title={amenity}>
                  <Chip
                    icon={getAmenityIcon(amenity)}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: '0.7rem',
                      height: 24,
                      borderColor: alpha(designSystem.colors.primary, 0.2),
                      color: designSystem.colors.primary
                    }}
                  />
                </Tooltip>
              ))}
              {hotel.amenities.length > 3 && (
                <Chip 
                  label={`+${hotel.amenities.length - 3}`} 
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                    background: alpha(designSystem.colors.secondary, 0.1),
                    color: designSystem.colors.secondary
                  }}
                />
              )}
            </Stack>
          )}

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 2,
            borderTop: `1px solid ${alpha('#000', 0.1)}`
          }}>
            <Typography variant="h6" fontWeight="700" color={getPriceRangeColor(hotel.priceRange)}>
              {hotel.priceRange === '$' && 'Económico'}
              {hotel.priceRange === '$$' && 'Moderado'}
              {hotel.priceRange === '$$$' && 'Costoso'}
              {hotel.priceRange === '$$$$' && 'Lujoso'}
              {!hotel.priceRange && 'Consultar'}
            </Typography>
            
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Ver detalles">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton 
                    size="small"
                    onClick={() => navigate(`/hotel/${hotel._id}`)}
                    sx={{
                      background: alpha(designSystem.colors.primary, 0.1),
                      color: designSystem.colors.primary,
                      '&:hover': {
                        background: designSystem.colors.primary,
                        color: 'white'
                      }
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </motion.div>
              </Tooltip>
              
              <Tooltip title="Editar">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton 
                    size="small"
                    onClick={() => navigate(`/admin/hotels/edit/${hotel._id}`)}
                    sx={{
                      background: alpha(designSystem.colors.accent, 0.1),
                      color: designSystem.colors.accent,
                      '&:hover': {
                        background: designSystem.colors.accent,
                        color: 'white'
                      }
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </motion.div>
              </Tooltip>

              <Tooltip title="Más opciones">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      setSelectedActionHotel(hotel);
                      setAnchorEl(e.currentTarget);
                    }}
                    sx={{
                      background: alpha(designSystem.colors.dark, 0.1),
                      color: designSystem.colors.dark
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </motion.div>
              </Tooltip>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: designSystem.colors.gradientLight,
      p: { xs: 1, sm: 2, md: 3 }
    }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <Card sx={{
            mb: 4,
            background: designSystem.colors.glass,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(designSystem.colors.primary, 0.1)}`,
            borderRadius: 4,
            boxShadow: designSystem.colors.shadow,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '60%',
              height: '100%',
              background: `linear-gradient(45deg, ${alpha(designSystem.colors.primary, 0.03)} 0%, transparent 100%)`,
              zIndex: 0
            }} />            
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Typography 
                      variant="h3" 
                      fontWeight="900"
                      sx={{
                        background: designSystem.colors.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 1,
                        fontSize: { xs: '2rem', md: '2.5rem' }
                      }}
                    >
                      Hoteles Verdes
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                      Gestión sostenible de establecimientos
                    </Typography>

                    <Stack direction="row" spacing={2} flexWrap="wrap" gap={2}>
                      <Chip 
                        icon={<Hotel />} 
                        label={`${stats.total} Hoteles`}
                        sx={{ 
                          background: alpha(designSystem.colors.primary, 0.1),
                          color: designSystem.colors.primary,
                          fontWeight: 600 
                        }}
                      />
                      <Chip 
                        icon={<Star />} 
                        label={`${stats.featured} Destacados`}
                        sx={{ 
                          background: alpha(designSystem.colors.warning, 0.1),
                          color: designSystem.colors.warning,
                          fontWeight: 600 
                        }}
                      />
                      <Chip 
                        icon={<Grass />}
                        label={`${stats.eco} Ecológicos`}
                        sx={{ 
                          background: alpha(designSystem.colors.success, 0.1),
                          color: designSystem.colors.success,
                          fontWeight: 600 
                        }}
                      />
                    </Stack>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    justifyContent="flex-end"
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/admin/hotels/new')}
                        sx={{
                          background: designSystem.colors.gradient,
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 700,
                          boxShadow: '0 8px 32px rgba(0, 121, 26, 0.3)',
                          '&:hover': {
                            boxShadow: '0 12px 48px rgba(0, 121, 26, 0.4)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Nuevo Hotel
                      </Button>
                    </motion.div>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card sx={{
            mb: 3,
            background: designSystem.colors.glass,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(designSystem.colors.primary, 0.1)}`,
            borderRadius: 3,
            p: 2
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Buscar hoteles, ubicaciones, comodidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.8)',
                      '&:hover': { background: 'rgba(255,255,255,0.9)' },
                      '&.Mui-focused': {
                        borderColor: designSystem.colors.primary
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" gap={1}>
                  <Chip
                    label="Todos"
                    clickable
                    variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                    onClick={() => setSelectedCategory('all')}
                    sx={{
                      background: selectedCategory === 'all' ? designSystem.colors.primary : 'transparent',
                      color: selectedCategory === 'all' ? 'white' : designSystem.colors.primary,
                    }}
                  />
                  <Chip
                    label="Destacados"
                    clickable
                    icon={<Star />}
                    variant={sortBy === 'featured' ? 'filled' : 'outlined'}
                    onClick={() => setSortBy('featured')}
                    sx={{
                      background: sortBy === 'featured' ? designSystem.colors.warning : 'transparent',
                      color: sortBy === 'featured' ? 'white' : designSystem.colors.warning,
                    }}
                  />
                  <Chip
                    label="Ecológicos"
                    clickable
                    icon={<Grass />}
                    variant={selectedCategory === 'Ecológico' ? 'filled' : 'outlined'}
                    onClick={() => setSelectedCategory('Ecológico')}
                    sx={{
                      background: selectedCategory === 'Ecológico' ? designSystem.colors.success : 'transparent',
                      color: selectedCategory === 'Ecológico' ? 'white' : designSystem.colors.success,
                    }}
                  />
                  
                  <Tooltip title="Vista grid">
                    <IconButton 
                      onClick={() => setViewMode('grid')}
                      color={viewMode === 'grid' ? 'primary' : 'default'}
                    >
                      <FilterList />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Actualizar">
                    <IconButton onClick={fetchHotels}>
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              <Alert 
                severity="error"
                sx={{ 
                  mb: 2,
                  borderRadius: 3,
                  boxShadow: designSystem.colors.shadow
                }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
            >
              <Alert 
                severity="success"
                sx={{ 
                  mb: 2,
                  borderRadius: 3,
                  boxShadow: designSystem.colors.shadow
                }}
                onClose={() => setSuccess(null)}
              >
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <LayoutGroup>
          <motion.div layout>
            <Grid container spacing={3}>
              {loading ? (
                [...Array(rowsPerPage)].map((_, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent>
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 3 }} />
                              <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="80%" height={30} />
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="40%" />
                              </Box>
                            </Box>
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="70%" />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Skeleton variant="text" width="30%" />
                              <Skeleton variant="circular" width={40} height={40} />
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))
              ) : filteredAndSortedHotels.length === 0 ? (
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      background: designSystem.colors.glass,
                      borderRadius: 4,
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Hotel sx={{ fontSize: 80, color: alpha(designSystem.colors.primary, 0.3), mb: 2 }} />
                      <Typography variant="h5" color="text.secondary" gutterBottom>
                        {searchTerm ? 'No se encontraron hoteles' : 'No hay hoteles registrados'}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                        {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando el primer hotel sostenible'}
                      </Typography>
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => navigate('/admin/hotels/new')}
                          sx={{
                            background: designSystem.colors.gradient,
                            borderRadius: 3,
                            px: 4
                          }}
                        >
                          Crear Primer Hotel
                        </Button>
                      )}
                    </Box>
                  </motion.div>
                </Grid>
              ) : (
                paginatedHotels.map((hotel, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={hotel._id}>
                    <HotelCard hotel={hotel} index={index} />
                  </Grid>
                ))
              )}
            </Grid>
          </motion.div>
        </LayoutGroup>

        {filteredAndSortedHotels.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              background: designSystem.colors.glass,
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              p: 2
            }}>
              <TablePagination
                rowsPerPageOptions={[6, 9, 12, 24]}
                component="div"
                count={filteredAndSortedHotels.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                sx={{
                  '& .MuiTablePagination-actions': {
                    '& button': {
                      color: designSystem.colors.primary
                    }
                  }
                }}
              />
            </Box>
          </motion.div>
        )}

        <Tooltip title="Crear hotel sostenible" arrow placement="left">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ position: 'fixed', bottom: 24, right: 24 }}
          >
            <Fab
              sx={{
                background: designSystem.colors.gradient,
                color: 'white',
                width: 60,
                height: 60,
                boxShadow: '0 8px 32px rgba(0, 121, 26, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(0, 121, 26, 0.6)',
                }
              }}
              onClick={() => navigate('/admin/hotels/new')}
            >
              <Add sx={{ fontSize: 28 }} />
            </Fab>
          </motion.div>
        </Tooltip>

        <Dialog 
          open={openDeleteDialog} 
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: designSystem.colors.glass,
              backdropFilter: 'blur(20px)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: designSystem.colors.primary }}>
            Confirmar Eliminación
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de eliminar el hotel <strong>"{selectedHotel?.name}"</strong>? 
              Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: designSystem.colors.shadow,
              minWidth: 200
            }
          }}
        >
          <MenuItem onClick={() => { navigate(`/hotel/${selectedActionHotel?._id}`); setAnchorEl(null); }}>
            <Visibility sx={{ mr: 2, color: designSystem.colors.primary }} /> Ver Detalles
          </MenuItem>
          <MenuItem onClick={() => { navigate(`/admin/hotels/edit/${selectedActionHotel?._id}`); setAnchorEl(null); }}>
            <Edit sx={{ mr: 2, color: designSystem.colors.accent }} /> Editar Hotel
          </MenuItem>
          <MenuItem onClick={() => { handleFeatureToggle(selectedActionHotel); setAnchorEl(null); }}>
            {selectedActionHotel?.featured ? 
              <Bookmark sx={{ mr: 2, color: designSystem.colors.warning }} /> : 
              <BookmarkBorder sx={{ mr: 2, color: designSystem.colors.warning }} />
            }
            {selectedActionHotel?.featured ? 'Quitar Destacado' : 'Marcar Destacado'}
          </MenuItem>
          <MenuItem onClick={() => { setSelectedHotel(selectedActionHotel); setOpenDeleteDialog(true); setAnchorEl(null); }} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 2 }} /> Eliminar
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default HotelList;
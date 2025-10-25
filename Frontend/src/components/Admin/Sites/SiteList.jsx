import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, TextField, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Avatar, Chip, Typography, Stack, Skeleton,
  useTheme, TablePagination, Alert, Menu, MenuItem, Divider, Fab,
  Card, CardContent, Grid, InputAdornment, Fade, Zoom, Slide,
  Badge, Rating, LinearProgress, Breadcrumbs, Link,
  Tabs, Tab, Switch, FormControlLabel, CardMedia,
  List, ListItem, ListItemIcon, ListItemText, ListItemButton,
  Collapse, Accordion, AccordionSummary, AccordionDetails,
  Checkbox
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
  Visibility as VisibilityIcon, MoreVert as MoreVertIcon,
  Search as SearchIcon, FilterList as FilterIcon,
  Refresh as RefreshIcon, LocationOn, Category,
  Attractions, Paid, Star, TrendingUp, ExpandMore,
  Image as ImageIcon, Description, Schedule,
  Public, Favorite, Share, Download, Upload,
  ArrowBack, ArrowForward, FirstPage, LastPage,
  ViewModule, ViewList, Sort, FilterAlt,
  CheckCircle, Cancel, Warning, Info,
  AddCircle, RemoveRedEye, DeleteForever,
  Dashboard, BarChart, Analytics,
  LocalOffer, NewReleases, FeaturedPlayList,
  Map, Directions, Phone, Email, Language,
  CalendarToday, AccessTime, People,
  Security, AdminPanelSettings, Settings
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../Api/config';
import { useNavigate } from 'react-router-dom';

const SiteList = () => {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActionSite, setSelectedActionSite] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedSites, setSelectedSites] = useState([]);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, featured: 0, categories: 0 });

  const theme = useTheme();
  const navigate = useNavigate();

  // Paleta de colores profesional mejorada
  const colors = {
    primary: '#00791a',
    secondary: '#064273',
    accent: '#3498db',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#2980b9',
    light: '#e8f5e9',
    dark: '#2c3e50',
    gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
    gradientHover: 'linear-gradient(135deg, #009922 0%, #085a9c 100%)',
    gradientLight: 'linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)',
    glass: 'rgba(255, 255, 255, 0.98)',
    glassDark: 'rgba(255, 255, 255, 0.85)',
    shadow: '0 12px 40px rgba(0, 121, 26, 0.15)',
    shadowHover: '0 20px 60px rgba(0, 121, 26, 0.25)',
    shadowLarge: '0 25px 80px rgba(0, 121, 26, 0.2)'
  };

  // Función helper para obtener la URL de la imagen
  const getImageUrl = (imageObj) => {
    if (!imageObj) return null;
    
    // Si ya es una URL completa
    if (typeof imageObj === 'string') return imageObj;
    
    // Si es un objeto con propiedad path
    if (imageObj.path) {
      // Asegúrate de que la ruta sea absoluta
      return imageObj.path.startsWith('http') 
        ? imageObj.path 
        : `${window.location.origin}${imageObj.path}`;
    }
    
    return null;
  };

  // Cargar sitios
  const fetchSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/sites');
      
      // Transformar las imágenes para tener URLs completas
      const sitesWithImageUrls = data.map(site => ({
        ...site,
        images: site.images?.map(image => ({
          ...image,
          fullPath: getImageUrl(image)
        }))
      }));
      
      setSites(sitesWithImageUrls);
      calculateStats(sitesWithImageUrls);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setError('❌ No se pudieron cargar los sitios turísticos. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const calculateStats = (sitesData) => {
    const stats = {
      total: sitesData.length,
      active: sitesData.filter(site => site.isActive !== false).length,
      featured: sitesData.filter(site => site.featured).length,
      categories: [...new Set(sitesData.map(site => site.category))].length
    };
    setStats(stats);
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // Filtros y búsqueda
  useEffect(() => {
    let results = sites.filter(site =>
      site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar por categoría
    if (filterCategory !== 'all') {
      results = results.filter(site => site.category === filterCategory);
    }

    // Ordenar
    results.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (sortBy === 'entranceFee') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredSites(results);
    setPage(0);
  }, [searchTerm, sites, filterCategory, sortBy, sortOrder]);

  // Manejar eliminación
  const handleDeleteClick = (site) => {
    setSelectedSite(site);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/sites/${selectedSite._id}`);
      setSites(sites.filter(site => site._id !== selectedSite._id));
      setOpenDeleteDialog(false);
      setSuccess('✅ Sitio eliminado correctamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting site:', error);
      setError('❌ Error al eliminar el sitio');
    }
  };

  // Manejar vista de detalles
  const handleViewDetails = (site) => {
    setSelectedSite(site);
    setOpenDetailDialog(true);
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    try {
      for (const siteId of selectedSites) {
        await api.delete(`/sites/${siteId}`);
      }
      setSites(sites.filter(site => !selectedSites.includes(site._id)));
      setSelectedSites([]);
      setBulkActionsOpen(false);
      setSuccess(`✅ ${selectedSites.length} sitios eliminados correctamente`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error bulk deleting sites:', error);
      setError('❌ Error al eliminar los sitios seleccionados');
    }
  };

  // Exportar datos
  const handleExport = () => {
    const dataStr = JSON.stringify(filteredSites, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sitios-turisticos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setExportDialogOpen(false);
    setSuccess('✅ Datos exportados correctamente');
    setTimeout(() => setSuccess(null), 3000);
  };

  // Manejar cierre del menú
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActionSite(null);
  };

  // Toggle featured status
  const handleFeatureToggle = async (site) => {
    try {
      const updatedSite = { ...site, featured: !site.featured };
      await api.put(`/sites/${site._id}`, updatedSite);
      setSites(sites.map(s => s._id === site._id ? updatedSite : s));
      setSuccess(`✅ Sitio ${updatedSite.featured ? 'destacado' : 'quitado de destacados'} correctamente`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating featured status:', error);
      setError('❌ Error al actualizar el estado del sitio');
    }
  };

  // Obtener categorías únicas
  const categories = useMemo(() => {
    return ['all', ...new Set(sites.map(site => site.category).filter(Boolean))];
  }, [sites]);

  // Paginación
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedSites = useMemo(() => {
    return filteredSites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredSites, page, rowsPerPage]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      py: 3,
      px: { xs: 1, sm: 2, md: 3 }
    }}>
      <Box sx={{ maxWidth: 1800, mx: 'auto' }}>
        
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs sx={{ mb: 3, px: 1 }}>
            <Link color="inherit" href="/admin/dashboard" underline="hover">
              <Dashboard sx={{ mr: 0.5, fontSize: 20 }} />
              Dashboard
            </Link>
            <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <Attractions sx={{ mr: 0.5, fontSize: 20 }} />
              Sitios Turísticos
            </Typography>
          </Breadcrumbs>
        </motion.div>

        {/* Header Principal */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card sx={{ 
            mb: 4,
            background: colors.glass,
            backdropFilter: 'blur(20px)',
            boxShadow: colors.shadowLarge,
            border: `1px solid ${colors.primary}15`,
            borderRadius: 4,
            overflow: 'visible',
            position: 'relative'
          }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography 
                      variant="h2" 
                      fontWeight="800"
                      sx={{
                        background: colors.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        mb: 1,
                        fontSize: { xs: '2rem', md: '2.5rem' }
                      }}
                    >
                      Gestión de Sitios
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      Administra y supervisa todos los destinos turísticos del sistema
                    </Typography>
                    
                    {/* Quick Stats */}
                    <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="700" color={colors.primary}>
                          {stats.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="700" color={colors.success}>
                          {stats.active}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Activos
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="700" color={colors.warning}>
                          {stats.featured}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Destacados
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/admin/sites/new')}
                        sx={{
                          background: colors.gradient,
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: colors.shadow,
                          '&:hover': {
                            background: colors.gradientHover,
                            boxShadow: colors.shadowHover
                          }
                        }}
                      >
                        Nuevo Sitio
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outlined"
                        startIcon={<Upload />}
                        onClick={() => setExportDialogOpen(true)}
                        sx={{
                          borderColor: colors.primary,
                          color: colors.primary,
                          borderRadius: 3,
                          px: 3,
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: colors.secondary,
                            background: `${colors.primary}08`
                          }
                        }}
                      >
                        Exportar
                      </Button>
                    </motion.div>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>

            {/* Elementos decorativos */}
            <Box sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 120,
              height: 120,
              background: colors.gradient,
              borderRadius: '50%',
              opacity: 0.1
            }} />
          </Card>
        </motion.div>

        {/* Barra de Herramientas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ 
            mb: 4,
            background: colors.glass,
            backdropFilter: 'blur(15px)',
            boxShadow: colors.shadow,
            border: `1px solid ${colors.primary}10`,
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                {/* Búsqueda */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    size="medium"
                    placeholder="Buscar sitios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: colors.primary }} />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 3,
                        background: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          background: 'rgba(255,255,255,0.9)'
                        },
                        '&.Mui-focused': {
                          background: 'white',
                          boxShadow: `0 0 0 2px ${colors.primary}20`
                        }
                      }
                    }}
                  />
                </Grid>

                {/* Filtros */}
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    size="medium"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    label="Categoría"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      }
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === 'all' ? 'Todas las categorías' : category}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Ordenamiento */}
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    size="medium"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Ordenar por"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      }
                    }}
                  >
                    <MenuItem value="name">Nombre</MenuItem>
                    <MenuItem value="location">Ubicación</MenuItem>
                    <MenuItem value="category">Categoría</MenuItem>
                    <MenuItem value="entranceFee">Precio</MenuItem>
                    <MenuItem value="createdAt">Fecha de creación</MenuItem>
                  </TextField>
                </Grid>

                {/* Acciones */}
                <Grid item xs={12} md={2}>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Vista tabla">
                      <IconButton 
                        onClick={() => setViewMode('table')}
                        color={viewMode === 'table' ? 'primary' : 'default'}
                      >
                        <ViewList />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Vista grid">
                      <IconButton 
                        onClick={() => setViewMode('grid')}
                        color={viewMode === 'grid' ? 'primary' : 'default'}
                      >
                        <ViewModule />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Actualizar">
                      <IconButton onClick={fetchSites}>
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>

              {/* Barra de progreso de búsqueda */}
              {searchTerm && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={(filteredSites.length / sites.length) * 100}
                    sx={{
                      borderRadius: 2,
                      height: 6,
                      background: `${colors.primary}20`,
                      '& .MuiLinearProgress-bar': {
                        background: colors.gradient,
                        borderRadius: 2
                      }
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {filteredSites.length} de {sites.length} sitios encontrados
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Alertas */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert 
                severity="error"
                action={
                  <IconButton size="small" onClick={() => setError(null)}>
                    <Cancel />
                  </IconButton>
                }
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.error}20`
                }}
              >
                {error}
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert 
                severity="success"
                action={
                  <IconButton size="small" onClick={() => setSuccess(null)}>
                    <CheckCircle />
                  </IconButton>
                }
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  boxShadow: colors.shadow,
                  border: `1px solid ${colors.success}20`
                }}
              >
                {success}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido Principal - Vista Tabla */}
        {viewMode === 'table' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card sx={{ 
              borderRadius: 3,
              background: colors.glass,
              backdropFilter: 'blur(15px)',
              boxShadow: colors.shadow,
              border: `1px solid ${colors.primary}10`,
              overflow: 'hidden'
            }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      background: colors.gradient,
                      '& th': {
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        py: 3,
                        borderBottom: 'none'
                      }
                    }}>
                      <TableCell sx={{ width: 60 }}>
                        <Checkbox
                          indeterminate={selectedSites.length > 0 && selectedSites.length < filteredSites.length}
                          checked={filteredSites.length > 0 && selectedSites.length === filteredSites.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSites(filteredSites.map(site => site._id));
                            } else {
                              setSelectedSites([]);
                            }
                          }}
                          sx={{ color: 'white' }}
                        />
                      </TableCell>
                      <TableCell>Imagen</TableCell>
                      <TableCell>Información del Sitio</TableCell>
                      <TableCell>Ubicación</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell align="center" sx={{ width: 140 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      // Skeleton Loading
                      [...Array(rowsPerPage)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton variant="rectangular" width={20} height={20} sx={{ borderRadius: 1 }} /></TableCell>
                          <TableCell><Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 2 }} /></TableCell>
                          <TableCell>
                            <Skeleton variant="text" height={25} width="80%" />
                            <Skeleton variant="text" height={20} width="60%" />
                          </TableCell>
                          <TableCell><Skeleton variant="text" height={25} /></TableCell>
                          <TableCell><Skeleton variant="text" height={25} width="40%" /></TableCell>
                          <TableCell><Skeleton variant="text" height={25} width="30%" /></TableCell>
                          <TableCell><Skeleton variant="text" height={25} width="20%" /></TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Skeleton variant="circular" width={40} height={40} />
                              <Skeleton variant="circular" width={40} height={40} />
                              <Skeleton variant="circular" width={40} height={40} />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredSites.length === 0 ? (
                      // Estado vacío
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                          <Box sx={{ textAlign: 'center', maxWidth: 400, mx: 'auto' }}>
                            <Attractions sx={{ fontSize: 80, color: colors.primary, opacity: 0.3, mb: 2 }} />
                            <Typography variant="h5" color="textSecondary" gutterBottom fontWeight="600">
                              {searchTerm || filterCategory !== 'all' ? 'No se encontraron sitios' : 'No hay sitios registrados'}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 3, opacity: 0.7 }}>
                              {searchTerm || filterCategory !== 'all' 
                                ? 'Prueba ajustando los filtros o términos de búsqueda' 
                                : 'Comienza agregando el primer sitio turístico a tu catálogo'
                              }
                            </Typography>
                            {!searchTerm && filterCategory === 'all' && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="contained"
                                  startIcon={<AddIcon />}
                                  onClick={() => navigate('/admin/sites/new')}
                                  sx={{
                                    background: colors.gradient,
                                    borderRadius: 3,
                                    px: 4,
                                    py: 1.5
                                  }}
                                >
                                  Crear Primer Sitio
                                </Button>
                              </motion.div>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // Datos reales
                      <AnimatePresence>
                        {paginatedSites.map((site, index) => (
                          <motion.tr
                            key={site._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <TableRow 
                              hover 
                              selected={selectedSites.includes(site._id)}
                              sx={{ 
                                '&:hover': {
                                  background: `${colors.primary}04`,
                                  transform: 'translateY(-1px)',
                                  transition: 'all 0.2s ease'
                                },
                                '&.Mui-selected': {
                                  background: `${colors.primary}08`
                                }
                              }}
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedSites.includes(site._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedSites([...selectedSites, site._id]);
                                    } else {
                                      setSelectedSites(selectedSites.filter(id => id !== site._id));
                                    }
                                  }}
                                  sx={{ color: colors.primary }}
                                />
                              </TableCell>
                              
                              <TableCell>
                                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                  <Badge
                                    color={site.featured ? "warning" : "default"}
                                    badgeContent={site.featured ? <Star sx={{ fontSize: 12 }} /> : 0}
                                  >
                                    <Avatar 
                                      src={getImageUrl(site.images?.[0])}
                                      variant="rounded" 
                                      sx={{ 
                                        width: 60, 
                                        height: 60,
                                        borderRadius: 2,
                                        boxShadow: colors.shadow
                                      }}
                                      onError={(e) => {
                                        console.log('Error loading image for site:', site.name, site.images?.[0]);
                                        e.target.style.display = 'none';
                                      }}
                                    >
                                      <ImageIcon />
                                    </Avatar>
                                  </Badge>
                                </motion.div>
                              </TableCell>
                              
                              <TableCell>
                                <Box>
                                  <Typography fontWeight="700" sx={{ color: colors.dark, mb: 0.5 }}>
                                    {site.name}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary" sx={{ 
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                  }}>
                                    {site.description}
                                  </Typography>
                                  {site.highlights && site.highlights.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                      <Chip 
                                        label={`${site.highlights.length} características`}
                                        size="small"
                                        variant="outlined"
                                        sx={{ 
                                          borderColor: colors.primary,
                                          color: colors.primary,
                                          fontSize: '0.7rem'
                                        }}
                                      />
                                    </Box>
                                  )}
                                </Box>
                              </TableCell>
                              
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocationOn sx={{ fontSize: 18, color: colors.primary }} />
                                  <Box>
                                    <Typography fontWeight="600">{site.location}</Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                                      {site.address || 'Dirección no especificada'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              
                              <TableCell>
                                <Chip 
                                  label={site.category || 'Sin categoría'} 
                                  size="small"
                                  sx={{
                                    background: colors.gradient,
                                    color: 'white',
                                    fontWeight: 600,
                                    boxShadow: colors.shadow
                                  }}
                                />
                              </TableCell>
                              
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Paid sx={{ fontSize: 18, color: colors.success }} />
                                  <Typography fontWeight="700" color={colors.success}>
                                    ${site.entranceFee || '0'}
                                  </Typography>
                                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                                    COP
                                  </Typography>
                                </Box>
                              </TableCell>
                              
                              <TableCell>
                                <Chip 
                                  label={site.isActive !== false ? 'Activo' : 'Inactivo'} 
                                  size="small"
                                  color={site.isActive !== false ? 'success' : 'default'}
                                  variant={site.isActive !== false ? 'filled' : 'outlined'}
                                />
                              </TableCell>
                              
                              <TableCell align="center">
                                <Stack direction="row" spacing={0.5} justifyContent="center">
                                  {/* Ver detalles */}
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Tooltip title="Ver detalles completos">
                                      <IconButton 
                                        onClick={() => handleViewDetails(site)}
                                        size="small"
                                        sx={{
                                          background: `${colors.info}15`,
                                          color: colors.info,
                                          '&:hover': {
                                            background: colors.info,
                                            color: 'white'
                                          }
                                        }}
                                      >
                                        <RemoveRedEye fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </motion.div>
                                  
                                  {/* Editar */}
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Tooltip title="Editar sitio">
                                      <IconButton 
                                        onClick={() => navigate(`/admin/sites/edit/${site._id}`)} 
                                        size="small"
                                        sx={{
                                          background: `${colors.primary}15`,
                                          color: colors.primary,
                                          '&:hover': {
                                            background: colors.primary,
                                            color: 'white'
                                          }
                                        }}
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </motion.div>
                                  
                                  {/* Menú de acciones */}
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Tooltip title="Más acciones">
                                      <IconButton 
                                        onClick={(e) => {
                                          setSelectedActionSite(site);
                                          setAnchorEl(e.currentTarget);
                                        }} 
                                        size="small"
                                        sx={{
                                          background: `${colors.dark}15`,
                                          color: colors.dark
                                        }}
                                      >
                                        <MoreVertIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </motion.div>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Paginación */}
              {filteredSites.length > 0 && (
                <Box sx={{ 
                  p: 2, 
                  borderTop: `1px solid ${colors.primary}10`,
                  background: colors.glassDark
                }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        Mostrando {paginatedSites.length} de {filteredSites.length} sitios
                        {selectedSites.length > 0 && ` • ${selectedSites.length} seleccionados`}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TablePagination
                        component="div"
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        count={filteredSites.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                          '& .MuiTablePagination-actions': {
                            '& button': {
                              color: colors.primary
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>
          </motion.div>
        )}

        {/* Botón Flotante Mejorado */}
        <Tooltip title="Crear nuevo sitio turístico" arrow placement="left">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ position: 'fixed', bottom: 32, right: 32 }}
          >
            <Fab
              sx={{
                background: colors.gradient,
                color: 'white',
                width: 60,
                height: 60,
                boxShadow: colors.shadowHover,
                '&:hover': {
                  background: colors.gradientHover,
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => navigate('/admin/sites/new')}
            >
              <AddIcon sx={{ fontSize: 28 }} />
            </Fab>
          </motion.div>
        </Tooltip>

        {/* Diálogo de Detalles */}
        <Dialog 
          open={openDetailDialog} 
          onClose={() => setOpenDetailDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              boxShadow: colors.shadowLarge
            }
          }}
        >
          {selectedSite && (
            <>
              <DialogTitle sx={{ 
                background: colors.gradient,
                color: 'white',
                fontWeight: 700,
                py: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Attractions />
                  {selectedSite.name}
                </Box>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                {/* Imagen principal */}
                {selectedSite.images?.[0] && (
                  <Box sx={{ position: 'relative', height: 300 }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={getImageUrl(selectedSite.images[0])}
                      alt={selectedSite.name}
                      sx={{ objectFit: 'cover' }}
                      onError={(e) => {
                        console.log('Error loading detail image:', selectedSite.images?.[0]);
                        e.target.style.display = 'none';
                      }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      display: 'flex',
                      gap: 1
                    }}>
                      {selectedSite.featured && (
                        <Chip 
                          icon={<Star />}
                          label="Destacado"
                          color="warning"
                          sx={{ background: 'rgba(255,255,255,0.9)' }}
                        />
                      )}
                      <Chip 
                        label={selectedSite.category}
                        sx={{ 
                          background: 'rgba(255,255,255,0.9)',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>
                )}

                {/* Información detallada */}
                <Box sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h5" fontWeight="700" gutterBottom color={colors.dark}>
                        Descripción
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {selectedSite.description}
                      </Typography>

                      {selectedSite.highlights && selectedSite.highlights.length > 0 && (
                        <>
                          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mt: 3, color: colors.dark }}>
                            Características Destacadas
                          </Typography>
                          <Stack direction="row" flexWrap="wrap" gap={1}>
                            {selectedSite.highlights.map((highlight, index) => (
                              <Chip
                                key={index}
                                label={highlight}
                                size="small"
                                sx={{
                                  background: `${colors.primary}15`,
                                  color: colors.primary,
                                  fontWeight: 500
                                }}
                              />
                            ))}
                          </Stack>
                        </>
                      )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card sx={{ background: colors.gradientLight, borderRadius: 3 }}>
                        <CardContent>
                          <Typography variant="h6" fontWeight="700" gutterBottom color={colors.dark}>
                            Información del Sitio
                          </Typography>
                          
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <LocationOn sx={{ color: colors.primary }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Ubicación" 
                                secondary={selectedSite.location}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Paid sx={{ color: colors.success }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Precio de entrada" 
                                secondary={`$${selectedSite.entranceFee || '0'} COP`}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <Category sx={{ color: colors.info }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Categoría" 
                                secondary={selectedSite.category}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <CheckCircle sx={{ color: colors.success }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Estado" 
                                secondary={selectedSite.isActive !== false ? 'Activo' : 'Inactivo'}
                              />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Galería de imágenes */}
                  {selectedSite.images && selectedSite.images.length > 1 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" fontWeight="600" gutterBottom color={colors.dark}>
                        Galería de Imágenes
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedSite.images.slice(1).map((image, index) => (
                          <Grid item xs={6} md={3} key={index}>
                            <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                              <CardMedia
                                component="img"
                                height="120"
                                image={getImageUrl(image)}
                                alt={`${selectedSite.name} ${index + 2}`}
                                sx={{ objectFit: 'cover' }}
                                onError={(e) => {
                                  console.log('Error loading gallery image:', image);
                                  e.target.style.display = 'none';
                                }}
                              />
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button 
                  onClick={() => setOpenDetailDialog(false)}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Cerrar
                </Button>
                <Button 
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setOpenDetailDialog(false);
                    navigate(`/admin/sites/edit/${selectedSite._id}`);
                  }}
                  sx={{
                    background: colors.gradient,
                    borderRadius: 2,
                    px: 3,
                    '&:hover': {
                      background: colors.gradientHover
                    }
                  }}
                >
                  Editar Sitio
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Diálogo de Eliminación Mejorado */}
        <Dialog 
          open={openDeleteDialog} 
          onClose={() => setOpenDeleteDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: colors.glass,
              backdropFilter: 'blur(20px)',
              boxShadow: colors.shadowLarge
            }
          }}
        >
          <DialogTitle sx={{ 
            background: colors.error,
            color: 'white',
            fontWeight: 700,
            py: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DeleteForever />
              Confirmar Eliminación
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Warning sx={{ fontSize: 64, color: colors.warning, mb: 2 }} />
              <DialogContentText variant="h6" fontWeight="600" gutterBottom>
                ¿Estás seguro de eliminar este sitio?
              </DialogContentText>
              <DialogContentText>
                Estás a punto de eliminar permanentemente <strong>"{selectedSite?.name}"</strong>. 
                Esta acción no se puede deshacer y se perderán todos los datos asociados al sitio.
              </DialogContentText>
            </Box>

            {selectedSite && (
              <Card sx={{ background: `${colors.error}08`, border: `1px solid ${colors.error}20`, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight="600" gutterBottom color={colors.error}>
                    Información que se eliminará:
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Attractions sx={{ color: colors.error, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Sitio turístico" secondary={selectedSite.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <ImageIcon sx={{ color: colors.error, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Imágenes" 
                        secondary={`${selectedSite.images?.length || 0} imágenes`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Description sx={{ color: colors.error, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary="Descripción y detalles" secondary="Información completa del sitio" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button 
              onClick={() => setOpenDeleteDialog(false)}
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                px: 4,
                borderColor: colors.dark,
                color: colors.dark
              }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained"
              color="error"
              startIcon={<DeleteForever />}
              sx={{
                borderRadius: 2,
                px: 4,
                boxShadow: `0 4px 20px ${colors.error}40`
              }}
            >
              Eliminar Permanentemente
            </Button>
          </DialogActions>
        </Dialog>

        {/* Menú de Acciones Contextual */}
        <Menu 
          anchorEl={anchorEl} 
          open={Boolean(anchorEl)} 
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: colors.shadowHover,
              minWidth: 200,
              border: `1px solid ${colors.primary}10`
            }
          }}
        >
          <MenuItem 
            onClick={() => { handleViewDetails(selectedActionSite); handleMenuClose(); }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <RemoveRedEye fontSize="small" sx={{ color: colors.info }} />
            </ListItemIcon>
            <ListItemText>
              <Typography fontWeight="600">Ver detalles completos</Typography>
            </ListItemText>
          </MenuItem>
          
          <MenuItem 
            onClick={() => { navigate(`/admin/sites/edit/${selectedActionSite?._id}`); handleMenuClose(); }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" sx={{ color: colors.primary }} />
            </ListItemIcon>
            <ListItemText>
              <Typography fontWeight="600">Editar sitio</Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem 
            onClick={() => { handleFeatureToggle(selectedActionSite); handleMenuClose(); }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <Star fontSize="small" sx={{ color: colors.warning }} />
            </ListItemIcon>
            <ListItemText>
              <Typography fontWeight="600">
                {selectedActionSite?.featured ? 'Quitar destacado' : 'Marcar como destacado'}
              </Typography>
            </ListItemText>
          </MenuItem>

          <Divider />

          <MenuItem 
            onClick={() => { handleDeleteClick(selectedActionSite); handleMenuClose(); }} 
            sx={{ py: 1.5, color: colors.error }}
          >
            <ListItemIcon>
              <DeleteForever fontSize="small" sx={{ color: colors.error }} />
            </ListItemIcon>
            <ListItemText>
              <Typography fontWeight="600">Eliminar sitio</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>

        {/* Diálogo de Exportación */}
        <Dialog 
          open={exportDialogOpen} 
          onClose={() => setExportDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: colors.glass,
              backdropFilter: 'blur(20px)'
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Download sx={{ color: colors.primary }} />
              Exportar Datos
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Selecciona el formato para exportar los datos de los sitios turísticos.
            </DialogContentText>
            <List>
              <ListItemButton onClick={handleExport} sx={{ borderRadius: 2 }}>
                <ListItemIcon>
                  <Description sx={{ color: colors.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="JSON" 
                  secondary="Formato estructurado para análisis de datos" 
                />
              </ListItemButton>
              <ListItemButton disabled sx={{ borderRadius: 2, opacity: 0.6 }}>
                <ListItemIcon>
                  <Description sx={{ color: colors.dark }} />
                </ListItemIcon>
                <ListItemText 
                  primary="CSV" 
                  secondary="Próximamente - Formato compatible con hojas de cálculo" 
                />
              </ListItemButton>
              <ListItemButton disabled sx={{ borderRadius: 2, opacity: 0.6 }}>
                <ListItemIcon>
                  <Description sx={{ color: colors.dark }} />
                </ListItemIcon>
                <ListItemText 
                  primary="PDF" 
                  secondary="Próximamente - Reporte en formato documento" 
                />
              </ListItemButton>
            </List>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setExportDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default SiteList;
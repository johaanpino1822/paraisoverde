import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip,
  IconButton,
  Tooltip,
  Fab,
  Zoom,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  FilterList as FilterIcon,
  MyLocation as MyLocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Explore as ExploreIcon,
  Hotel as HotelIcon,
  Landscape as LandscapeIcon,
  Restaurant as RestaurantIcon,
  LocalActivity as ActivityIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Paleta de colores que coincide con la navbar
const mapTheme = {
  primary: '#00791a',
  secondary: '#064273',
  accent: '#27ae60',
  success: '#2ecc71',
  light: '#e8f5e9',
  dark: '#1a3c27',
  gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
  glass: 'rgba(255, 255, 255, 0.95)',
  shadow: '0 8px 32px rgba(0, 121, 26, 0.15)'
};

// Iconos personalizados para los marcadores
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        transition: all 0.3s ease;
      ">
        ${icon}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
};

// Componente para controlar el mapa
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

// Datos de ejemplo para lugares
const locations = [
  {
    id: 1,
    name: "Cascada Natural",
    type: "nature",
    position: [4.6097, -74.0817],
    description: "Hermosa cascada rodeada de vegetación tropical",
    rating: 4.8,
    price: "Gratis",
    icon: "🏞️",
    color: mapTheme.success
  },
  {
    id: 2,
    name: "Eco Hotel Paraíso",
    type: "hotel",
    position: [4.6110, -74.0790],
    description: "Hotel sostenible con vistas panorámicas",
    rating: 4.9,
    price: "$$$",
    icon: "🏨",
    color: mapTheme.primary
  },
  {
    id: 3,
    name: "Mirador Montaña",
    type: "viewpoint",
    position: [4.6080, -74.0830],
    description: "Vista espectacular de todo el valle",
    rating: 4.7,
    price: "Gratis",
    icon: "⛰️",
    color: mapTheme.accent
  },
  {
    id: 4,
    name: "Restaurante Orgánico",
    type: "restaurant",
    position: [4.6100, -74.0800],
    description: "Cocina local con ingredientes orgánicos",
    rating: 4.6,
    price: "$$",
    icon: "🍴",
    color: mapTheme.secondary
  },
  {
    id: 5,
    name: "Sendero Ecológico",
    type: "activity",
    position: [4.6070, -74.0820],
    description: "Ruta de senderismo por la selva tropical",
    rating: 4.8,
    price: "Gratis",
    icon: "🚶",
    color: mapTheme.dark
  }
];

const categoryIcons = {
  nature: <LandscapeIcon />,
  hotel: <HotelIcon />,
  viewpoint: <ExploreIcon />,
  restaurant: <RestaurantIcon />,
  activity: <ActivityIcon />
};

const InteractiveMap = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([4.6097, -74.0817]);
  const [mapZoom, setMapZoom] = useState(14);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const mapRef = useRef();

  const categories = [
    { id: 'all', name: 'Todos', icon: <ExploreIcon />, count: locations.length },
    { id: 'nature', name: 'Naturaleza', icon: <LandscapeIcon />, count: locations.filter(l => l.type === 'nature').length },
    { id: 'hotel', name: 'Hoteles', icon: <HotelIcon />, count: locations.filter(l => l.type === 'hotel').length },
    { id: 'viewpoint', name: 'Miradores', icon: <ExploreIcon />, count: locations.filter(l => l.type === 'viewpoint').length },
    { id: 'restaurant', name: 'Restaurantes', icon: <RestaurantIcon />, count: locations.filter(l => l.type === 'restaurant').length },
    { id: 'activity', name: 'Actividades', icon: <ActivityIcon />, count: locations.filter(l => l.type === 'activity').length }
  ];

  const filteredLocations = selectedCategory === 'all' 
    ? locations 
    : locations.filter(location => location.type === selectedCategory);

  // Obtener ubicación del usuario
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(16);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        }
      );
    }
  };

  // Efecto para obtener ubicación al cargar
  useEffect(() => {
    getUserLocation();
  }, []);

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 10));
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowFilters(false);
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setMapCenter(location.position);
    setMapZoom(16);
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      height: '80vh', 
      borderRadius: 3,
      overflow: 'hidden',
      boxShadow: mapTheme.shadow,
      mt: 2
    }}>
      {/* Header del Mapa */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        p: 2
      }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Paper 
            sx={{ 
              p: 2, 
              background: mapTheme.glass,
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              boxShadow: mapTheme.shadow
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography 
                variant="h5" 
                fontWeight="bold"
                sx={{
                  background: mapTheme.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Mapa Interactivo
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Filtrar lugares">
                  <IconButton 
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{
                      background: mapTheme.primary,
                      color: 'white',
                      '&:hover': { background: mapTheme.dark }
                    }}
                  >
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Mi ubicación">
                  <IconButton 
                    onClick={getUserLocation}
                    sx={{
                      background: mapTheme.secondary,
                      color: 'white',
                      '&:hover': { background: '#05355a' }
                    }}
                  >
                    <MyLocationIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Filtros de categorías */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {categories.map((category) => (
                      <motion.div
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Chip
                          icon={category.icon}
                          label={`${category.name} (${category.count})`}
                          onClick={() => handleCategorySelect(category.id)}
                          variant={selectedCategory === category.id ? "filled" : "outlined"}
                          sx={{
                            background: selectedCategory === category.id ? mapTheme.primary : 'transparent',
                            color: selectedCategory === category.id ? 'white' : mapTheme.primary,
                            borderColor: mapTheme.primary,
                            fontWeight: 'bold',
                            '&:hover': {
                              background: selectedCategory === category.id ? mapTheme.dark : `${mapTheme.primary}10`
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>
        </motion.div>
      </Box>

      {/* Controles del Mapa */}
      <Box sx={{
        position: 'absolute',
        right: 16,
        top: isMobile ? 160 : 120,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Fab
            size="small"
            onClick={handleZoomIn}
            sx={{
              background: mapTheme.glass,
              backdropFilter: 'blur(10px)',
              color: mapTheme.primary,
              boxShadow: mapTheme.shadow
            }}
          >
            <ZoomInIcon />
          </Fab>
        </Zoom>
        
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <Fab
            size="small"
            onClick={handleZoomOut}
            sx={{
              background: mapTheme.glass,
              backdropFilter: 'blur(10px)',
              color: mapTheme.primary,
              boxShadow: mapTheme.shadow
            }}
          >
            <ZoomOutIcon />
          </Fab>
        </Zoom>
      </Box>

      {/* Mapa */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {/* Marcadores */}
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={createCustomIcon(location.color, location.icon)}
            eventHandlers={{
              click: () => handleLocationClick(location)
            }}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {location.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {location.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Chip 
                    label={`⭐ ${location.rating}`} 
                    size="small" 
                    sx={{ background: mapTheme.success, color: 'white' }}
                  />
                  <Typography variant="body2" fontWeight="bold" color={mapTheme.primary}>
                    {location.price}
                  </Typography>
                </Box>
              </Box>
            </Popup>
          </Marker>
        ))}

        {/* Marcador de usuario */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              html: `
                <div style="
                  background: ${mapTheme.secondary};
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                  animation: pulse 2s infinite;
                "></div>
                <style>
                  @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                  }
                </style>
              `,
              className: 'user-marker',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
          >
            <Popup>
              <Typography variant="body2" fontWeight="bold">
                Tu ubicación
              </Typography>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Panel de información lateral */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            style={{
              position: 'absolute',
              right: 16,
              top: isMobile ? 180 : 140,
              zIndex: 1000,
              width: isMobile ? 'calc(100% - 32px)' : 320
            }}
          >
            <Card 
              sx={{ 
                background: mapTheme.glass,
                backdropFilter: 'blur(20px)',
                boxShadow: mapTheme.shadow,
                borderRadius: 3
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: selectedLocation.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      boxShadow: `0 4px 12px ${selectedLocation.color}40`
                    }}
                  >
                    {selectedLocation.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedLocation.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedLocation.description}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={`⭐ ${selectedLocation.rating}`} 
                    sx={{ background: mapTheme.success, color: 'white', fontWeight: 'bold' }}
                  />
                  <Typography variant="h6" color={mapTheme.primary} fontWeight="bold">
                    {selectedLocation.price}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: mapTheme.primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Ver Detalles
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      background: 'transparent',
                      color: mapTheme.primary,
                      border: `2px solid ${mapTheme.primary}`,
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedLocation(null)}
                  >
                    Cerrar
                  </motion.button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer del mapa */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        p: 2
      }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Paper 
            sx={{ 
              p: 1.5, 
              background: mapTheme.glass,
              backdropFilter: 'blur(20px)',
              borderRadius: 2,
              boxShadow: mapTheme.shadow
            }}
          >
            <Typography variant="body2" textAlign="center" color="text.secondary">
              🗺️ {filteredLocations.length} lugares encontrados • 💚 Turismo Sostenible
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default InteractiveMap;
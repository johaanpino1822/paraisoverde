import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Tooltip, 
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Chip,
  Typography,
  Stack,
  Skeleton,
  useTheme,
  TablePagination,
  Alert,
  Menu,
  MenuItem,
  Divider,
  Fab
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../../Api/config';
import { useNavigate } from 'react-router-dom';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActionHotel, setSelectedActionHotel] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/hotels');
      setHotels(data);
      setFilteredHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('No se pudieron cargar los hoteles. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    const results = hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.priceRange.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHotels(results);
    setPage(0); // Reset to first page on search
  }, [searchTerm, hotels]);

  const handleDeleteClick = (hotel) => {
    setSelectedHotel(hotel);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/hotels/${selectedHotel._id}`);
      setHotels(hotels.filter(hotel => hotel._id !== selectedHotel._id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting hotel:', error);
      setError('Error al eliminar el hotel. Por favor, intente nuevamente.');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, hotel) => {
    setAnchorEl(event.currentTarget);
    setSelectedActionHotel(hotel);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActionHotel(null);
  };

  const handleRefresh = () => {
    fetchHotels();
  };

  return (
    <Box sx={{ mt: 4, p: 3, backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight="600">
          Gestión de Hoteles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/hotels/new')}
          sx={{ 
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Añadir Hotel
        </Button>
      </Stack>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Buscar hoteles por nombre, ubicación o precio..."
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Tooltip title="Filtrar">
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Actualizar">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600 }}>Imagen</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Precio</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Comodidades</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(rowsPerPage)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton variant="rectangular" width={56} height={56} /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Skeleton variant="rectangular" width={60} height={24} />
                        <Skeleton variant="rectangular" width={60} height={24} />
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredHotels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      {searchTerm ? 'No se encontraron hoteles que coincidan con la búsqueda' : 'No hay hoteles registrados'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHotels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((hotel) => (
                  <TableRow key={hotel._id} hover>
                    <TableCell>
                      <Avatar 
                        src={hotel.images?.[0]} 
                        variant="rounded"
                        sx={{ width: 56, height: 56, borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="500">{hotel.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">{hotel.location}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={hotel.priceRange} 
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                          <Chip 
                            key={index} 
                            label={amenity} 
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {hotel.amenities?.length > 3 && (
                          <Chip 
                            label={`+${hotel.amenities.length - 3}`} 
                            size="small" 
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            onClick={() => navigate(`/hotel/${hotel._id}`)}
                            size="small"
                            color="info"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            onClick={() => navigate(`/admin/hotels/edit/${hotel._id}`)}
                            size="small"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Más opciones">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, hotel)}
                            aria-label="more"
                            aria-controls="hotel-menu"
                            aria-haspopup="true"
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredHotels.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Hoteles por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 2,
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar permanentemente el hotel <strong>{selectedHotel?.name}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
            sx={{ textTransform: 'none' }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        id="hotel-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 1,
          sx: {
            borderRadius: 2,
            minWidth: '180px'
          }
        }}
      >
        <MenuItem 
          onClick={() => {
            navigate(`/hotel/${selectedActionHotel?._id}`);
            handleMenuClose();
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Ver detalles
        </MenuItem>
        <MenuItem 
          onClick={() => {
            navigate(`/admin/hotels/edit/${selectedActionHotel?._id}`);
            handleMenuClose();
          }}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => {
            handleDeleteClick(selectedActionHotel);
            handleMenuClose();
          }}
          sx={{ color: theme.palette.error.main }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Tooltip title="Registrar nuevo hotel">
        <Fab 
          color="primary" 
          aria-label="add" 
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000
          }}
          onClick={() => navigate('/admin/hotels/new')}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default HotelList;

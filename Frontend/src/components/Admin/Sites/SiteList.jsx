import React, { useState, useEffect } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip, TextField, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Avatar, Chip, Typography, Stack, Skeleton,
  useTheme, TablePagination, Alert, Menu, MenuItem, Divider, Fab
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon,
  Visibility as VisibilityIcon, MoreVert as MoreVertIcon,
  Search as SearchIcon, FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../../Api/config';
import { useNavigate } from 'react-router-dom';

const SiteList = () => {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedActionSite, setSelectedActionSite] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/sites');
      setSites(data);
      setFilteredSites(data);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setError('No se pudieron cargar los sitios turísticos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    const results = sites.filter(site =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSites(results);
    setPage(0);
  }, [searchTerm, sites]);

  const handleDeleteClick = (site) => {
    setSelectedSite(site);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/sites/${selectedSite._id}`);
      setSites(sites.filter(site => site._id !== selectedSite._id));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting site:', error);
      setError('Error al eliminar el sitio.');
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, site) => {
    setAnchorEl(event.currentTarget);
    setSelectedActionSite(site);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedActionSite(null);
  };
  const handleRefresh = () => fetchSites();

  return (
    <Box sx={{ mt: 4, p: 3, backgroundColor: theme.palette.background.paper, borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={5} mb={4}>
        <Typography variant="h5" fontWeight="600">Gestión de Sitios Turísticos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/sites/new')}
        >
          Añadir Sitio
        </Button>
      </Stack>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar sitios por nombre o ubicación..."
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Tooltip title="Filtrar"><IconButton><FilterIcon /></IconButton></Tooltip>
          <Tooltip title="Actualizar"><IconButton onClick={handleRefresh}><RefreshIcon /></IconButton></Tooltip>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.grey[50] }}>
                <TableCell sx={{ fontWeight: 600 }}>Imagen</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(rowsPerPage)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton variant="rectangular" width={56} height={56} /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="circular" width={40} height={40} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredSites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">
                      {searchTerm ? 'No se encontraron sitios.' : 'No hay sitios registrados.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(site => (
                  <TableRow key={site._id} hover>
                    <TableCell>
                      <Avatar src={site.images?.[0]} variant="rounded" sx={{ width: 56, height: 56 }} />
                    </TableCell>
                    <TableCell><Typography fontWeight="500">{site.name}</Typography></TableCell>
                    <TableCell>{site.location}</TableCell>
                    <TableCell><Typography variant="body2" color="textSecondary">{site.description?.slice(0, 40)}...</Typography></TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Ver detalles">
                          <IconButton onClick={() => navigate(`/site/${site._id}`)} size="small" color="info">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => navigate(`/admin/sites/edit/${site._id}`)} size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Más opciones">
                          <IconButton onClick={(e) => handleMenuOpen(e, site)} size="small">
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
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredSites.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Eliminar diálogo */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Eliminar Sitio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de eliminar el sitio <strong>{selectedSite?.name}</strong>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Menú de acciones */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { navigate(`/site/${selectedActionSite?._id}`); handleMenuClose(); }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { navigate(`/admin/sites/edit/${selectedActionSite?._id}`); handleMenuClose(); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleDeleteClick(selectedActionSite); handleMenuClose(); }} sx={{ color: theme.palette.error.main }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Eliminar
        </MenuItem>
      </Menu>

      {/* Botón flotante */}
      <Tooltip title="Registrar nuevo sitio">
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          onClick={() => navigate('/admin/sites/new')}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default SiteList;

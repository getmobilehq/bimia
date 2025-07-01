import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Tooltip, 
  CircularProgress, 
  Alert,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  useTheme,
  useMediaQuery,
  Collapse,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ClearIcon from '@mui/icons-material/Clear';
import { DataGrid } from '@mui/x-data-grid';
import { useUploads, useDeleteUpload } from '../hooks/useUploads';

export default function ManageDatasets({ userRole }) {
  const { data, isLoading, isError, error, refetch } = useUploads();
  const deleteUpload = useDeleteUpload();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState(isMobile ? 'card' : 'table');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getStatusChip = (status) => {
    const statusConfig = {
      approved: { 
        label: 'Approved', 
        color: 'success', 
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> 
      },
      pending: { 
        label: 'Pending', 
        color: 'warning', 
        icon: <PendingIcon sx={{ fontSize: 14 }} /> 
      },
      rejected: { 
        label: 'Rejected', 
        color: 'error', 
        icon: <CancelIcon sx={{ fontSize: 14 }} /> 
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{
          fontWeight: 600,
          '& .MuiChip-icon': {
            marginLeft: '4px',
          }
        }}
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    { 
      field: 'table_name', 
      headerName: 'Dataset Name', 
      flex: isMobile ? 1 : 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
          {params.value}
        </Typography>
      ),
    },
    { 
      field: 'data_description', 
      headerName: 'Description', 
      flex: 2,
      minWidth: 200,
      hide: isMobile,
      renderCell: (params) => (
        <Tooltip title={params.value || ''}>
          <Typography variant="body2" sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {params.value || 'No description'}
          </Typography>
        </Tooltip>
      )
    },
    { 
      field: 'created_at',
      headerName: 'Uploaded',
      flex: 1,
      minWidth: 120,
      hide: isMobile,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {formatDate(params.value)}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => getStatusChip(params.value)
    },
  ];
  // Only admins see the actions column
  if (userRole === 'admin') {
    columns.push({
      field: 'actions',
      headerName: 'Actions',
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Edit dataset (coming soon)">
            <span>
              <IconButton 
                size="small" 
                disabled
                sx={{ 
                  color: '#1e3c72',
                  '&:hover': { 
                    bgcolor: 'rgba(30, 60, 114, 0.08)' 
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete dataset">
            <IconButton 
              size="small" 
              onClick={() => {
                setSelectedId(params.row.id);
                setDeleteDialogOpen(true);
              }}
              disabled={deleteUpload.isLoading}
              sx={{ 
                color: '#d32f2f',
                '&:hover': { 
                  bgcolor: 'rgba(211, 47, 47, 0.08)' 
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    });
  }

  const handleDelete = () => {
    if (selectedId) {
      deleteUpload.mutate(selectedId, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedId(null);
        }
      });
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setStatusFilter('all');
    setSortBy('newest');
  };

  const filteredData = Array.isArray(data) 
    ? data
        .map((row) => ({ ...row, id: row.id || row.upload_id }))
        .filter(row => {
          const matchesSearch = searchText === '' || 
            row.table_name?.toLowerCase().includes(searchText.toLowerCase()) ||
            row.data_description?.toLowerCase().includes(searchText.toLowerCase());
          
          const matchesStatus = statusFilter === 'all' || 
            row.status?.toLowerCase() === statusFilter;
          
          return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'newest':
              return new Date(b.created_at || 0) - new Date(a.created_at || 0);
            case 'oldest':
              return new Date(a.created_at || 0) - new Date(b.created_at || 0);
            case 'name':
              return (a.table_name || '').localeCompare(b.table_name || '');
            default:
              return 0;
          }
        })
    : [];

  const renderCardView = () => (
    <Grid container spacing={2}>
      {filteredData.map((dataset) => (
        <Grid item xs={12} sm={6} lg={4} key={dataset.id}>
          <Card 
            elevation={0}
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              '&:hover': {
                boxShadow: 2,
                borderColor: '#1e3c72',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <CardContent sx={{ pb: 1 }}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" fontWeight={600} sx={{ wordBreak: 'break-word', flex: 1 }}>
                    {dataset.table_name}
                  </Typography>
                  {getStatusChip(dataset.status)}
                </Stack>
                
                <Typography variant="body2" color="text.secondary" sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  minHeight: '2.5em',
                }}>
                  {dataset.data_description || 'No description'}
                </Typography>
                
                <Typography variant="caption" color="text.secondary">
                  Uploaded: {formatDate(dataset.created_at)}
                </Typography>
              </Stack>
            </CardContent>
            
            <CardActions sx={{ pt: 0 }}>
              {userRole === 'admin' && (
                <>
                  <Tooltip title="Edit dataset (coming soon)">
                    <span>
                      <IconButton size="small" disabled>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete dataset">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => {
                        setSelectedId(dataset.id);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={deleteUpload.isLoading}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress size={48} sx={{ color: '#1e3c72' }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert 
        severity="error" 
        sx={{ borderRadius: 2 }}
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        {error?.response?.data?.detail || error?.message || 'Failed to load datasets.'}
      </Alert>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
        <CircularProgress color="primary" />
        <Typography variant="body2" sx={{ ml: 2 }}>Loading datasets...</Typography>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
          Failed to load datasets: {error?.message || 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  // Empty state
  if (!filteredData.length) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No datasets available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters, or check back later.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={0} sx={{ borderRadius: 3, background: 'white', overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3c72' }}>
                Manage Datasets
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {filteredData.length} dataset{filteredData.length !== 1 ? 's' : ''} total
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Refresh data">
                <IconButton 
                  onClick={() => refetch()}
                  sx={{ 
                    color: '#1e3c72',
                    '&:hover': { bgcolor: 'rgba(30, 60, 114, 0.08)' }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Toggle filters">
                <IconButton 
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  sx={{ 
                    color: filtersOpen ? '#1e3c72' : 'text.secondary',
                    bgcolor: filtersOpen ? 'rgba(30, 60, 114, 0.08)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(30, 60, 114, 0.08)' }
                  }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>

              {!isMobile && (
                <Stack direction="row" spacing={0} sx={{ bgcolor: 'background.default', borderRadius: 1, p: 0.5 }}>
                  <Tooltip title="Table view">
                    <IconButton 
                      size="small"
                      onClick={() => setViewMode('table')}
                      sx={{ 
                        bgcolor: viewMode === 'table' ? 'white' : 'transparent',
                        color: viewMode === 'table' ? '#1e3c72' : 'text.secondary',
                        boxShadow: viewMode === 'table' ? 1 : 0,
                      }}
                    >
                      <ViewListIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Card view">
                    <IconButton 
                      size="small"
                      onClick={() => setViewMode('card')}
                      sx={{ 
                        bgcolor: viewMode === 'card' ? 'white' : 'transparent',
                        color: viewMode === 'card' ? '#1e3c72' : 'text.secondary',
                        boxShadow: viewMode === 'card' ? 1 : 0,
                      }}
                    >
                      <ViewModuleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>

        {/* Filters */}
        <Collapse in={filtersOpen}>
          <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f5f5f7' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  placeholder="Search datasets..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#1e3c72',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1e3c72',
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ bgcolor: 'white' }}
                  >
                    <MenuItem value="newest">Newest first</MenuItem>
                    <MenuItem value="oldest">Oldest first</MenuItem>
                    <MenuItem value="name">Name A-Z</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={12} md={4}>
                <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                  <Button
                    startIcon={<ClearIcon />}
                    onClick={clearFilters}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    Clear Filters
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        {/* Content */}
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {viewMode === 'table' ? (
            <Box sx={{ width: '100%', minHeight: 400 }}>
              <DataGrid
                rows={filteredData}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: isMobile ? 5 : 10 },
                  },
                }}
                pageSizeOptions={isMobile ? [5, 10] : [5, 10, 25]}
                disableRowSelectionOnClick
                autoHeight
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-main': {
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    bgcolor: '#f5f5f7',
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 600,
                      color: '#1e3c72',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                    },
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 2,
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                  },
                  '& .MuiDataGrid-row': {
                    '&:hover': {
                      bgcolor: '#f5f5f7',
                    },
                    '&:last-child .MuiDataGrid-cell': {
                      borderBottom: 'none',
                    },
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '2px solid',
                    borderColor: 'divider',
                    bgcolor: '#f5f5f7',
                  },
                }}
                localeText={{
                  noRowsLabel: searchText || statusFilter !== 'all' ? 'No datasets found matching your filters' : 'No datasets uploaded yet',
                }}
              />
            </Box>
          ) : (
            renderCardView()
          )}

          {filteredData.length === 0 && !isLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchText || statusFilter !== 'all' ? 'No datasets found' : 'No datasets yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchText || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Upload your first dataset to get started'
                }
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        TransitionComponent={Fade}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            mx: 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Delete Dataset
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this dataset? This action cannot be undone and the data will be permanently removed from the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            disabled={deleteUpload.isLoading}
            sx={{
              bgcolor: '#d32f2f',
              '&:hover': {
                bgcolor: '#b71c1c',
              }
            }}
          >
            {deleteUpload.isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Delete'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
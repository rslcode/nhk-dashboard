'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { 
  PencilIcon, 
  TrashIcon, 
  BuildingsIcon, 
  PlusIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  GlobeIcon,
  MapTrifoldIcon,
  ArrowLeftIcon
} from '@phosphor-icons/react/dist/ssr';

import { useNavigation } from '@/hooks/use-navigation';
import { MapView } from './map-view';

interface NavigationItem {
  id: number;
  name?: string;
  title?: string;
  type: 'city' | 'service' | 'object' | 'address';
  latitude?: number;
  longitude?: number;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  children?: NavigationItem[];
}

interface RecursiveNavigationProps {
  onEditCity: (item: any) => void;
  onCreateService: (city: any) => void;
  onEditService: (item: any, city: any) => void;
  onCreateObject: (service: any, city: any) => void;
  onEditObject: (item: any, service: any, city: any) => void;
  onCreateAddress: (object: any, service: any, city: any) => void;
  onEditAddress: (item: any, object: any, service: any, city: any) => void;
}

export function RecursiveNavigation({
  onEditCity,
  onCreateService,
  onEditService,
  onCreateObject,
  onEditObject,
  onCreateAddress,
  onEditAddress
}: RecursiveNavigationProps): React.JSX.Element {
  const { cities, services, objects, addresses, isLoading, deleteCity, deleteService, deleteObject, deleteAddress } = useNavigation();
  const [selectedItem, setSelectedItem] = React.useState<NavigationItem | null>(null);
  const [navigationPath, setNavigationPath] = React.useState<NavigationItem[]>([]);
  const [showMap, setShowMap] = React.useState(false);
  const [mapLocation, setMapLocation] = React.useState<{lat: number, lng: number, title: string} | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<any>(null);
  const [deleteType, setDeleteType] = React.useState<'city' | 'service' | 'object' | 'address'>('city');

  const handleDeleteClick = (item: any, type: 'city' | 'service' | 'object' | 'address') => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        if (deleteType === 'city') {
          await deleteCity(itemToDelete.id);
        } else if (deleteType === 'service') {
          await deleteService(itemToDelete.id);
        } else if (deleteType === 'object') {
          await deleteObject(itemToDelete.id);
        } else if (deleteType === 'address') {
          await deleteAddress(itemToDelete.id);
        }
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleItemClick = (item: NavigationItem) => {
    setSelectedItem(item);
    setNavigationPath([...navigationPath, item]);
  };

  const handleCityClick = (city: any) => {
    handleItemClick({
      id: city.id,
      name: city.name,
      type: 'city'
    });
  };

  const handleServiceClick = (service: any) => {
    handleItemClick({
      id: service.id,
      title: service.title,
      type: 'service'
    });
  };

  const handleObjectClick = (object: any) => {
    handleItemClick({
      id: object.id,
      title: object.title,
      type: 'object',
      latitude: object.latitude,
      longitude: object.longitude
    });
  };

  const handleBackClick = () => {
    const newPath = navigationPath.slice(0, -1);
    setNavigationPath(newPath);
    setSelectedItem(newPath.length > 0 ? newPath[newPath.length - 1] : null);
  };

  const handleShowOnMap = (item: NavigationItem) => {
    if (item.latitude && item.longitude) {
      setMapLocation({
        lat: item.latitude,
        lng: item.longitude,
        title: item.name || item.title || 'Location'
      });
      setShowMap(true);
    }
  };

  const handleShowServiceOnMap = (service: any) => {
    if (service.latitude && service.longitude) {
      setMapLocation({
        lat: service.latitude,
        lng: service.longitude,
        title: service.title
      });
      setShowMap(true);
    }
  };

  const handleShowAddressOnMap = (address: any) => {
    // Для адресов используем координаты объекта, к которому они принадлежат
    const object = objects.find(o => o.id === address.objectId);
    if (object && object.latitude && object.longitude) {
      setMapLocation({
        lat: object.latitude,
        lng: object.longitude,
        title: `${address.title} - ${object.title}`
      });
      setShowMap(true);
    }
  };

  const getServiceTypeColor = (type: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'> = {
      hotel: 'primary',
      restaurant: 'secondary',
      attraction: 'success',
      transport: 'info',
      entertainment: 'warning',
      shopping: 'error',
      medical: 'default',
      other: 'default'
    };
    return colors[type] || 'default';
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hotel: 'Hotel',
      restaurant: 'Restaurant',
      attraction: 'Attraction',
      transport: 'Transport',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      medical: 'Medical',
      other: 'Other'
    };
    return labels[type] || 'Other';
  };

  const buildNavigationTree = (): NavigationItem[] => {
    return cities.map(city => {
      const cityServices = services.filter(s => s.cityId === city.id);
      return {
        id: city.id,
        name: city.name,
        type: 'city' as const,
        children: cityServices.map(service => {
          const serviceObjects = objects.filter(o => o.serviceId === service.id);
          return {
            id: service.id,
            title: service.title,
            type: 'service' as const,
            children: serviceObjects.map(object => {
              const objectAddresses = addresses.filter(a => a.objectId === object.id);
              return {
                id: object.id,
                title: object.title,
                type: 'object' as const,
                latitude: object.latitude,
                longitude: object.longitude,
                children: objectAddresses.map(address => ({
                  id: address.id,
                  title: address.title,
                  type: 'address' as const,
                  address: address.address,
                  phone: address.phone,
                  email: address.email,
                  website: address.website,
                  description: address.description
                }))
              };
            })
          };
        })
      };
    });
  };

  const renderCurrentLevel = () => {
    if (!selectedItem) {
      // Показываем города
      return (
        <Grid container spacing={2}>
          {cities.map((city) => (
            <Grid item xs={12} sm={6} md={4} key={city.id}>
                              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }} onClick={() => handleCityClick(city)}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <BuildingsIcon size={24} />
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {city.name}
                      </Typography>
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {services.filter(s => s.cityId === city.id).length} services
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateService(city);
                        }}
                        startIcon={<PlusIcon />}
                      >
                        Add Service
                      </Button>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCity(city);
                        }}
                        color="primary"
                      >
                        <PencilIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(city, 'city');
                        }}
                        color="error"
                      >
                        <TrashIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (selectedItem.type === 'city') {
      // Показываем сервисы города
      const cityServices = services.filter(s => s.cityId === selectedItem.id);
      return (
        <Grid container spacing={2}>
          {cityServices.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }} onClick={() => handleServiceClick(service)}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <BuildingsIcon size={24} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {service.title}
                      </Typography>
                      <Chip
                        label={getServiceTypeLabel(service.type)}
                        size="small"
                        color={getServiceTypeColor(service.type)}
                        variant="outlined"
                      />
                    </Box>
                  </Stack>
                  
                  {service.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {service.description}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {objects.filter(o => o.serviceId === service.id).length} objects
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateObject(service, selectedItem);
                      }}
                      startIcon={<PlusIcon />}
                    >
                      Add Object
                    </Button>
                    {service.latitude && service.longitude && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowServiceOnMap(service);
                        }}
                        color="info"
                      >
                        <MapTrifoldIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditService(service, selectedItem);
                      }}
                      color="primary"
                    >
                      <PencilIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(service, 'service');
                      }}
                      color="error"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (selectedItem.type === 'service') {
      // Показываем объекты сервиса
      const serviceObjects = objects.filter(o => o.serviceId === selectedItem.id);
      return (
        <Grid container spacing={2}>
          {serviceObjects.map((object) => (
            <Grid item xs={12} sm={6} md={4} key={object.id}>
              <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 3 } }} onClick={() => handleObjectClick(object)}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <MapPinIcon size={24} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {object.title}
                    </Typography>
                  </Stack>
                  
                  {object.latitude && object.longitude && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {object.latitude}, {object.longitude}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {addresses.filter(a => a.objectId === object.id).length} addresses
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateAddress(object, selectedItem, navigationPath[navigationPath.length - 2]);
                      }}
                      startIcon={<PlusIcon />}
                    >
                      Add Address
                    </Button>
                    {object.latitude && object.longitude && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowOnMap(object);
                        }}
                        color="info"
                      >
                        <MapTrifoldIcon />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditObject(object, selectedItem, navigationPath[navigationPath.length - 2]);
                      }}
                      color="primary"
                    >
                      <PencilIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(object, 'object');
                      }}
                      color="error"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (selectedItem.type === 'object') {
      // Показываем адреса объекта
      const objectAddresses = addresses.filter(a => a.objectId === selectedItem.id);
      return (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell>Contact Info</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {objectAddresses.map((address) => (
                  <TableRow key={address.id}>
                                         <TableCell>
                       <Typography variant="body2" fontWeight="medium">
                         {address.title}
                       </Typography>
                       <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                         {address.address}
                       </Typography>
                       {address.description && (
                         <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                           {address.description}
                         </Typography>
                       )}
                       <Typography variant="caption" color="primary" sx={{ display: 'block', mt: 0.5 }}>
                         {(() => {
                           const object = objects.find(o => o.id === address.objectId);
                           return object ? object.title : 'Unknown Object';
                         })()}
                       </Typography>
                     </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {address.phone && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <PhoneIcon size={14} />
                            <Typography variant="caption">{address.phone}</Typography>
                          </Stack>
                        )}
                        {address.email && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <EnvelopeIcon size={14} />
                            <Typography variant="caption">{address.email}</Typography>
                          </Stack>
                        )}
                        {address.website && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <GlobeIcon size={14} />
                            <Typography variant="caption">{address.website}</Typography>
                          </Stack>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(address.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1}>
                        {(() => {
                          const object = objects.find(o => o.id === address.objectId);
                          return object && object.latitude && object.longitude ? (
                            <IconButton
                              size="small"
                              onClick={() => handleShowAddressOnMap(address)}
                              color="info"
                            >
                              <MapTrifoldIcon />
                            </IconButton>
                          ) : null;
                        })()}
                        <IconButton
                          size="small"
                          onClick={() => onEditAddress(address, selectedItem, navigationPath[navigationPath.length - 2], navigationPath[navigationPath.length - 3])}
                          color="primary"
                        >
                          <PencilIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(address, 'address')}
                          color="error"
                        >
                          <TrashIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Breadcrumb Navigation */}
      {navigationPath.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
          <Button
            startIcon={<ArrowLeftIcon />}
            onClick={handleBackClick}
            variant="outlined"
            size="small"
          >
            Back
          </Button>
          <Typography variant="body2" color="text.secondary">
            |
          </Typography>
          {navigationPath.map((item, index) => (
            <React.Fragment key={item.id}>
              <Button
                onClick={() => {
                  const newPath = navigationPath.slice(0, index + 1);
                  setNavigationPath(newPath);
                  setSelectedItem(newPath[newPath.length - 1]);
                }}
                variant="text"
                size="small"
                sx={{ minWidth: 'auto', p: 0.5 }}
              >
                {item.name || item.title}
              </Button>
              {index < navigationPath.length - 1 && (
                <Typography variant="body2" color="text.secondary">
                  /
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Stack>
      )}

      {/* Current Level Content */}
      {renderCurrentLevel()}

      {/* Map Dialog */}
      <Dialog
        open={showMap}
        onClose={() => setShowMap(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {mapLocation?.title}
        </DialogTitle>
        <DialogContent>
          {mapLocation && (
            <MapView
              latitude={mapLocation.lat}
              longitude={mapLocation.lng}
              title={mapLocation.title}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMap(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete {deleteType === 'city' ? 'City' : deleteType === 'service' ? 'Service' : deleteType === 'object' ? 'Object' : 'Address'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{itemToDelete?.name || itemToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 
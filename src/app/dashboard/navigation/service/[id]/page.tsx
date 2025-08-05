'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PlusIcon, ArrowLeftIcon, PencilIcon, TrashIcon, MapTrifoldIcon, AddressBookIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { useNavigation } from '@/hooks/use-navigation';
import { ObjectFormWithMap } from '@/components/dashboard/navigation/object-form-with-map';
import { AddressForm } from '@/components/dashboard/navigation/address-form';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export default function ServicePage({ params }: ServicePageProps): React.JSX.Element {
  const resolvedParams = React.use(params);
  const { cities, services, objects, addresses, deleteObject, deleteAddress } = useNavigation();
  const [isObjectFormOpen, setIsObjectFormOpen] = React.useState(false);
  const [editingObject, setEditingObject] = React.useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [objectToDelete, setObjectToDelete] = React.useState<any>(null);
  const [selectedObject, setSelectedObject] = React.useState<any>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<any>(null);
  const [addressDeleteDialogOpen, setAddressDeleteDialogOpen] = React.useState(false);
  const [addressToDelete, setAddressToDelete] = React.useState<any>(null);

  const selectedService = services.find(service => service.id === parseInt(resolvedParams.id));
  const selectedCity = cities.find(city => city.id === selectedService?.cityId);
  const serviceObjects = objects.filter(obj => obj.serviceId === parseInt(resolvedParams.id));

  const handleCreateObject = () => {
    setEditingObject(null);
    setIsObjectFormOpen(true);
  };

  const handleEditObject = (object: any) => {
    setEditingObject(object);
    setIsObjectFormOpen(true);
  };

  const handleCloseObjectForm = () => {
    setIsObjectFormOpen(false);
    setEditingObject(null);
  };

  const handleDeleteObject = (object: any) => {
    setObjectToDelete(object);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (objectToDelete) {
      deleteObject(objectToDelete.id);
      setDeleteDialogOpen(false);
      setObjectToDelete(null);
      if (selectedObject?.id === objectToDelete.id) {
        setSelectedObject(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setObjectToDelete(null);
  };

  const handleShowAddresses = (object: any) => {
    setSelectedObject(object);
  };

  const handleBackToObjects = () => {
    setSelectedObject(null);
  };

  const handleCreateAddress = () => {
    setEditingAddress(null);
    setIsAddressFormOpen(true);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setIsAddressFormOpen(true);
  };

  const handleCloseAddressForm = () => {
    setIsAddressFormOpen(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (address: any) => {
    setAddressToDelete(address);
    setAddressDeleteDialogOpen(true);
  };

  const handleConfirmAddressDelete = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete.id);
      setAddressDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleCancelAddressDelete = () => {
    setAddressDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const getServiceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      hotel: 'Hotel',
      restaurant: 'Restaurant',
      attraction: 'Attraction',
      transport: 'Transport',
      entertainment: 'Entertainment',
      shopping: 'Shopping',
      medical: 'Medical',
      other: 'Other'
    };
    return typeMap[type] || type;
  };

  const getServiceTypeColor = (type: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'> = {
      hotel: 'primary',
      restaurant: 'success',
      attraction: 'info',
      transport: 'warning',
      entertainment: 'secondary',
      shopping: 'primary',
      medical: 'error',
      other: 'default'
    };
    return colorMap[type] || 'default';
  };

  if (!selectedService || !selectedCity) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4">Service not found</Typography>
      </Container>
    );
  }

  // Show addresses for selected object
  if (selectedObject) {
    const objectAddresses = addresses.filter(addr => addr.objectId === selectedObject.id);
    
    return (
      <Container maxWidth="xl">
        {/* Header with Back button, Object Title, and Add Address button */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton onClick={handleBackToObjects}><ArrowLeftIcon /></IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">{selectedObject.title}</Typography>
            <Typography variant="body1" color="text.secondary">in {selectedService.title} ({selectedCity.name})</Typography>
            {selectedObject.latitude && selectedObject.longitude && (
              <Typography variant="body2" color="text.secondary">Coordinates: {selectedObject.latitude}, {selectedObject.longitude}</Typography>
            )}
          </Box>
          <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateAddress}>Add Address</Button>
        </Stack>

        {/* Addresses Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Addresses ({objectAddresses.length})</Typography>
            {objectAddresses.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {objectAddresses.map((address) => (
                      <TableRow key={address.id}>
                        <TableCell>
                          <Typography variant="subtitle2">{address.title}</Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            {selectedObject.latitude && selectedObject.longitude && (
                              <IconButton 
                                size="small" 
                                onClick={() => console.log('Show address on map:', address)} 
                                color="info"
                              >
                                <MapTrifoldIcon />
                              </IconButton>
                            )}
                            <IconButton size="small" onClick={() => handleEditAddress(address)} color="primary"><PencilIcon /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteAddress(address)} color="error"><TrashIcon /></IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">No addresses yet. Click "Add Address" to create one.</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Address Form */}
        {isAddressFormOpen && (<AddressForm open={isAddressFormOpen} onClose={handleCloseAddressForm} item={editingAddress} object={selectedObject} service={selectedService} city={selectedCity} />)}

        {/* Address Delete Confirmation Dialog */}
        <Dialog open={addressDeleteDialogOpen} onClose={handleCancelAddressDelete}>
          <DialogTitle>Delete Address</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete "{addressToDelete?.title}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelAddressDelete}>Cancel</Button>
            <Button onClick={handleConfirmAddressDelete} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  // Show objects grid
  return (
    <Container maxWidth="xl">
      {/* Header with Back button, Service Title, and Add Object button */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Link href={`/dashboard/navigation/city/${selectedCity.id}`} passHref>
          <IconButton><ArrowLeftIcon /></IconButton>
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">{selectedService.title || `${selectedService.type} Services`}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1" color="text.secondary">in {selectedCity.name}</Typography>
            <Chip 
              label={getServiceTypeLabel(selectedService.type)} 
              size="small" 
              color={getServiceTypeColor(selectedService.type)} 
              variant="outlined" 
            />
          </Stack>
          {selectedService.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{selectedService.description}</Typography>
          )}
        </Box>
        <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateObject}>Add Object</Button>
      </Stack>

      {/* Objects Grid */}
      <Grid container spacing={3}>
        {serviceObjects.map((object) => {
          const objectAddresses = addresses.filter(addr => addr.objectId === object.id);
          return (
            <Grid item xs={12} sm={6} md={6} lg={4} key={object.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', minWidth: 300 }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>{object.title}</Typography>
                      {object.latitude && object.longitude && (
                        <Typography variant="body2" color="text.secondary">{object.latitude}, {object.longitude}</Typography>
                      )}
                    </Box>
                  </Stack>
                  <Box sx={{ mt: 'auto' }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                      <Stack direction="row" spacing={1}>
                        {object.latitude && object.longitude && (
                          <IconButton 
                            size="small" 
                            onClick={() => { console.log('Show object on map:', object); }} 
                            color="info"
                          >
                            <MapTrifoldIcon />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => handleEditObject(object)} color="primary"><PencilIcon /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteObject(object)} color="error"><TrashIcon /></IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Object Form */}
      {isObjectFormOpen && (<ObjectFormWithMap open={isObjectFormOpen} onClose={handleCloseObjectForm} item={editingObject} service={selectedService} city={selectedCity} />)}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Delete Object</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{objectToDelete?.title}"? This action cannot be undone and will also delete all associated addresses.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
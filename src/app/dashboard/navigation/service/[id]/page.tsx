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
import { DialogActions } from '@mui/material';
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
import { PlusIcon, ArrowLeftIcon, PencilIcon, TrashIcon, AddressBookIcon } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import { useNavigation } from '@/hooks/use-navigation';
import { ObjectFormWithMap } from '@/components/dashboard/navigation/object-form-with-map';
import { AddressForm } from '@/components/dashboard/navigation/address-form';

interface ServicePageProps {
  params: Promise<{ id: string }>;
}

export default function ServicePage({ params }: ServicePageProps): React.JSX.Element {
  const resolvedParams = React.use(params);
  const { cities, services, objects, addresses, deleteObject, deleteAddress, getObjectByServices } = useNavigation();
  const [isObjectFormOpen, setIsObjectFormOpen] = React.useState(false);
  const [editingObject, setEditingObject] = React.useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [objectToDelete, setObjectToDelete] = React.useState<any>(null);
  const [selectedObject, setSelectedObject] = React.useState<any>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<any>(null);
  const [addressDeleteDialogOpen, setAddressDeleteDialogOpen] = React.useState(false);
  const [addressToDelete, setAddressToDelete] = React.useState<any>(null);
  const [serviceObject, setServiceObjects] = React.useState<any[]>([]);

  const selectedService = serviceObject.find(service => service.id === parseInt(resolvedParams.id));
  const selectedCity = cities.find(city => city.id === selectedService?.cityId);
  const serviceObjects = objects.filter(obj => obj.serviceId === parseInt(resolvedParams.id));

  React.useEffect(() => {
    if (resolvedParams.id) {
      getObjectByServices(resolvedParams.id)
        .then((data: any) => setServiceObjects(data))
        .catch(console.error);
    }
  }, [resolvedParams.id, getObjectByServices]);

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
      hotel: 'Отель',
      restaurant: 'Ресторан',
      attraction: 'Достопримечательность',
      transport: 'Транспорт',
      entertainment: 'Развлечения',
      shopping: 'Шоппинг',
      medical: 'Медицина',
      other: 'Другое'
    };
    return typeMap[type] || type;
  };

  const getServiceTypeColor = (type: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'default'> = {
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
        <Typography variant="h4">Сервис не найден</Typography>
      </Container>
    );
  }

  // Показать адреса для выбранного объекта
  if (selectedObject) {
    const objectAddresses = addresses.filter(addr => addr.objectId === selectedObject.id);

    return (
      <Container maxWidth="xl">
        {/* Шапка с кнопкой Назад, названием объекта и кнопкой Добавить адрес */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton onClick={handleBackToObjects}><ArrowLeftIcon /></IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">{selectedObject.title}</Typography>
            <Typography variant="body1" color="text.secondary">в {selectedService.title} ({selectedCity.name})</Typography>
            {selectedObject.latitude && selectedObject.longitude && (
              <Typography variant="body2" color="text.secondary">Координаты: {selectedObject.latitude}, {selectedObject.longitude}</Typography>
            )}
          </Box>
          <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateAddress}>Добавить адрес</Button>
        </Stack>

        {/* Таблица адресов */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Адреса ({objectAddresses.length})</Typography>
            {objectAddresses.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Название</TableCell>
                      <TableCell>Действия</TableCell>
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
                <Typography variant="body1" color="text.secondary">Адресов пока нет. Нажмите "Добавить адрес" чтобы создать.</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Форма адреса */}
        {isAddressFormOpen && (<AddressForm open={isAddressFormOpen} onClose={handleCloseAddressForm} item={editingAddress} object={selectedObject} service={selectedService} city={selectedCity} />)}

        {/* Диалог подтверждения удаления адреса */}
        <Dialog open={addressDeleteDialogOpen} onClose={handleCancelAddressDelete}>
          <DialogTitle>Удалить адрес</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы уверены, что хотите удалить адрес "{addressToDelete?.title}"? Это действие нельзя отменить.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelAddressDelete}>Отмена</Button>
            <Button onClick={handleConfirmAddressDelete} color="error" variant="contained">Удалить</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  // Показать сетку объектов
  return (
    <Container maxWidth="xl">
      {/* Шапка с кнопкой Назад, названием сервиса и кнопкой Добавить объект */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Link href={`/dashboard/navigation/city/${selectedCity.id}`} passHref>
          <IconButton><ArrowLeftIcon /></IconButton>
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">{selectedService.title || `Услуги ${selectedService.type}`}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body1" color="text.secondary">в {selectedCity.name}</Typography>
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
        <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateObject}>Добавить объект</Button>
      </Stack>

      {/* Сетка объектов */}
      <Grid container spacing={3}>
        {serviceObjects.map((object) => {
          const objectAddresses = addresses.filter(addr => addr.objectId === object.id);
          return (
            <Grid
              size={{ xs: 12, sm: 6, md: 6, lg: 4 }}
              key={object.id}
              component="div"
            >
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

      {/* Форма объекта */}
      {isObjectFormOpen && (<ObjectFormWithMap open={isObjectFormOpen} onClose={handleCloseObjectForm} item={editingObject} service={selectedService} city={selectedCity} />)}

      {/* Диалог подтверждения удаления объекта */}
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Удалить объект</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить объект "{objectToDelete?.title}"? Это действие нельзя отменить и приведёт к удалению всех связанных адресов.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

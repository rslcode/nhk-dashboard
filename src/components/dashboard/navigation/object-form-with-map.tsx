'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { MapPinIcon, MapTrifoldIcon } from '@phosphor-icons/react/dist/ssr';

import { useNavigation } from '@/hooks/use-navigation';
import { MapView } from './map-view';

interface ObjectFormWithMapProps {
  open: boolean;
  onClose: () => void;
  item?: any;
  service: any;
  city: any;
}

export function ObjectFormWithMap({ open, onClose, item, service, city }: ObjectFormWithMapProps): React.JSX.Element {
  const { createObject, updateObject } = useNavigation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showMap, setShowMap] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    latitude: '',
    longitude: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        latitude: item.latitude?.toString() || '',
        longitude: item.longitude?.toString() || '',
      });
    } else {
      setFormData({
        title: '',
        latitude: '',
        longitude: '',
      });
    }
    setErrors({});
  }, [item, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Object title is required';
    }

    if (formData.title.length > 255) {
      newErrors.title = 'Object title must be less than 255 characters';
    }

    if (formData.latitude) {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Latitude must be between -90 and 90';
      }
    }

    if (formData.longitude) {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Longitude must be between -180 and 180';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        serviceId: service.id,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      };

      if (item) {
        await updateObject(item.id, submitData);
      } else {
        await createObject(submitData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving object:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map location selected:', lat, lng);
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));
  };

  const handleShowMap = () => {
    console.log('Opening map dialog...');
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  const handleSaveLocation = () => {
    const lat = formData.latitude ? parseFloat(formData.latitude) : latitude;
    const lng = formData.longitude ? parseFloat(formData.longitude) : longitude;
    handleMapClick(lat, lng);
    handleCloseMap();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {item ? 'Edit Object' : 'Create New Object'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            in {service?.title} ({city?.name})
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Object Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title || 'Enter the object title (e.g., hotel name, restaurant name)'}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  error={!!errors.latitude}
                  helperText={errors.latitude || 'Latitude coordinate (optional)'}
                  type="number"
                  inputProps={{ step: 'any' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  error={!!errors.longitude}
                  helperText={errors.longitude || 'Longitude coordinate (optional)'}
                  type="number"
                  inputProps={{ step: 'any' }}
                />
              </Grid>
            </Grid>

            <Card variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <MapTrifoldIcon size={24} />
                  <Typography variant="h6">
                    Map Location
                  </Typography>
                </Stack>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Click on the map to set the exact location for this object. 
                  This will help users find the object on the map.
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<MapPinIcon />}
                  onClick={handleShowMap}
                  fullWidth
                >
                  {formData.latitude && formData.longitude 
                    ? 'Change Location on Map' 
                    : 'Set Location on Map'
                  }
                </Button>

                {formData.latitude && formData.longitude && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Current coordinates: {formData.latitude}, {formData.longitude}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Object Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This object will be displayed on the map when users browse this service. 
                Coordinates are optional but recommended for map display.
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (item ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </form>

      {/* Map Dialog */}
      <Dialog
        open={showMap}
        onClose={handleCloseMap}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '80vh',
          }
        }}
      >
        <DialogTitle>
          Select Location on Map
        </DialogTitle>
        <DialogContent sx={{ p: 0, flex: 1 }}>
          <Box sx={{ height: '100%', width: '100%', minHeight: 400 }}>
            <MapView
              latitude={formData.latitude ? parseFloat(formData.latitude) : 41.7151}
              longitude={formData.longitude ? parseFloat(formData.longitude) : 44.8271}
              title={formData.title || 'Select Location'}
              onLocationSelect={handleMapClick}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMap}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveLocation}
            variant="contained"
            color="primary"
          >
            Save Location
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
} 
'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { useCarousel } from '@/hooks/use-carousel';

interface CarouselFormProps {
  open: boolean;
  onClose: () => void;
  item?: any;
}

export function CarouselForm({ open, onClose, item }: CarouselFormProps): React.JSX.Element {
  const { createItem, updateItem } = useCarousel();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    link: '',
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = React.useState<string>('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Function to get placeholder image for existing items
  const getPlaceholderImage = (id: number) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'];
    const color = colors[id % colors.length];
    // Create a simple SVG placeholder
    const svg = `
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="${color}"/>
        <text x="150" y="110" font-family="Arial" font-size="16" fill="white" text-anchor="middle">Carousel Image ${id}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        link: item.link || '',
        image: null,
      });
      setPreviewUrl(getPlaceholderImage(item.id));
    } else {
      setFormData({
        title: '',
        link: '',
        image: null,
      });
      setPreviewUrl('');
    }
    setErrors({});
  }, [item, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!item && !formData.image) {
      newErrors.image = 'Image is required';
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (item) {
        await updateItem(item.id, formData);
      } else {
        await createItem(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving carousel item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {item ? 'Edit Carousel Item' : 'Create New Carousel Item'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />

            <TextField
              fullWidth
              label="Link (optional)"
              value={formData.link}
              onChange={(e) => handleInputChange('link', e.target.value)}
              error={!!errors.link}
              helperText={errors.link || 'Enter a URL to link this carousel item'}
              placeholder="https://example.com"
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Image {!item && '*'}
              </Typography>
              
              {previewUrl && (
                <Card sx={{ mb: 2, maxWidth: 300 }}>
                  <CardMedia
                    component="img"
                    image={previewUrl}
                    alt="Preview"
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: null }));
                        setPreviewUrl('');
                      }}
                    >
                      <XIcon />
                    </IconButton>
                  </Box>
                </Card>
              )}

              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{ height: 56 }}
              >
                {previewUrl ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              
              {errors.image && (
                <FormHelperText error>{errors.image}</FormHelperText>
              )}
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
    </Dialog>
  );
} 
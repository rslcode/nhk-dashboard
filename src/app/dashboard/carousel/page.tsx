'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CarouselList } from '@/components/dashboard/carousel/carousel-list';
import { CarouselForm } from '@/components/dashboard/carousel/carousel-form';

export default function CarouselPage(): React.JSX.Element {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h4">Управление каруселью</Typography>
          <Typography color="text.secondary" variant="body1">
            Управляйте элементами карусели для вашего сайта
          </Typography>
        </div>
        <Button
          startIcon={<PlusIcon />}
          onClick={handleCreate}
          variant="contained"
        >
          Добавить элемент карусели
        </Button>
      </Stack>

      <Card>
        <CardHeader title="Элементы карусели" />
        <CardContent>
          <CarouselList onEdit={handleEdit} />
        </CardContent>
      </Card>

      {isFormOpen && (
        <CarouselForm
          open={isFormOpen}
          onClose={handleCloseForm}
          item={editingItem}
        />
      )}
    </Stack>
  );
} 
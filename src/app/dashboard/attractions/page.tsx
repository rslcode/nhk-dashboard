'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { AttractionsList } from '@/components/dashboard/attractions/attractions-list';
import { AttractionsForm } from '@/components/dashboard/attractions/attractions-form';

export default function AttractionsPage(): React.JSX.Element {
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
          <Typography variant="h4">Управление достопримечательностями</Typography>
          <Typography color="text.secondary" variant="body1">
            Управляйте достопримечательностями и интересными местами
          </Typography>
        </div>
        <Button
          startIcon={<PlusIcon />}
          onClick={handleCreate}
          variant="contained"
        >
          Добавить достопримечательность
        </Button>
      </Stack>

      <Card>
        <CardHeader title="Достопримечательности" />
        <CardContent>
          <AttractionsList onEdit={handleEdit} />
        </CardContent>
      </Card>

      {isFormOpen && (
        <AttractionsForm
          open={isFormOpen}
          onClose={handleCloseForm}
          item={editingItem}
        />
      )}
    </Stack>
  );
}

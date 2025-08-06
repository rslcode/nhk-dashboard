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

import { NewsList } from '@/components/dashboard/news/news-list';
import { NewsForm } from '@/components/dashboard/news/news-form';

export default function NewsPage(): React.JSX.Element {
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
          <Typography variant="h4">Управление новостями</Typography>
          <Typography color="text.secondary" variant="body1">
            Управляйте новостными статьями для вашего сайта
          </Typography>
        </div>
        <Button
          startIcon={<PlusIcon />}
          onClick={handleCreate}
          variant="contained"
        >
          Добавить новость
        </Button>
      </Stack>

      <Card>
        <CardHeader title="Новостные статьи" />
        <CardContent>
          <NewsList onEdit={handleEdit} />
        </CardContent>
      </Card>

      {isFormOpen && (
        <NewsForm
          open={isFormOpen}
          onClose={handleCloseForm}
          item={editingItem}
        />
      )}
    </Stack>
  );
} 
'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { usersApi } from '@/lib/users-api';
import { toast } from 'react-hot-toast';



export function AccountDetailsForm(): React.JSX.Element {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await usersApi.findMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast.error('Failed to load user data.');
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedData: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      updatedData[key] = value as string;
    });

    try {
      await usersApi.update(updatedData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update profile.');
    }
  };

  if (!user) {
    return <></>; // Or a loading spinner
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Информацию можно редактировать" title="Профиль" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              size={{
                xs: 12,
              }}
            >
              <FormControl fullWidth required>
                <InputLabel>Имя</InputLabel>
                <OutlinedInput defaultValue={user.firstName} label="Имя" name="firstName" />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth required>
                <InputLabel>Фамилия</InputLabel>
                <OutlinedInput defaultValue={user.lastName} label="Фамилия" name="lastName" />
              </FormControl>
            </Grid>
            
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Телефон</InputLabel>
                <OutlinedInput defaultValue={user.phone || ''} label="Телефон" name="phone" type="tel" />
              </FormControl>
            </Grid>

            
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">Сохранить</Button>
        </CardActions>
      </Card>
    </form>
  );
}

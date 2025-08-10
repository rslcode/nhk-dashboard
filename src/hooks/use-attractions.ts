'use client';

import * as React from 'react';
import { attractionsApi } from '@/lib/attractions-api';

interface AttractionItem {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAttractionData {
  title: string;
  description: string;
  location: string;
  category: string;
  image?: File;
}

interface UpdateAttractionData {
  title?: string;
  description?: string;
  location?: string;
  category?: string;
  image?: File;
}

export function useAttractions() {
  const [items, setItems] = React.useState<AttractionItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: any = await attractionsApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attractions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = React.useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItem = await attractionsApi.create(data);
      setItems((prev: any) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create attraction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = React.useCallback(async (id: number, data: UpdateAttractionData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await attractionsApi.update(id, data);
      setItems((prev: any) => prev.map((item: any) => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update attraction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await attractionsApi.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete attraction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const item = await attractionsApi.getById(id);
      return item;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attraction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    isLoading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    getItem,
  };
}

'use client';

import * as React from 'react';
import { newsApi } from '@/lib/news-api';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  image?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateNewsData {
  title: string;
  description: string;
  content: string;
  image?: File;
  isPublished: boolean;
}

interface UpdateNewsData {
  title?: string;
  description?: string;
  content?: string;
  image?: File;
  isPublished?: boolean;
}

export function useNews() {
  const [items, setItems] = React.useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchItems = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: any = await newsApi.getAll();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить новостные статьи.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = React.useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newItem = await newsApi.create(data);
      setItems((prev: any) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create news article');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateItem = React.useCallback(async (id: number, data: UpdateNewsData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem = await newsApi.update(id, data);
      setItems((prev: any) => prev.map((item: any) => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update news article');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await newsApi.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete news article');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getItem = React.useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const item = await newsApi.getById(id);
      return item;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить новостные статьи.');
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

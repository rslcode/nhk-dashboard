"use client";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { useAttractions } from "@/hooks/use-attractions";

interface AttractionsFormProps {
  open: boolean;
  onClose: () => void;
  item?: any | null;
}

export function AttractionsForm({ open, onClose, item }: AttractionsFormProps): React.JSX.Element {
  const { createItem, updateItem } = useAttractions();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    cover: File | null;
    coverUrl: string;
    title: string;
    description: string;
    additionalInformation: string;
  }>({
    cover: null,
    coverUrl: "",
    title: "",
    description: "",
    additionalInformation: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (item) {
      setFormData({
        cover: null,
        coverUrl: item.cover ? item.cover : "",
        title: item.title || "",
        description: item.description || "",
        additionalInformation: item.additionalInformation || "",
      });
    } else {
      setFormData({
        cover: null,
        coverUrl: "",
        title: "",
        description: "",
        additionalInformation: "",
      });
    }
    setErrors({});
  }, [item, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, cover: file, coverUrl: url }));
      if (errors.cover) {
        setErrors((prev) => ({ ...prev, cover: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cover && !formData.coverUrl) {
      newErrors.cover = "Изображение обложки обязательно";
    } else if (formData.coverUrl && formData.coverUrl.length > 500) {
      newErrors.cover = "URL изображения не должен превышать 500 символов";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Название обязательно";
    } else if (formData.title.length > 255) {
      newErrors.title = "Название должно быть менее 255 символов";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      title: formData.title,
      description: formData.description,
      additionalInformation: formData.additionalInformation,
      cover: formData.cover || formData.coverUrl,
    };

    setIsSubmitting(true);
    try {
      if (item) {
        await updateItem(item.id, submitData);
      } else {
        await createItem(submitData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving attraction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {item ? "Редактировать достопримечательность" : "Создать новую достопримечательность"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Название"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />

            <TextField
              fullWidth
              label="Описание"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              required
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              label="Дополнительная информация"
              value={formData.additionalInformation}
              onChange={(e) => handleInputChange("additionalInformation", e.target.value)}
              error={!!errors.additionalInformation}
              helperText={errors.additionalInformation}
              multiline
              rows={2}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Обложка достопримечательности *
              </Typography>
              {formData.coverUrl && (
                <Card sx={{ mb: 2, maxWidth: 300 }}>
                  <CardMedia
                    component="img"
                    image={formData.coverUrl}
                    alt="Preview"
                    sx={{ height: 200, objectFit: "cover" }}
                  />
                  <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, cover: null, coverUrl: "" }));
                      }}
                    >
                      <XIcon />
                    </IconButton>
                  </Box>
                </Card>
              )}
              <Button component="label" variant="outlined" fullWidth sx={{ height: 56 }}>
                {formData.coverUrl ? "Изменить изображение" : "Загрузить изображение"}
                <input type="file" hidden accept="image/*" onChange={handleCoverChange} />
              </Button>
              {errors.cover && <FormHelperText error>{errors.cover}</FormHelperText>}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Сохранение..." : item ? "Обновить" : "Создать"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

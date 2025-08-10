"use client";

import * as React from "react";
import { DialogActions } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";

import { useCarousel } from "@/hooks/use-carousel";

interface CarouselFormProps {
  open: boolean;
  onClose: () => void;
  item?: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export function CarouselForm({ open, onClose, item }: CarouselFormProps): React.JSX.Element {
  const { createItem, updateItem } = useCarousel();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    link: "",
    photo: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        link: item.link || "",
        photo: null, // We keep this null and handle the existing photo separately
      });

      // If editing an existing item with an photo, show it
      if (item.photo) {
        const filename = item.photo.split("/").pop();
        setPreviewUrl(`${API_BASE_URL}/carousel/photo/${filename}`);
      }
    } else {
      // Reset form for new item
      setFormData({
        title: "",
        link: "",
        photo: null,
      });
      setPreviewUrl("");
    }
    setErrors({});
  }, [item, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (errors.photo) {
        setErrors((prev) => ({ ...prev, photo: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Заголовок обязателен";
    }

    // Only require photo for new items, not when updating (unless removing existing photo)
    if (!item && !formData.photo) {
      newErrors.photo = "Фотография обязательна";
    }

    if (formData.link && !isValidUrl(formData.link)) {
      newErrors.link = "Пожалуйста, введите корректный URL";
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
      const dataToSend: any = {
        title: formData.title,
        link: formData.link || undefined,
        photo: formData.photo,
      };

      if (item) {
        await updateItem(item.id, dataToSend);
      } else {
        await createItem(dataToSend);
      }
      onClose();
    } catch (error) {
      console.error("Error saving carousel item:", error);
      setErrors({
        submit: "Произошла ошибка при сохранении. Пожалуйста, попробуйте снова.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
    setPreviewUrl("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{item ? "Редактировать элемент карусели" : "Создать новый элемент карусели"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Заголовок"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />

            <TextField
              fullWidth
              label="Ссылка (необязательно)"
              value={formData.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
              error={!!errors.link}
              helperText={errors.link || "Введите URL для ссылки этого элемента карусели"}
              placeholder="https://example.com"
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Фотография {!item && "*"}
                {item?.photo && !formData.photo && (
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    (Текущая фотография)
                  </Typography>
                )}
              </Typography>

              {previewUrl && (
                <Card sx={{ mb: 2, maxWidth: 300, position: "relative" }}>
                  <CardMedia
                    component="img"
                    image={previewUrl}
                    alt="Preview"
                    sx={{ height: 200, objectFit: "cover" }}
                  />
                  <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                    <IconButton
                      size="small"
                      onClick={handleRemovePhoto}
                      sx={{ backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}
                    >
                      <XIcon />
                    </IconButton>
                  </Box>
                </Card>
              )}

              <Button component="label" variant="outlined" fullWidth sx={{ height: 56 }}>
                {previewUrl ? "Заменить фотографию" : "Загрузить фотографию"}
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              </Button>

              {errors.photo && <FormHelperText error>{errors.photo}</FormHelperText>}
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
        {errors.submit && (
          <Typography color="error" variant="body2" sx={{ px: 3, pb: 2 }}>
            {errors.submit}
          </Typography>
        )}
      </form>
    </Dialog>
  );
}

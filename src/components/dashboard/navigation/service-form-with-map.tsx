"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { useNavigation } from "@/hooks/use-navigation";

interface ServiceFormWithMapProps {
	open: boolean;
	onClose: () => void;
	item?: any;
	city: any;
}

export function ServiceFormWithMap({ open, onClose, item, city }: ServiceFormWithMapProps): React.JSX.Element {
	const { createService, updateService } = useNavigation();
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const [formData, setFormData] = React.useState({
		type: "",
	});
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	const serviceTypes = [
		{ value: "hotel", label: "Hotel - Отели и гостиницы" },
		{ value: "restaurant", label: "Restaurant - Рестораны и кафе" },
		{ value: "attraction", label: "Attraction - Достопримечательности" },
		{ value: "transport", label: "Transport - Транспортные услуги" },
		{ value: "entertainment", label: "Entertainment - Развлечения" },
		{ value: "shopping", label: "Shopping - Магазины" },
		{ value: "medical", label: "Medical - Медицинские услуги" },
		{ value: "other", label: "Other - Другие услуги" },
	];

	React.useEffect(() => {
		if (item) {
			setFormData({
				type: item.type || "",
			});
		} else {
			setFormData({
				type: "",
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

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.type) {
			newErrors.type = "Service type is required";
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
			const selectedType = serviceTypes.find((type) => type.value === formData.type);
			const submitData = {
				...formData,
				title: selectedType ? selectedType.label.split(" - ")[1] || selectedType.label : "Service",
				description: `Services of type ${formData.type}`,
				cityId: city.id,
			};

			if (item) {
				// При редактировании тоже обновляем название и описание на основе типа
				await updateService(item.id, submitData);
			} else {
				await createService(submitData);
			}
			onClose();
		} catch (error) {
			console.error("Error saving service:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{item ? "Изменить услугу" : "Создать новую услугу"}</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
						в {city?.name}
					</Typography>
					<Stack spacing={3}>
						<FormControl fullWidth error={!!errors.type}>
							<InputLabel>Тип обслуживания</InputLabel>
							<Select
								value={formData.type}
								label="Service Type"
								onChange={(e) => handleInputChange("type", e.target.value)}
								required
							>
								{serviceTypes.map((type) => (
									<MenuItem key={type.value} value={type.value}>
										{type.label}
									</MenuItem>
								))}
							</Select>
							{errors.type && <FormHelperText>{errors.type}</FormHelperText>}
						</FormControl>

						<Box>
							<Typography variant="subtitle2" color="text.secondary" gutterBottom>
								Информация об обслуживании
							</Typography>
							<Typography variant="body2" color="text.secondary">
								После создания сервиса вы можете добавить в него отдельные объекты, такие как отели, рестораны и
								достопримечательности. Для удобства навигации каждый объект может иметь своё местоположение на карте.
							</Typography>
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

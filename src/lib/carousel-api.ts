// import { API } from "@/lib/api";
//
// const API_BASE_URL = "http://localhost:3000/carousel";
//
// interface CarouselItem {
// 	id: number;
// 	title: string;
// 	link?: string;
// 	image: string;
// 	createdAt: string;
// 	updatedAt: string;
// }
//
// interface CreateCarouselData {
// 	title: string;
// 	link?: string;
// 	image: File;
// }
//
// interface UpdateCarouselData {
// 	title?: string;
// 	link?: string;
// 	image?: File;
// }
//
// class CarouselApiError extends Error {
// 	constructor(
// 		message: string,
// 		public status?: number
// 	) {
// 		super(message);
// 		this.name = "CarouselApiError";
// 	}
// }
//
// export const carouselApi = {
// 	async getAll() {
// 		try {
// 			const { data } = await API.get("/carousel");
// 			console.log(data);
// 			return data;
// 		} catch (error) {
// 			console.error("Error fetching carousel data:", error);
// 			throw error;
// 		}
// 	},
//
// 	async getById(id: number): Promise<CarouselItem> {
// 		await new Promise((resolve) => setTimeout(resolve, 300));
//
// 		const mockItems = [
// 			{
// 				id: 1,
// 				title: "Welcome to Jerusalem",
// 				link: "https://example.com",
// 				image: "/uploads/carousel/1753628804371-986953480.jpg",
// 				createdAt: "2024-01-01T00:00:00.000Z",
// 				updatedAt: "2024-01-01T00:00:00.000Z",
// 			},
// 			{
// 				id: 2,
// 				title: "Beautiful City Views",
// 				link: "https://example.com/views",
// 				image: "/uploads/carousel/1753628804371-123456789.jpg",
// 				createdAt: "2024-01-02T00:00:00.000Z",
// 				updatedAt: "2024-01-02T00:00:00.000Z",
// 			},
// 		];
//
// 		const item = mockItems.find((item) => item.id === id);
// 		if (!item) {
// 			throw new CarouselApiError("Carousel item not found", 404);
// 		}
//
// 		return item;
// 	},
//
// 	async create(dataCarousel: { image: File; title: string; link: string }) {
// 		const formData = new FormData();
//
// 		formData.append("title", dataCarousel.title);
// 		formData.append("link", dataCarousel.link);
//
// 		if (dataCarousel.image) {
// 			formData.append("image", dataCarousel.image);
// 		}
//
// 		try {
// 			const { data } = await API.post("/carousel", formData, {
// 				headers: {
// 					"Content-Type": "multipart/form-data",
// 				},
// 			});
//
// 			console.log("Carousel created:", data);
// 			return data;
// 		} catch (error) {
// 			console.error("Error creating carousel:", error);
// 			throw error;
// 		}
// 	},
//
// 	async update(id: number, data: UpdateCarouselData): Promise<CarouselItem> {
// 		await new Promise((resolve) => setTimeout(resolve, 1000));
//
// 		const updatedItem: CarouselItem = {
// 			id,
// 			title: data.title || "Updated Title",
// 			link: data.link,
// 			image: data.image
// 				? `/uploads/carousel/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
// 				: "/uploads/carousel/1753628804371-986953480.jpg",
// 			createdAt: "2024-01-01T00:00:00.000Z",
// 			updatedAt: new Date().toISOString(),
// 		};
//
// 		console.log("Carousel updated:", updatedItem);
//
// 		return updatedItem;
// 	},
//
// 	async delete(id: number): Promise<{ message: string }> {
// 		await new Promise((resolve) => setTimeout(resolve, 500));
// 		return { message: "Carousel item deleted successfully" };
// 	},
// };
import { API } from "@/lib/api";

interface CarouselItem {
	id: number;
	title: string;
	link?: string;
	image: string;
	createdAt: string;
	updatedAt: string;
}

interface CreateCarouselData {
	title: string;
	link?: string;
	image: File;
}

interface UpdateCarouselData {
	title?: string;
	link?: string;
	image?: File;
}

class CarouselApiError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message);
		this.name = "CarouselApiError";
	}
}

export const carouselApi = {
	async getAll(): Promise<CarouselItem[]> {
		try {
			const { data } = await API.get("/carousel");
			return data;
		} catch (error) {
			console.error("Error fetching carousel data:", error);
			throw new CarouselApiError("Failed to fetch carousel items", 500);
		}
	},

	async getById(id: number): Promise<CarouselItem> {
		try {
			const { data } = await API.get(`/carousel/${id}`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new CarouselApiError("Carousel item not found", 404);
			}
			console.error(`Error fetching carousel item with id ${id}:`, error);
			throw new CarouselApiError("Failed to fetch carousel item", 500);
		}
	},

	async create(dataCarousel: CreateCarouselData): Promise<CarouselItem> {
		const formData = new FormData();
		formData.append("title", dataCarousel.title);

		if (dataCarousel.link) {
			formData.append("link", dataCarousel.link);
		}

		if (dataCarousel.image) {
			formData.append("image", dataCarousel.image);
		}

		try {
			const { data } = await API.post("/carousel", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error) {
			console.error("Error creating carousel:", error);
			throw new CarouselApiError("Failed to create carousel item", 500);
		}
	},

	async update(
		id: number,
		updateData: UpdateCarouselData
	): Promise<CarouselItem> {
		const formData = new FormData();

		if (updateData.title) {
			formData.append("title", updateData.title);
		}

		if (updateData.link) {
			formData.append("link", updateData.link);
		}

		if (updateData.image) {
			formData.append("image", updateData.image);
		}

		try {
			const { data } = await API.patch(`/carousel/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new CarouselApiError("Carousel item not found", 404);
			}
			console.error(`Error updating carousel item with id ${id}:`, error);
			throw new CarouselApiError("Failed to update carousel item", 500);
		}
	},

	async delete(id: number): Promise<{ message: string }> {
		try {
			await API.delete(`/carousel/${id}`);
			return { message: "Carousel item deleted successfully" };
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new CarouselApiError("Carousel item not found", 404);
			}
			console.error(`Error deleting carousel item with id ${id}:`, error);
			throw new CarouselApiError("Failed to delete carousel item", 500);
		}
	},

	getImageUrl(filename: string): string {
		return `${API.defaults.baseURL}/carousel/image/${filename}`;
	},
};

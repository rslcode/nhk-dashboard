import { API } from "@/lib/api";





interface AttractionItem {
	id: number;
	title: string;
	description: string;
	cover: string;
	additionalInformation?: string;
	location?: string;
	category?: string;
	createdAt: string;
	updatedAt: string;
}

interface CreateAttractionData {
	title: string;
	description: string;
	cover: File | string;
	additionalInformation?: string;
}

interface UpdateAttractionData {
	title?: string;
	description?: string;
	cover?: File | string;
	additionalInformation?: string;
}

class AttractionsApiError extends Error {
	constructor(
		message: string,
		public status?: number
	) {
		super(message);
		this.name = "AttractionsApiError";
	}
}

export const attractionsApi = {
	async getAll(): Promise<AttractionItem[]> {
		try {
			const { data } = await API.get("/attractions");
			return data;
		} catch (error) {
			console.error("Error fetching attractions:", error);
			throw new AttractionsApiError("Failed to fetch attractions", 500);
		}
	},

	async getById(id: number): Promise<AttractionItem> {
		try {
			const { data } = await API.get(`/attractions/${id}`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new AttractionsApiError("Attraction not found", 404);
			}
			console.error(`Error fetching attraction with id ${id}:`, error);
			throw new AttractionsApiError("Failed to fetch attraction", 500);
		}
	},

	async create(data: CreateAttractionData): Promise<AttractionItem> {
    console.log(data);
		try {
			const { data: responseData } = await API.post("/attractions", { ...data, cover: 'https://images.unsplash.com/photo-1495020689067-958852a7765e' });
			return responseData;
		} catch (error) {
			console.error("Error creating attraction:", error);
			throw new AttractionsApiError("Failed to create attraction", 500);
		}
	},

	async update(id: number, data: UpdateAttractionData): Promise<AttractionItem> {
		try {
			const { data: responseData } = await API.patch(`/attractions/${id}`, { ...data, cover: 'https://images.unsplash.com/photo-1495020689067-958852a7765e' });
			return responseData;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new AttractionsApiError("Attraction not found", 404);
			}
			console.error(`Error updating attraction with id ${id}:`, error);
			throw new AttractionsApiError("Failed to update attraction", 500);
		}
	},

	async delete(id: number): Promise<{ message: string }> {
		try {
			const { data } = await API.delete(`/attractions/${id}`);
			return data;
		} catch (error: any) {
			if (error.response?.status === 404) {
				throw new AttractionsApiError("Attraction not found", 404);
			}
			console.error(`Error deleting attraction with id ${id}:`, error);
			throw new AttractionsApiError("Failed to delete attraction", 500);
		}
	},
};

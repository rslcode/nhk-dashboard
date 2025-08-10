import { API } from "@/lib/api";





interface NewsItem {
  id: number;
  title: string;
  description: string;
  additionalInformation?: string;
  cover: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateNewsData {
  title: string;
  description: string;
  additionalInformation?: string;
  cover: string; // URL string, not File
}

interface UpdateNewsData {
  title?: string;
  description?: string;
  additionalInformation?: string;
  cover?: string; // URL string, not File
}

class NewsApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "NewsApiError";
  }
}

export const newsApi = {
  async getAll(): Promise<NewsItem[]> {
    try {
      const { data } = await API.get("/news");
      console.log(data,'news');
      return data;
    } catch (error) {
      console.error("Error fetching news data:", error);
      throw new NewsApiError("Failed to fetch news items", 500);
    }
  },

  async getById(id: number): Promise<NewsItem> {
    try {
      const { data } = await API.get(`/news/${id}`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NewsApiError("News item not found", 404);
      }
      console.error(`Error fetching news item with id ${id}:`, error);
      throw new NewsApiError("Failed to fetch news item", 500);
    }
  },

  async create(newsData: CreateNewsData): Promise<NewsItem> {
    try {
      const { data } = await API.post("/news", { ...newsData, cover: 'https://images.unsplash.com/photo-1495020689067-958852a7765e' });
      return data;
    } catch (error: any) {
      console.error("Error creating news:", error);
      if (error.response?.status === 400) {
        throw new NewsApiError("Invalid news data", 400);
      }
      throw new NewsApiError("Failed to create news item", 500);
    }
  },

  async update(id: number, newsData: UpdateNewsData): Promise<NewsItem> {
    try {
      const { data } = await API.patch(`/news/${id}`, { ...newsData, cover: 'https://images.unsplash.com/photo-1495020689067-958852a7765e' });

      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NewsApiError("News item not found", 404);
      }
      console.error(`Error updating news item with id ${id}:`, error);
      throw new NewsApiError("Failed to update news item", 500);
    }
  },

  async delete(id: number): Promise<{ message: string }> {
    try {
      const { data } = await API.delete(`/news/${id}`);
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NewsApiError("News item not found", 404);
      }
      console.error(`Error deleting news item with id ${id}:`, error);
      throw new NewsApiError("Failed to delete news item", 500);
    }
  },
};

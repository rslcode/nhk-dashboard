const API_BASE_URL = 'http://localhost:3000/carousel';

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
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'CarouselApiError';
  }
}

// Mock implementation for development/demo purposes
// This simulates the API without making real HTTP requests
export const carouselApi = {
  async getAll(): Promise<CarouselItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: 1,
        title: "Welcome to Jerusalem",
        link: "https://example.com",
        image: "/uploads/carousel/1753628804371-986953480.jpg",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        title: "Beautiful City Views",
        link: "https://example.com/views",
        image: "/uploads/carousel/1753628804371-123456789.jpg",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 3,
        title: "Historic Landmarks",
        link: "https://example.com/landmarks",
        image: "/uploads/carousel/1753628804371-987654321.jpg",
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      }
    ];
  },

  async getById(id: number): Promise<CarouselItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockItems = [
      {
        id: 1,
        title: "Welcome to Jerusalem",
        link: "https://example.com",
        image: "/uploads/carousel/1753628804371-986953480.jpg",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        title: "Beautiful City Views",
        link: "https://example.com/views",
        image: "/uploads/carousel/1753628804371-123456789.jpg",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      }
    ];
    
    const item = mockItems.find(item => item.id === id);
    if (!item) {
      throw new CarouselApiError('Carousel item not found', 404);
    }
    
    return item;
  },

  async create(data: CreateCarouselData): Promise<CarouselItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItem: CarouselItem = {
      id: Date.now(),
      title: data.title,
      link: data.link,
      image: `/uploads/carousel/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newItem;
  },

  async update(id: number, data: UpdateCarouselData): Promise<CarouselItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedItem: CarouselItem = {
      id,
      title: data.title || "Updated Title",
      link: data.link,
      image: data.image 
        ? `/uploads/carousel/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
        : "/uploads/carousel/1753628804371-986953480.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };
    
    return updatedItem;
  },

  async delete(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "Carousel item deleted successfully" };
  },

  getImageUrl(filename: string): string {
    return `${API_BASE_URL}/image/${filename}`;
  },
}; 
const API_BASE_URL = 'http://localhost:3000/attractions';

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

class AttractionsApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AttractionsApiError';
  }
}

// Mock implementation for development/demo purposes
// This simulates the API without making real HTTP requests
export const attractionsApi = {
  async getAll(): Promise<AttractionItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: 1,
        title: "Стена Плача",
        description: "Священное место для иудеев, расположенное в Старом городе Иерусалима",
        location: "Иерусалим",
        category: "religious",
        image: "/uploads/attractions/western-wall-1.jpg",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        title: "Храм Гроба Господня",
        description: "Один из главных христианских храмов, построенный на месте распятия и воскресения Иисуса Христа",
        location: "Иерусалим",
        category: "religious",
        image: "/uploads/attractions/church-holy-sepulchre-2.jpg",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 3,
        title: "Музей Израиля",
        description: "Крупнейший культурный музей Израиля с богатой коллекцией археологических находок и искусства",
        location: "Иерусалим",
        category: "cultural",
        image: "/uploads/attractions/israel-museum-3.jpg",
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      },
      {
        id: 4,
        title: "Мертвое море",
        description: "Уникальное соленое озеро, известное своими лечебными свойствами и высокой концентрацией соли",
        location: "Иудейская пустыня",
        category: "natural",
        image: "/uploads/attractions/dead-sea-4.jpg",
        createdAt: "2024-01-04T00:00:00.000Z",
        updatedAt: "2024-01-04T00:00:00.000Z"
      },
      {
        id: 5,
        title: "Башня Давида",
        description: "Средневековая крепость, расположенная в Старом городе Иерусалима",
        location: "Иерусалим",
        category: "historical",
        image: "/uploads/attractions/tower-david-5.jpg",
        createdAt: "2024-01-05T00:00:00.000Z",
        updatedAt: "2024-01-05T00:00:00.000Z"
      }
    ];
  },

  async getById(id: number): Promise<AttractionItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockItems = [
      {
        id: 1,
        title: "Стена Плача",
        description: "Священное место для иудеев, расположенное в Старом городе Иерусалима",
        location: "Иерусалим",
        category: "religious",
        image: "/uploads/attractions/western-wall-1.jpg",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        title: "Храм Гроба Господня",
        description: "Один из главных христианских храмов, построенный на месте распятия и воскресения Иисуса Христа",
        location: "Иерусалим",
        category: "religious",
        image: "/uploads/attractions/church-holy-sepulchre-2.jpg",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      }
    ];
    
    const item = mockItems.find(item => item.id === id);
    if (!item) {
      throw new AttractionsApiError('Attraction not found', 404);
    }
    
    return item;
  },

  async create(data: CreateAttractionData): Promise<AttractionItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItem: AttractionItem = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      location: data.location,
      category: data.category,
      image: data.image ? `/uploads/attractions/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg` : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('Attraction created:', newItem);
    
    return newItem;
  },

  async update(id: number, data: UpdateAttractionData): Promise<AttractionItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedItem: AttractionItem = {
      id,
      title: data.title || "Updated Title",
      description: data.description || "Updated Description",
      location: data.location || "Updated Location",
      category: data.category || "other",
      image: data.image 
        ? `/uploads/attractions/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
        : "/uploads/attractions/default-attraction.jpg",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };
    
    console.log('Attraction updated:', updatedItem);
    
    return updatedItem;
  },

  async delete(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "Attraction deleted successfully" };
  },
}; 
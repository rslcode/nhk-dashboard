const API_BASE_URL = 'http://localhost:3000/news';

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

class NewsApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'NewsApiError';
  }
}

// Mock implementation for development/demo purposes
// This simulates the API without making real HTTP requests
export const newsApi = {
  async getAll(): Promise<NewsItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
      {
        id: 1,
        title: "Новая статья о технологиях",
        description: "Обзор последних технологических достижений в 2024 году",
        content: "Полный текст статьи о технологиях. Здесь содержится подробная информация о последних достижениях в области искусственного интеллекта, машинного обучения и других технологических инноваций.",
        image: "/uploads/news/tech-article-1.jpg",
        isPublished: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        title: "Обновления системы безопасности",
        description: "Важные обновления в системе безопасности платформы",
        content: "Мы рады сообщить о важных обновлениях в системе безопасности нашей платформы. Эти изменения направлены на повышение защиты данных пользователей и предотвращение потенциальных угроз.",
        image: "/uploads/news/security-update-2.jpg",
        isPublished: true,
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 3,
        title: "Черновик статьи о будущем",
        description: "Размышления о будущем технологий",
        content: "Это черновик статьи о будущем технологий. Здесь будут содержаться размышления о том, как технологии изменят нашу жизнь в ближайшие десятилетия.",
        image: "/uploads/news/future-tech-3.jpg",
        isPublished: false,
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      }
    ];
  },

  async getById(id: number): Promise<NewsItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockItems = [
      {
        id: 1,
        title: "Новая статья о технологиях",
        description: "Обзор последних технологических достижений в 2024 году",
        content: "Полный текст статьи о технологиях. Здесь содержится подробная информация о последних достижениях в области искусственного интеллекта, машинного обучения и других технологических инноваций.",
        image: "/uploads/news/tech-article-1.jpg",
        isPublished: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        title: "Обновления системы безопасности",
        description: "Важные обновления в системе безопасности платформы",
        content: "Мы рады сообщить о важных обновлениях в системе безопасности нашей платформы. Эти изменения направлены на повышение защиты данных пользователей и предотвращение потенциальных угроз.",
        image: "/uploads/news/security-update-2.jpg",
        isPublished: true,
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      }
    ];
    
    const item = mockItems.find(item => item.id === id);
    if (!item) {
      throw new NewsApiError('News article not found', 404);
    }
    
    return item;
  },

  async create(data: CreateNewsData): Promise<NewsItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItem: NewsItem = {
      id: Date.now(),
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image ? `/uploads/news/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg` : undefined,
      isPublished: data.isPublished,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log('News created:', newItem);
    
    return newItem;
  },

  async update(id: number, data: UpdateNewsData): Promise<NewsItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedItem: NewsItem = {
      id,
      title: data.title || "Updated Title",
      description: data.description || "Updated Description",
      content: data.content || "Updated Content",
      image: data.image 
        ? `/uploads/news/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
        : "/uploads/news/default-article.jpg",
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };
    
    console.log('News updated:', updatedItem);
    
    return updatedItem;
  },

  async delete(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "News article deleted successfully" };
  },
}; 
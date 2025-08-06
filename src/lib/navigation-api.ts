const API_BASE_URL = 'http://localhost:3000';

interface CityItem {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceItem {
  id: number;
  cityId: number;
  title: any;
  description?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface ObjectItem {
  id: number;
  serviceId: number;
  title: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

interface AddressItem {
  id: number;
  objectId: number;
  title: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateCityData {
  name: string;
}

interface UpdateCityData {
  name?: string;
}

interface CreateServiceData {
  cityId: number;
  title?: string;
  description?: string;
  type: string;
}

interface UpdateServiceData {
  title?: string;
  description?: string;
  type?: string;
  cityId?: number;
}

interface CreateObjectData {
  serviceId: number;
  title: string;
  latitude?: number;
  longitude?: number;
}

interface UpdateObjectData {
  title?: string;
  latitude?: number;
  longitude?: number;
  serviceId?: number;
}

interface CreateAddressData {
  objectId: number;
  title: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
}

interface UpdateAddressData {
  title?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  objectId?: number;
}

class NavigationApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'NavigationApiError';
  }
}

// Mock implementation for development/demo purposes
export const navigationApi = {
  // Cities
  async getCities(): Promise<CityItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: 1,
        name: "Тбилиси",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        name: "Батуми",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 3,
        name: "Кутаиси",
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      }
    ];
  },

  async createCity(data: CreateCityData): Promise<CityItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newCity: CityItem = {
      id: Date.now(),
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('City created:', newCity);

    return newCity;
  },

  async updateCity(id: number, data: UpdateCityData): Promise<CityItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedCity: CityItem = {
      id,
      name: data.name || "Updated City",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };

    console.log('City updated:', updatedCity);

    return updatedCity;
  },

  async deleteCity(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "City deleted successfully" };
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: 1,
        cityId: 1,
        title: "Отели и гостиницы",
        description: "Услуги типа отель",
        type: "hotel",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        cityId: 1,
        title: "Рестораны и кафе",
        description: "Услуги типа ресторан",
        type: "restaurant",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 3,
        cityId: 1,
        title: "Достопримечательности",
        description: "Услуги типа достопримечательность",
        type: "attraction",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 4,
        cityId: 2,
        title: "Отели и гостиницы",
        description: "Услуги типа отель",
        type: "hotel",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 5,
        cityId: 2,
        title: "Рестораны и кафе",
        description: "Услуги типа ресторан",
        type: "restaurant",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 6,
        cityId: 3,
        title: "Отели и гостиницы",
        description: "Услуги типа отель",
        type: "hotel",
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      }
    ];

  },

  async createService(data: CreateServiceData): Promise<ServiceItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newService: ServiceItem = {
      id: Date.now(),
      cityId: data.cityId,
      title: data.title,
      description: data.description,
      type: data.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Service created:', newService);

    return newService;
  },

  async updateService(id: number, data: UpdateServiceData): Promise<ServiceItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedService: ServiceItem = {
      id,
      cityId: data.cityId || 1,
      title: data.title || "Updated Service",
      description: data.description,
      type: data.type || "other",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };

    console.log('Service updated:', updatedService);

    return updatedService;
  },

  async deleteService(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "Service deleted successfully" };
  },

  // Objects
  async getObjects(): Promise<ObjectItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: 1,
        serviceId: 1,
        title: "Hilton Tbilisi",
        latitude: 41.7151,
        longitude: 44.8271,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        serviceId: 1,
        title: "Marriott Tbilisi",
        latitude: 41.7200,
        longitude: 44.7800,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 3,
        serviceId: 2,
        title: "Restaurant A",
        latitude: 41.7250,
        longitude: 44.7900,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 4,
        serviceId: 3,
        title: "Old Town",
        latitude: 41.7151,
        longitude: 44.8271,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 5,
        serviceId: 4,
        title: "Sheraton Batumi",
        latitude: 41.6500,
        longitude: 41.6400,
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 6,
        serviceId: 5,
        title: "Restaurant B",
        latitude: 41.6550,
        longitude: 41.6450,
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 7,
        serviceId: 6,
        title: "Hotel Kutaisi",
        latitude: 42.2700,
        longitude: 42.7000,
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      }
    ];
  },

  async createObject(data: CreateObjectData): Promise<ObjectItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newObject: ObjectItem = {
      id: Date.now(),
      serviceId: data.serviceId,
      title: data.title,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Object created:', newObject);

    return newObject;
  },

  async updateObject(id: number, data: UpdateObjectData): Promise<ObjectItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedObject: ObjectItem = {
      id,
      serviceId: data.serviceId || 1,
      title: data.title || "Updated Object",
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };

    console.log('Object updated:', updatedObject);

    return updatedObject;
  },

  async deleteObject(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "Object deleted successfully" };
  },

  // Addresses
  async getAddresses(): Promise<AddressItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        id: 1,
        objectId: 1,
        title: "Главный офис Hilton",
        address: "ул. Тависуплеба, 1, Тбилиси, Грузия",
        phone: "+995 32 123 4567",
        email: "info@hilton-tbilisi.ge",
        website: "https://hilton-tbilisi.ge",
        description: "Главный офис отеля Hilton в центре Тбилиси",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        objectId: 1,
        title: "Филиал Hilton - Аэропорт",
        address: "Тбилисский международный аэропорт, Тбилиси, Грузия",
        phone: "+995 32 123 4568",
        email: "airport@hilton-tbilisi.ge",
        website: "https://hilton-tbilisi-airport.ge",
        description: "Филиал отеля Hilton в аэропорту Тбилиси",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 3,
        objectId: 2,
        title: "Marriott Tbilisi - Центр",
        address: "пр. Руставели, 13, Тбилиси, Грузия",
        phone: "+995 32 234 5678",
        email: "info@marriott-tbilisi.ge",
        website: "https://marriott-tbilisi.ge",
        description: "Отель Marriott в центре Тбилиси на проспекте Руставели",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 4,
        objectId: 3,
        title: "Restaurant A - Старый город",
        address: "ул. Шавтели, 5, Тбилиси, Грузия",
        phone: "+995 32 345 6789",
        email: "info@restaurant-a.ge",
        website: "https://restaurant-a.ge",
        description: "Ресторан в историческом центре Тбилиси",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 5,
        objectId: 5,
        title: "Sheraton Batumi - Набережная",
        address: "ул. Ниношвили, 28, Батуми, Грузия",
        phone: "+995 422 123 456",
        email: "info@sheraton-batumi.ge",
        website: "https://sheraton-batumi.ge",
        description: "Отель Sheraton на набережной Батуми",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      }
    ];
  },

  async createAddress(data: CreateAddressData): Promise<AddressItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAddress: AddressItem = {
      id: Date.now(),
      objectId: data.objectId,
      title: data.title,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Address created:', newAddress);

    return newAddress;
  },

  async updateAddress(id: number, data: UpdateAddressData): Promise<AddressItem> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedAddress: AddressItem = {
      id,
      objectId: data.objectId || 1,
      title: data.title || "Updated Address",
      address: data.address || "Updated Address",
      phone: data.phone,
      email: data.email,
      website: data.website,
      description: data.description,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    };

    console.log('Address updated:', updatedAddress);

    return updatedAddress;
  },

  async deleteAddress(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { message: "Address deleted successfully" };
  },
};

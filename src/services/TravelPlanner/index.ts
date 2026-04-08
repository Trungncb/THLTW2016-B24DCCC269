import { Destination, Itinerary, BudgetItem, BudgetSummary } from '@/models/travelplanner';

// Mock API service for destinations
export const destinationService = {
  async getDestinations(): Promise<Destination[]> {
    return [
      {
        id: '1',
        name: 'Phú Quốc',
        description: 'Beautiful island with pristine beaches',
        type: 'beach',
        location: 'Kiên Giang',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        rating: 4.8,
        price: 2000000,
        estimatedDays: 3,
        currency: 'VND',
        attractions: ['Sunset Sanato', 'Phu Quoc Prison', 'Cable Car'],
        bestSeason: 'November to April',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Hà Giang',
        description: 'Mountain adventure with stunning landscapes',
        type: 'mountain',
        location: 'Hà Giang',
        image:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        rating: 4.6,
        price: 1500000,
        estimatedDays: 4,
        currency: 'VND',
        attractions: ['Đỉnh Mã Pí Lèng', 'Thị trấn Hàm Rồng', 'Hoàng Su Phì'],
        bestSeason: 'September to November',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Hà Nội',
        description: 'Capital city with rich history and culture',
        type: 'city',
        location: 'Hà Nội',
        image:
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500',
        rating: 4.5,
        price: 1000000,
        estimatedDays: 2,
        currency: 'VND',
        attractions: [
          'Hoan Kiem Lake',
          'Old Quarter',
          'Temple of Literature',
        ],
        bestSeason: 'Year-round',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Sapa',
        description: 'Mountain town with terraced rice fields',
        type: 'mountain',
        location: 'Lào Cai',
        image:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
        rating: 4.7,
        price: 1200000,
        estimatedDays: 2,
        currency: 'VND',
        attractions: ['Fansipan', 'Town center', 'Hot spring'],
        bestSeason: 'September to November',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Nha Trang',
        description: 'Coastal city with beautiful beaches',
        type: 'beach',
        location: 'Khánh Hòa',
        image:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
        rating: 4.4,
        price: 1800000,
        estimatedDays: 3,
        currency: 'VND',
        attractions: ['Vinpearl Land', 'Nha Trang Bay', 'Cau Da'],
        bestSeason: 'January to September',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'Mekong Delta',
        description: 'Unique waterways and traditional villages',
        type: 'city',
        location: 'Cần Thơ',
        image:
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500',
        rating: 4.3,
        price: 1300000,
        estimatedDays: 2,
        currency: 'VND',
        attractions: ["Floating market", 'Bat pagoda', 'Orchid farm'],
        bestSeason: 'November to April',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  },

  async getDestinationById(id: string): Promise<Destination | null> {
    const destinations = await this.getDestinations();
    return destinations.find((d) => d.id === id) || null;
  },

  async createDestination(data: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>): Promise<Destination> {
    return {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updateDestination(id: string, data: Partial<Destination>): Promise<Destination> {
    return {
      ...data,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Destination;
  },

  async deleteDestination(id: string): Promise<void> {
    // Mock delete
  },
};

// Mock API service for itineraries
export const itineraryService = {
  async getItineraries(): Promise<Itinerary[]> {
    return [];
  },

  async getItineraryById(id: string): Promise<Itinerary | null> {
    return null;
  },

  async createItinerary(data: Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt'>): Promise<Itinerary> {
    return {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updateItinerary(id: string, data: Partial<Itinerary>): Promise<Itinerary> {
    return {
      ...data,
      id,
    } as Itinerary;
  },

  async deleteItinerary(id: string): Promise<void> {
    // Mock delete
  },
};

// Mock API service for budget
export const budgetService = {
  async getBudgetItems(itineraryId: string): Promise<BudgetItem[]> {
    return [];
  },

  async createBudgetItem(data: Omit<BudgetItem, 'id'>): Promise<BudgetItem> {
    return {
      ...data,
      id: Date.now().toString(),
    };
  },

  async updateBudgetItem(id: string, data: Partial<BudgetItem>): Promise<BudgetItem> {
    return { ...data, id } as BudgetItem;
  },

  async deleteBudgetItem(id: string): Promise<void> {
    // Mock delete
  },

  async getBudgetSummary(itineraryId: string): Promise<BudgetSummary> {
    return {
      itineraryId,
      totalBudget: 10000000,
      spent: 5000000,
      remaining: 5000000,
      byCategory: {
        accommodation: 3000000,
        food: 1000000,
        travel: 500000,
        activities: 500000,
        other: 0,
      },
      currency: 'VND',
    };
  },
};

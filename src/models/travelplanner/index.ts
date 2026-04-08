// Types and interfaces for Travel Planner

export type DestinationType = 'beach' | 'mountain' | 'city';
export type CurrencyType = 'VND' | 'USD' | 'EUR';
export type BudgetCategory = 'accommodation' | 'food' | 'travel' | 'activities' | 'other';

export interface Destination {
  id: string;
  name: string;
  description: string;
  type: DestinationType;
  location: string;
  image: string;
  rating: number; // 1-5
  price: number;
  estimatedDays: number;
  currency: CurrencyType;
  attractions: string[];
  bestSeason: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  destinationId: string;
  activities: string[];
  notes: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destinations: ItineraryDay[];
  budget: number;
  currency: CurrencyType;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  itineraryId: string;
  category: BudgetCategory;
  description: string;
  amount: number;
  currency: CurrencyType;
  date: string;
}

export interface BudgetSummary {
  itineraryId: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  byCategory: Record<BudgetCategory, number>;
  currency: CurrencyType;
}

export interface DestinationFilter {
  type?: DestinationType | null;
  priceRange?: [number, number];
  minRating?: number;
  searchText?: string;
}

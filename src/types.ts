export type Language = 'en' | 'ta';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner';

export type ServiceType = 'buffet' | 'alacarte' | 'banquet' | 'room_service';

export interface ManagerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  hotelName?: string;
  role: 'General Manager' | 'Executive Chef' | 'F&B Director' | 'Sous Chef' | string;
  propertyName: string;
  propertyLocation: string;
  authProvider?: 'firebase' | 'local_vault';
}

export type DietaryType = 'veg' | 'non_veg' | 'vegan' | 'jain';

export interface MenuItem {
  id: string;
  nameEn: string;
  nameTa: string;
  category: 'Continental' | 'South Indian' | 'North Indian' | 'Live Counter' | 'Beverages & Dessert' | 'Salads & Soups';
  categoryTa: string;
  mealSlots: MealSlot[];
  prepTimeMinutes: number;
  unit: string;
  unitTa: string;
  portionSizeGrams: number;
  dietary: DietaryType;
  baseConsumptionRatePerGuest: number; // typical portions per 100 diners
}

export interface GuestParameters {
  date: string;
  mealSlot: MealSlot;
  serviceType: ServiceType;
  roomOccupancyRate: number; // e.g., 78%
  inHouseGuests: number; // e.g., 220
  walkInForecast: number; // e.g., 45
  banquetDelegates: number; // e.g., 60
  dayType: 'weekday' | 'weekend' | 'festival_holiday';
  weatherCondition: 'Normal' | 'Hot' | 'Rainy' | 'Cloudy';
  bufferPercent: number; // e.g., 5-12%
}

export interface MealServiceDetails {
  mealSlot: MealSlot;
  expectedCustomers: number;
  advanceBookings: number;
}

export type WeatherType = 'Normal' | 'Hot' | 'Rainy' | 'Cloudy';

export interface CommonConditions {
  date: string;
  isHoliday: boolean;
  holidayName?: string;
  isFestival: boolean;
  festivalName?: string;
  festivalType?: string;
  specialEvent: string;
  weather: WeatherType;
  hasSpecialOffer: boolean;
}

export interface PlanItemPrepResult {
  menuItemId: string;
  nameEn: string;
  nameTa: string;
  category: string;
  mealSlot?: MealSlot;
  unit: string;
  unitTa: string;
  recommendedPortions: number;
  recommendedPrepQuantity: number;
  bufferSafetyUnits?: number;
  rfModelFeatureWeights?: {
    occupancyImpact: number;
    dayTrendImpact: number;
    weatherModifier: number;
  };
}

export interface PreparationPlan {
  id: string;
  createdAt: string;
  date: string;
  mealSlot?: MealSlot;
  mealSlots: MealSlot[];
  serviceType: ServiceType;
  totalGuestsTarget: number;
  selectedItemIds: string[];
  prepItems: PlanItemPrepResult[];
  mealDetails?: Record<MealSlot, MealServiceDetails>;
  conditions?: CommonConditions;
  summaryNote?: string;
  modelInfo?: {
    modelName: string;
    modelType: string;
    version: string;
    featuresCount: number;
    inferenceLatencyMs: number;
    targetMetric: string;
  };
  chefNotes?: string;
  status: 'planned' | 'kitchen_dispatched' | 'completed';
}

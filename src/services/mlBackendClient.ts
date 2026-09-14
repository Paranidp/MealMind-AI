/**
 * MealMind AI — Machine Learning Backend Client
 * Connects the React frontend to the Python FastAPI backend service hosting `mealmind_model.pkl`.
 *
 * NOTE: This client strictly proxies requests to the Python FastAPI server.
 * It does NOT invent fake predictions or substitute with fake values.
 */

import { MealSlot, MealServiceDetails, CommonConditions, PreparationPlan, PlanItemPrepResult } from '../types';

export function getMLApiBaseUrl(): string {
  return 'https://mealmind-backend-mb1b.onrender.com';
}

export interface MLModelStatus {
  status: 'ready' | 'waiting_for_model' | 'offline';
  modelFound: boolean;
  modelPath?: string;
  modelType?: string;
  description: string;
}

export interface MLPredictionSection {
  meal_slot: string;
  expected_customers: number;
  advance_bookings: number;
  items: Array<{
    food_item: string;
    food_item_ta?: string;
    recommended_quantity: number;
    unit: string;
    unit_ta?: string;
    category?: string;
  }>;
}

export interface MLPredictionResponse {
  success: boolean;
  summary: string;
  total_customers: number;
  date: string;
  model_loaded: boolean;
  model_source: string;
  sections: MLPredictionSection[];
  error?: string;
}

/**
 * Checks the status of the Python FastAPI backend and whether `mealmind_model.pkl` is loaded.
 */
export async function checkBackendStatus(): Promise<MLModelStatus> {
  const baseUrl = getMLApiBaseUrl();
  if (!baseUrl) {
    return {
      status: 'offline',
      modelFound: false,
      description: 'ML prediction service is currently unavailable. VITE_ML_API_URL is not configured.',
    };
  }

  try {
    const res = await fetch(`${baseUrl}/api/model-status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return {
        status: 'waiting_for_model',
        modelFound: false,
        description: `Backend responded with HTTP ${res.status}: mealmind_model.pkl not loaded.`,
      };
    }

    const data = await res.json();
    return {
      status: data.model_found ? 'ready' : 'waiting_for_model',
      modelFound: data.model_found,
      modelPath: data.model_path,
      modelType: data.model_type,
      description: data.description,
    };
  } catch {
    return {
      status: 'offline',
      modelFound: false,
      description: `Python FastAPI backend at ${baseUrl} is currently unreachable.`,
    };
  }
}

/**
 * Sends planning parameters to the Python FastAPI backend to run inference
 * through the scikit-learn RandomForestRegressor model.
 */
export async function predictWithMLBackend(
  selectedMeals: MealSlot[],
  mealDetails: Record<MealSlot, MealServiceDetails>,
  conditions: CommonConditions
): Promise<PreparationPlan> {
  const baseUrl = getMLApiBaseUrl();
  if (!baseUrl) {
    throw new Error(
      'ML prediction service is currently unavailable. VITE_ML_API_URL environment variable is not configured for this deployment.'
    );
  }

  const payload = {
    selected_meals: selectedMeals,
    meal_details: Object.fromEntries(
      selectedMeals.map((slot) => [
        slot,
        {
          expected_customers: mealDetails[slot]?.expectedCustomers || 100,
          advance_bookings: mealDetails[slot]?.advanceBookings || 0,
        },
      ])
    ),
    conditions: {
      date: conditions.date,
      is_holiday: conditions.isHoliday,
      holiday_name: conditions.holidayName || null,
      is_festival: conditions.isFestival,
      festival_name: conditions.festivalName || null,
      festival_type: conditions.festivalType || null,
      special_event: conditions.specialEvent || 'None',
      weather: conditions.weather,
      special_offer: conditions.hasSpecialOffer,
    },
  };

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      `ML prediction service is currently unavailable at ${baseUrl}. Please ensure the Python backend is running and network access is permitted.`
    );
  }

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message =
      errData?.detail?.message ||
      errData?.detail?.error ||
      `ML prediction service is currently unavailable (HTTP ${res.status}). Model file 'mealmind_model.pkl' may be missing or the backend encountered an error.`;
    throw new Error(message);
  }

  const data: MLPredictionResponse = await res.json();

  // Convert FastAPI backend response into frontend PreparationPlan format
  const prepItems: PlanItemPrepResult[] = [];
  const selectedItemIds: string[] = [];

  data.sections.forEach((section) => {
    section.items.forEach((item, idx) => {
      const itemId = `${section.meal_slot}-${idx}-${item.food_item.toLowerCase()}`;
      selectedItemIds.push(itemId);
      prepItems.push({
        menuItemId: itemId,
        mealSlot: section.meal_slot.toLowerCase() as MealSlot,
        nameEn: item.food_item,
        nameTa: item.food_item_ta || item.food_item,
        category: item.category || 'Kitchen Preparation',
        unit: item.unit,
        unitTa: item.unit_ta || item.unit,
        recommendedPortions: Math.round(item.recommended_quantity),
        recommendedPrepQuantity: item.recommended_quantity,
        bufferSafetyUnits: Math.round(item.recommended_quantity * 0.08),
      });
    });
  });

  return {
    id: `ML-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    date: data.date,
    mealSlots: selectedMeals.map(m => m.toLowerCase() as MealSlot),
    mealSlot: (selectedMeals[0] ? selectedMeals[0].toLowerCase() : section.meal_slot.toLowerCase()) as MealSlot,
    serviceType: 'buffet',
    totalGuestsTarget: data.total_customers,
    selectedItemIds,
    prepItems,
    mealDetails,
    conditions,
    summaryNote: data.summary,
    chefNotes: `Inference generated via trained RandomForestRegressor (${data.model_source}).`,
    status: 'planned',
  };
}

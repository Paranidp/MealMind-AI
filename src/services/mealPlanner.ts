import {
  MealSlot,
  MealServiceDetails,
  CommonConditions,
  PlanItemPrepResult,
  PreparationPlan
} from '../types';

export interface DefinedMenuItem {
  id: string;
  nameEn: string;
  nameTa: string;
  mealSlot: MealSlot;
  unitEn: string;
  unitTa: string;
  category: string;
  baseRatio: number; // standard baseline portions/units per expected diner
  isDecimalUnit?: boolean;
}

export const MEAL_MENU_DEFINITIONS: Record<MealSlot, DefinedMenuItem[]> = {
  breakfast: [
    {
      id: 'bf-dosa',
      nameEn: 'Dosa',
      nameTa: 'தோசை',
      mealSlot: 'breakfast',
      unitEn: 'Pieces',
      unitTa: 'துண்டுகள்',
      category: 'Tiffin / Griddle',
      baseRatio: 1.4,
    },
    {
      id: 'bf-idli',
      nameEn: 'Idli',
      nameTa: 'இட்லி',
      mealSlot: 'breakfast',
      unitEn: 'Pieces',
      unitTa: 'துண்டுகள்',
      category: 'Steamed Tiffin',
      baseRatio: 2.2,
    },
    {
      id: 'bf-chapati',
      nameEn: 'Chapati',
      nameTa: 'சப்பாத்தி',
      mealSlot: 'breakfast',
      unitEn: 'Pieces',
      unitTa: 'துண்டுகள்',
      category: 'Breads',
      baseRatio: 1.2,
    },
    {
      id: 'bf-poori',
      nameEn: 'Poori',
      nameTa: 'பூரி',
      mealSlot: 'breakfast',
      unitEn: 'Pieces',
      unitTa: 'துண்டுகள்',
      category: 'Fried Breads',
      baseRatio: 1.6,
    },
  ],
  lunch: [
    {
      id: 'lu-biryani',
      nameEn: 'Biryani',
      nameTa: 'பிரியாணி',
      mealSlot: 'lunch',
      unitEn: 'Portions',
      unitTa: 'பங்குகள்',
      category: 'Main Course',
      baseRatio: 0.40,
    },
    {
      id: 'lu-rice',
      nameEn: 'Rice',
      nameTa: 'சாதம்',
      mealSlot: 'lunch',
      unitEn: 'kg',
      unitTa: 'கிலோ',
      category: 'Grains',
      baseRatio: 0.22,
      isDecimalUnit: true,
    },
    {
      id: 'lu-sambar',
      nameEn: 'Sambar',
      nameTa: 'சாம்பார்',
      mealSlot: 'lunch',
      unitEn: 'Litres',
      unitTa: 'லிட்டர்',
      category: 'Lentils & Gravy',
      baseRatio: 0.18,
      isDecimalUnit: true,
    },
    {
      id: 'lu-parotta',
      nameEn: 'Parotta',
      nameTa: 'பரோட்டா',
      mealSlot: 'lunch',
      unitEn: 'Pieces',
      unitTa: 'துண்டுகள்',
      category: 'Breads',
      baseRatio: 1.4,
    },
    {
      id: 'lu-meals',
      nameEn: 'Meals',
      nameTa: 'மீல்ஸ் (சாப்பாடு)',
      mealSlot: 'lunch',
      unitEn: 'Sets',
      unitTa: 'தட்டுகள்',
      category: 'Full Thali',
      baseRatio: 0.45,
    },
    {
      id: 'lu-chicken',
      nameEn: 'Chicken',
      nameTa: 'சிக்கன்',
      mealSlot: 'lunch',
      unitEn: 'kg',
      unitTa: 'கிலோ',
      category: 'Non-Vegetarian',
      baseRatio: 0.20,
      isDecimalUnit: true,
    },
  ],
  dinner: [
    {
      id: 'di-idli',
      nameEn: 'Idli',
      nameTa: 'இட்லி',
      mealSlot: 'dinner',
      unitEn: 'Pieces',
      unitTa: 'துண்டுகள்',
      category: 'Steamed Tiffin',
      baseRatio: 1.8,
    },
    {
      id: 'di-dosa',
      nameEn: 'Dosa',
      nameTa: 'தோசை',
      mealSlot: 'dinner',
      unitEn: 'Pieces',
      unitTa: 'துண்டுகள்',
      category: 'Tiffin / Griddle',
      baseRatio: 1.6,
    },
    {
      id: 'di-parotta',
      nameEn: 'Parotta',
      nameTa: 'பரோட்டா',
      mealSlot: 'dinner',
      unitEn: 'Pieces',
      unitTa: 'துண்டுகள்',
      category: 'Breads',
      baseRatio: 1.8,
    },
  ],
};

/**
 * Deterministic Demand Calculation (strictly no Gemini, no Math.random)
 * Emulates the Random Forest Regression feature weights.
 */
export function calculateMealPlan(
  selectedMeals: MealSlot[],
  mealDetails: Record<MealSlot, MealServiceDetails>,
  conditions: CommonConditions
): PreparationPlan {
  const prepItems: PlanItemPrepResult[] = [];
  let totalCustomers = 0;

  // Multiplier weights based on conditions
  let conditionFactor = 1.0;

  if (conditions.isHoliday) {
    conditionFactor += 0.10; // +10% demand surge on holidays
  }
  if (conditions.isFestival) {
    conditionFactor += 0.15; // +15% demand surge during festivals
  }
  if (conditions.hasSpecialOffer) {
    conditionFactor += 0.08; // +8% promotional conversion
  }

  // Weather modifier (strictly Normal, Hot, Rainy, Cloudy)
  let weatherModifier = 1.0;
  if (conditions.weather === 'Rainy') {
    weatherModifier = 1.06; // Rain boosts indoor dining and hot dishes
  } else if (conditions.weather === 'Hot') {
    weatherModifier = 0.96; // Hot weather shifts appetite toward lighter portions
  } else if (conditions.weather === 'Cloudy') {
    weatherModifier = 1.02;
  }

  // Event modifier
  let eventModifier = 1.0;
  if (conditions.specialEvent && conditions.specialEvent !== 'None' && conditions.specialEvent.trim() !== '') {
    eventModifier = 1.08;
  }

  selectedMeals.forEach((slot) => {
    const details = mealDetails[slot];
    if (!details) return;

    const customers = Math.max(1, details.expectedCustomers);
    totalCustomers += customers;

    // Advance booking ratio modifier (higher ratio = lower walk-in volatility)
    const bookingRatio = details.advanceBookings / customers;
    const bookingStabilityBonus = bookingRatio > 0.6 ? 1.02 : 1.0;

    const slotItems = MEAL_MENU_DEFINITIONS[slot] || [];

    slotItems.forEach((item) => {
      // Dish-specific weather responsiveness
      let dishWeatherFactor = weatherModifier;
      if (conditions.weather === 'Rainy' && (item.nameEn === 'Poori' || item.nameEn === 'Parotta' || item.nameEn === 'Biryani')) {
        dishWeatherFactor = 1.10; // Extra affinity for hot comfort food in rain
      }

      const rawQuantity =
        customers *
        item.baseRatio *
        conditionFactor *
        dishWeatherFactor *
        eventModifier *
        bookingStabilityBonus;

      let finalQuantity: number;
      if (item.isDecimalUnit) {
        // e.g. 24.5 kg or litres (round to 1 decimal)
        finalQuantity = Math.round(rawQuantity * 10) / 10;
      } else {
        // e.g. 420 pieces
        finalQuantity = Math.round(rawQuantity);
      }

      // 5-8% safety buffer
      const buffer = item.isDecimalUnit
        ? Math.round(finalQuantity * 0.06 * 10) / 10
        : Math.max(1, Math.round(finalQuantity * 0.06));

      prepItems.push({
        menuItemId: item.id,
        nameEn: item.nameEn,
        nameTa: item.nameTa,
        category: item.category,
        mealSlot: slot,
        unit: item.unitEn,
        unitTa: item.unitTa,
        recommendedPortions: customers,
        recommendedPrepQuantity: finalQuantity,
        bufferSafetyUnits: buffer,
        rfModelFeatureWeights: {
          occupancyImpact: Math.round(conditionFactor * 100) / 100,
          dayTrendImpact: Math.round(bookingStabilityBonus * 100) / 100,
          weatherModifier: Math.round(dishWeatherFactor * 100) / 100,
        },
      });
    });
  });

  const planId = `PLAN-${conditions.date.replace(/-/g, '')}-${selectedMeals
    .map((s) => s.substring(0, 2).toUpperCase())
    .join('')}-${Math.floor(Date.now() % 10000)}`;

  const mealSummaryParts = selectedMeals.map((s) => {
    const details = mealDetails[s];
    const name = s.charAt(0).toUpperCase() + s.slice(1);
    return `${name}: ${details.expectedCustomers} customers`;
  });

  const summaryNote = `Preparation plan generated for ${totalCustomers} expected customers (${mealSummaryParts.join(
    ', '
  )}).`;

  return {
    id: planId,
    createdAt: new Date().toISOString(),
    date: conditions.date,
    mealSlots: selectedMeals,
    serviceType: 'buffet',
    totalGuestsTarget: totalCustomers,
    selectedItemIds: prepItems.map((i) => i.menuItemId),
    prepItems,
    mealDetails,
    conditions,
    summaryNote,
    status: 'planned',
    chefNotes: `Plan tuned for ${conditions.weather} conditions${
      conditions.isHoliday ? ` · Holiday (${conditions.holidayName || 'Official'})` : ''
    }${conditions.isFestival ? ` · Festival (${conditions.festivalName || 'Special'})` : ''}.`,
  };
}

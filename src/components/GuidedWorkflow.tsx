import React, { useState } from 'react';
import {
  Coffee,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Check,
  Calendar,
  AlertCircle,
  Users,
  Sparkles,
  CloudSun,
  Tag,
  PartyPopper,
  Loader2
} from 'lucide-react';
import {
  Language,
  MealSlot,
  MealServiceDetails,
  CommonConditions,
  WeatherType,
  PreparationPlan
} from '../types';
import { translations } from '../translations';
import { predictWithMLBackend } from '../services/mlBackendClient';

interface GuidedWorkflowProps {
  language: Language;
  onCancel: () => void;
  onCompletePlan: (plan: PreparationPlan) => void;
}

export const GuidedWorkflow: React.FC<GuidedWorkflowProps> = ({
  language,
  onCancel,
  onCompletePlan,
}) => {
  const t = translations[language];

  // Current Step: 1, 2, or 3
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // STEP 1 State: Meal Selection (can be 1, 2, or 3)
  const [selectedMeals, setSelectedMeals] = useState<MealSlot[]>(['breakfast']);
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // STEP 2 State: Meal-specific Details
  const [mealDetails, setMealDetails] = useState<Record<MealSlot, MealServiceDetails>>({
    breakfast: { mealSlot: 'breakfast', expectedCustomers: 120, advanceBookings: 45 },
    lunch: { mealSlot: 'lunch', expectedCustomers: 180, advanceBookings: 60 },
    dinner: { mealSlot: 'dinner', expectedCustomers: 140, advanceBookings: 50 },
  });
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});

  // STEP 3 State: Common Conditions
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isHoliday, setIsHoliday] = useState<boolean>(false);
  const [holidayName, setHolidayName] = useState<string>('');
  const [isFestival, setIsFestival] = useState<boolean>(false);
  const [festivalName, setFestivalName] = useState<string>('');
  const [festivalType, setFestivalType] = useState<string>('Cultural');
  const [specialEvent, setSpecialEvent] = useState<string>('None');
  const [weather, setWeather] = useState<WeatherType>('Normal');
  const [hasSpecialOffer, setHasSpecialOffer] = useState<boolean>(false);
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});

  // ML Backend Prediction State
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  // Meal configurations & dishes
  const mealConfig: Array<{
    id: MealSlot;
    title: string;
    tamilTitle: string;
    hours: string;
    dishes: string[];
    tamilDishes: string[];
    icon: typeof Coffee;
  }> = [
    {
      id: 'breakfast',
      title: 'Breakfast',
      tamilTitle: 'காலை உணவு',
      hours: '06:30 – 10:30',
      dishes: ['Dosa', 'Idli', 'Chapati', 'Poori'],
      tamilDishes: ['தோசை', 'இட்லி', 'சப்பாத்தி', 'பூரி'],
      icon: Coffee,
    },
    {
      id: 'lunch',
      title: 'Lunch',
      tamilTitle: 'மதிய உணவு',
      hours: '12:00 – 15:30',
      dishes: ['Biryani', 'Rice', 'Sambar', 'Parotta', 'Meals', 'Chicken'],
      tamilDishes: ['பிரியாணி', 'சாதம்', 'சாம்பார்', 'பரோட்டா', 'மீல்ஸ்', 'சிக்கன்'],
      icon: Sun,
    },
    {
      id: 'dinner',
      title: 'Dinner',
      tamilTitle: 'இரவு உணவு',
      hours: '19:00 – 23:30',
      dishes: ['Idli', 'Dosa', 'Parotta'],
      tamilDishes: ['இட்லி', 'தோசை', 'பரோட்டா'],
      icon: Moon,
    },
  ];

  // STEP 1 Handlers
  const toggleMeal = (meal: MealSlot) => {
    setStep1Error(null);
    if (selectedMeals.includes(meal)) {
      setSelectedMeals(selectedMeals.filter((m) => m !== meal));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const handleSelectAllMeals = () => {
    setStep1Error(null);
    setSelectedMeals(['breakfast', 'lunch', 'dinner']);
  };

  const handleStep1Continue = () => {
    if (selectedMeals.length === 0) {
      setStep1Error(t.errorSelectAtLeastOneMeal);
      return;
    }
    setStep1Error(null);
    setCurrentStep(2);
  };

  // STEP 2 Handlers
  const handleMealDetailChange = (
    meal: MealSlot,
    field: 'expectedCustomers' | 'advanceBookings',
    value: string
  ) => {
    const num = parseInt(value, 10);
    const parsed = isNaN(num) ? 0 : Math.max(0, num);

    setMealDetails((prev) => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: parsed,
      },
    }));

    // Clear field-specific error
    setStep2Errors((prev) => {
      const next = { ...prev };
      delete next[`${meal}_${field}`];
      delete next[`${meal}_validation`];
      return next;
    });
  };

  const handleStep2Continue = () => {
    const errors: Record<string, string> = {};

    selectedMeals.forEach((meal) => {
      const details = mealDetails[meal];
      const customers = details?.expectedCustomers ?? 0;
      const bookings = details?.advanceBookings ?? 0;

      if (!customers || customers <= 0) {
        errors[`${meal}_customers`] = t.errorExpectedCustomersZero;
      }

      if (bookings > customers) {
        errors[`${meal}_bookings`] = t.errorAdvanceBookingsExceed;
      }
    });

    if (Object.keys(errors).length > 0) {
      setStep2Errors(errors);
      return;
    }

    setStep2Errors({});
    setCurrentStep(3);
  };

  // STEP 3 Handlers
  const handleGeneratePlan = async () => {
    const errors: Record<string, string> = {};

    if (isHoliday && (!holidayName || holidayName.trim() === '')) {
      errors.holidayName = t.errorHolidayNameRequired;
    }

    if (isFestival && (!festivalName || festivalName.trim() === '')) {
      errors.festivalName = t.errorFestivalRequired;
    }

    if (Object.keys(errors).length > 0) {
      setStep3Errors(errors);
      return;
    }

    setStep3Errors({});
    setPredictionError(null);

    const conditions: CommonConditions = {
      date,
      isHoliday,
      holidayName: isHoliday ? holidayName.trim() : undefined,
      isFestival,
      festivalName: isFestival ? festivalName.trim() : undefined,
      festivalType: isFestival ? festivalType : undefined,
      specialEvent,
      weather,
      hasSpecialOffer,
    };

    setIsPredicting(true);
    try {
      const newPlan = await predictWithMLBackend(selectedMeals, mealDetails, conditions);
      onCompletePlan(newPlan);
    } catch (err: any) {
      const msg =
        err?.message ||
        (language === 'en'
          ? 'ML prediction service is currently unavailable. Please verify the Python backend is running.'
          : 'ML கணிப்பு சேவை தற்போது கிடைக்கவில்லை.');
      setPredictionError(msg);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Step Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-700 font-bold uppercase tracking-wider">
              <span>MealMind AI</span>
              <span>·</span>
              <span>{language === 'en' ? 'Kitchen Planning Workflow' : 'சமையல் திட்டமிடல் படிநிலைகள்'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mt-1">
              {currentStep === 1 && (language === 'en' ? 'Step 1: Select Meals' : 'படி 1: உணவுகளைத் தேர்வு செய்க')}
              {currentStep === 2 && (language === 'en' ? 'Step 2: Meal-Specific Details' : 'படி 2: உணவு விபரங்கள்')}
              {currentStep === 3 && (language === 'en' ? 'Step 3: Common Conditions' : 'படி 3: பொது நிபந்தனைகள்')}
            </h1>
          </div>

          {/* Stepper Pill Indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNum) => {
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;

              return (
                <div key={stepNum} className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#0B132B] text-amber-400 ring-2 ring-amber-500/30'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[2.5]" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`w-6 h-0.5 ${
                        isPast ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step descriptions */}
        <p className="text-xs text-slate-500 pt-3">
          {currentStep === 1 &&
            (language === 'en'
              ? 'Select any combination: only one meal, any two meals, or all three meals.'
              : 'காலை, மதிய மற்றும் இரவு உணவுகளில் ஏதேனும் ஒன்றையோ, இரண்டையோ அல்லது மூன்றையுமோ தேர்ந்தெடுக்கவும்.')}
          {currentStep === 2 &&
            (language === 'en'
              ? 'Provide expected customers and advance bookings for each selected service.'
              : 'தேர்ந்தெடுக்கப்பட்ட ஒவ்வொரு உணவுக்கும் எதிர்பார்க்கப்படும் வாடிக்கையாளர்கள் மற்றும் முன்பதிவுகளை உள்ளிடவும்.')}
          {currentStep === 3 &&
            (language === 'en'
              ? 'Set common date, holiday, festival, weather, and promotional conditions for demand modeling.'
              : 'தேதி, விடுமுறை, திருவிழா, வானிலை மற்றும் சலுகை விவரங்களை அமைக்கவும்.')}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: SELECT MEALS                                                     */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                {language === 'en' ? 'Choose Meals for Preparation' : 'தயாரிப்பிற்கான உணவுகளைத் தேர்ந்தெடுக்கவும்'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Menus are automatically assigned based on each selected meal.'
                  : 'தேர்ந்தெடுக்கப்பட்ட உணவுகளுக்கு தானாகவே நிலையான மெனு பட்டியலிடப்படும்.'}
              </p>
            </div>

            <button
              id="step1-select-all-btn"
              type="button"
              onClick={handleSelectAllMeals}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto"
            >
              {language === 'en' ? 'Select All 3 Meals' : '3 உணவுகளையும் தேர்ந்தெடு'}
            </button>
          </div>

          {step1Error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{step1Error}</span>
            </div>
          )}

          {/* 3 Meal Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {mealConfig.map((meal) => {
              const isSelected = selectedMeals.includes(meal.id);
              const Icon = meal.icon;

              return (
                <div
                  key={meal.id}
                  id={`step1-meal-card-${meal.id}`}
                  onClick={() => toggleMeal(meal.id)}
                  className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-[#0B132B] bg-slate-50/80 shadow-xs ring-1 ring-amber-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#0B132B] text-amber-400'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#0B132B] border-[#0B132B] text-amber-400'
                            : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-serif font-bold text-lg text-slate-900">
                        {language === 'en' ? meal.title : meal.tamilTitle}
                      </h3>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {meal.hours}
                      </span>

                      {/* Automatic Menu Items Preview */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                          {language === 'en' ? 'Automatic Menu Items' : 'உணவு பட்டியல்'}:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(language === 'en' ? meal.dishes : meal.tamilDishes).map((d) => (
                            <span
                              key={d}
                              className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 shadow-2xs"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        isSelected ? 'text-amber-800' : 'text-slate-400'
                      }`}
                    >
                      {isSelected
                        ? (language === 'en' ? 'Selected' : 'தேர்ந்தெடுக்கப்பட்டது')
                        : (language === 'en' ? 'Click to Select' : 'தேர்வு செய்க')}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step 1 Actions: Back & Continue */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              id="step1-back-btn"
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </button>

            <button
              id="step1-continue-btn"
              type="button"
              onClick={handleStep1Continue}
              className="px-6 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#162447] text-white text-xs font-bold flex items-center space-x-2 border border-amber-500/30 transition-colors cursor-pointer shadow-xs"
            >
              <span>{t.continueBtn}</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: MEAL-SPECIFIC DETAILS (Expected Customers & Advance Bookings)     */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 block">
              {language === 'en' ? 'Headcount Parameters' : 'வாடிக்கையாளர் எண்ணிக்கை'}
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-0.5">
              {language === 'en'
                ? 'Enter Expected Customers & Advance Bookings'
                : 'வாடிக்கையாளர் எண்ணிக்கை மற்றும் முன்பதிவுகளை உள்ளிடவும்'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? 'Fill details for each selected meal. Food items are automatically configured.'
                : 'தேர்ந்தெடுக்கப்பட்ட ஒவ்வொரு உணவுக்கும் விபரங்களை உள்ளிடவும். உணவுகள் தானாக நிர்ணயிக்கப்படும்.'}
            </p>
          </div>

          {/* Cards for each selected meal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {selectedMeals.map((meal) => {
              const config = mealConfig.find((m) => m.id === meal)!;
              const details = mealDetails[meal];
              const Icon = config.icon;
              const custError = step2Errors[`${meal}_customers`];
              const bookError = step2Errors[`${meal}_bookings`];

              return (
                <div
                  key={meal}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-[#0B132B] text-amber-400 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900">
                          {language === 'en' ? config.title : config.tamilTitle}
                        </h3>
                        <span className="text-[11px] text-slate-500 block">
                          {config.hours}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      {config.dishes.length} {language === 'en' ? 'Dishes' : 'உணவுகள்'}
                    </span>
                  </div>

                  {/* Input Fields: Expected Customers & Advance Bookings */}
                  <div className="space-y-4">
                    {/* Expected Customers */}
                    <div>
                      <label
                        htmlFor={`input-customers-${meal}`}
                        className="block text-xs font-bold text-slate-800 mb-1"
                      >
                        {t.expectedCustomersLabel}{' '}
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id={`input-customers-${meal}`}
                          type="number"
                          min="1"
                          value={details.expectedCustomers || ''}
                          onChange={(e) =>
                            handleMealDetailChange(meal, 'expectedCustomers', e.target.value)
                          }
                          placeholder="e.g. 150"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold bg-white transition-colors outline-none focus:ring-2 ${
                            custError
                              ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                              : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100 text-slate-900'
                          }`}
                        />
                        <div className="absolute right-3.5 top-3 text-slate-400 pointer-events-none">
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                      {custError ? (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{custError}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-1">
                          {language === 'en'
                            ? 'Total expected diners (> 0).'
                            : 'மொத்த வாடிக்கையாளர்கள் (0-ஐ விட அதிகம்).'}
                        </p>
                      )}
                    </div>

                    {/* Advance Bookings */}
                    <div>
                      <label
                        htmlFor={`input-bookings-${meal}`}
                        className="block text-xs font-bold text-slate-800 mb-1"
                      >
                        {t.advanceBookingsLabel}
                      </label>
                      <div className="relative">
                        <input
                          id={`input-bookings-${meal}`}
                          type="number"
                          min="0"
                          max={details.expectedCustomers}
                          value={details.advanceBookings}
                          onChange={(e) =>
                            handleMealDetailChange(meal, 'advanceBookings', e.target.value)
                          }
                          placeholder="e.g. 50"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold bg-white transition-colors outline-none focus:ring-2 ${
                            bookError
                              ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                              : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100 text-slate-900'
                          }`}
                        />
                      </div>
                      {bookError ? (
                        <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{bookError}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-1">
                          {language === 'en'
                            ? 'Confirmed reservations (must not exceed expected customers).'
                            : 'முன்பதிவுகள் (வாடிக்கையாளர் எண்ணிக்கையை விட அதிகமாக இருக்கக்கூடாது).'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Food items reminder */}
                  <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200/60">
                    <span className="font-semibold text-slate-700">
                      {language === 'en' ? 'Dishes to prepare:' : 'தயாரிக்கப்படும் உணவுகள்:'}
                    </span>{' '}
                    {(language === 'en' ? config.dishes : config.tamilDishes).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step 2 Actions: Back & Continue */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              id="step2-back-btn"
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </button>

            <button
              id="step2-continue-btn"
              type="button"
              onClick={handleStep2Continue}
              className="px-6 py-2.5 rounded-xl bg-[#0B132B] hover:bg-[#162447] text-white text-xs font-bold flex items-center space-x-2 border border-amber-500/30 transition-colors cursor-pointer shadow-xs"
            >
              <span>{t.continueBtn}</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: COMMON CONDITIONS                                                */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 block">
              {language === 'en' ? 'Day Conditions & Modifiers' : 'அன்றைய சூழல் நிபந்தனைகள்'}
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-0.5">
              {language === 'en'
                ? 'Operational Context & Surge Factors'
                : 'செயல்பாட்டு சூழல் மற்றும் தேவை காரணிகள்'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? 'These parameters adjust prediction weights for holidays, weather patterns, and events.'
                : 'விடுமுறை, வானிலை மற்றும் சிறப்பு நிகழ்வுகளுக்கு ஏற்ப அளவுகள் தானாக சரிசெய்யப்படும்.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Field: Date */}
            <div>
              <label
                htmlFor="input-condition-date"
                className="block text-xs font-bold text-slate-800 mb-1.5"
              >
                {language === 'en' ? 'Preparation Date' : 'தயாரிப்பு தேதி'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-condition-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-900"
                />
              </div>
            </div>

            {/* Field: Weather */}
            <div>
              <label
                htmlFor="select-condition-weather"
                className="block text-xs font-bold text-slate-800 mb-1.5"
              >
                {t.weatherLabelField}
              </label>
              <select
                id="select-condition-weather"
                value={weather}
                onChange={(e) => setWeather(e.target.value as WeatherType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-900 cursor-pointer"
              >
                <option value="Normal">{language === 'en' ? 'Normal' : 'இயல்பு (Normal)'}</option>
                <option value="Hot">{language === 'en' ? 'Hot' : 'வெப்பம் (Hot)'}</option>
                <option value="Rainy">{language === 'en' ? 'Rainy' : 'மழை (Rainy)'}</option>
                <option value="Cloudy">{language === 'en' ? 'Cloudy' : 'மேகமூட்டம் (Cloudy)'}</option>
              </select>
            </div>

            {/* Field: Is it a Holiday? (Yes / No) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 block">
                  {t.isHolidayLabel}
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-white p-0.5">
                  <button
                    id="holiday-toggle-no"
                    type="button"
                    onClick={() => {
                      setIsHoliday(false);
                      setHolidayName('');
                      setStep3Errors((prev) => {
                        const next = { ...prev };
                        delete next.holidayName;
                        return next;
                      });
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      !isHoliday
                        ? 'bg-[#0B132B] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.noLabel}
                  </button>
                  <button
                    id="holiday-toggle-yes"
                    type="button"
                    onClick={() => setIsHoliday(true)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      isHoliday
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.yesLabel}
                  </button>
                </div>
              </div>

              {/* Holiday Name (shown ONLY when Holiday = Yes) */}
              {isHoliday && (
                <div className="pt-2 border-t border-slate-200">
                  <label
                    htmlFor="input-holiday-name"
                    className="block text-[11px] font-bold text-slate-800 mb-1"
                  >
                    {t.holidayNameLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="input-holiday-name"
                    type="text"
                    value={holidayName}
                    onChange={(e) => {
                      setHolidayName(e.target.value);
                      if (e.target.value.trim()) {
                        setStep3Errors((prev) => {
                          const next = { ...prev };
                          delete next.holidayName;
                          return next;
                        });
                      }
                    }}
                    placeholder={t.holidayNamePlaceholder}
                    className={`w-full px-3 py-2 rounded-lg border text-xs font-medium bg-white outline-none focus:ring-2 ${
                      step3Errors.holidayName
                        ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                        : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100 text-slate-900'
                    }`}
                  />
                  {step3Errors.holidayName && (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{step3Errors.holidayName}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Field: Is there a Festival? (Yes / No) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 block">
                  {t.isFestivalLabel}
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-white p-0.5">
                  <button
                    id="festival-toggle-no"
                    type="button"
                    onClick={() => {
                      setIsFestival(false);
                      setFestivalName('');
                      setStep3Errors((prev) => {
                        const next = { ...prev };
                        delete next.festivalName;
                        return next;
                      });
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      !isFestival
                        ? 'bg-[#0B132B] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.noLabel}
                  </button>
                  <button
                    id="festival-toggle-yes"
                    type="button"
                    onClick={() => setIsFestival(true)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      isFestival
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t.yesLabel}
                  </button>
                </div>
              </div>

              {/* Festival Name & Type (shown ONLY when Festival = Yes) */}
              {isFestival && (
                <div className="pt-2 border-t border-slate-200 space-y-2.5">
                  <div>
                    <label
                      htmlFor="input-festival-name"
                      className="block text-[11px] font-bold text-slate-800 mb-1"
                    >
                      {t.festivalNameLabel} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="input-festival-name"
                      type="text"
                      value={festivalName}
                      onChange={(e) => {
                        setFestivalName(e.target.value);
                        if (e.target.value.trim()) {
                          setStep3Errors((prev) => {
                            const next = { ...prev };
                            delete next.festivalName;
                            return next;
                          });
                        }
                      }}
                      placeholder={t.festivalNamePlaceholder}
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-medium bg-white outline-none focus:ring-2 ${
                        step3Errors.festivalName
                          ? 'border-rose-300 focus:ring-rose-200 text-rose-900'
                          : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100 text-slate-900'
                      }`}
                    />
                    {step3Errors.festivalName && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{step3Errors.festivalName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="select-festival-type"
                      className="block text-[11px] font-bold text-slate-800 mb-1"
                    >
                      {t.festivalTypeLabel}
                    </label>
                    <select
                      id="select-festival-type"
                      value={festivalType}
                      onChange={(e) => setFestivalType(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white outline-none cursor-pointer"
                    >
                      <option value="Cultural">Cultural (கலாச்சாரம்)</option>
                      <option value="Religious">Religious (ஆன்மீகம்)</option>
                      <option value="National">National (தேசிய)</option>
                      <option value="Regional">Regional (பிராந்திய)</option>
                      <option value="Harvest">Harvest / Seasonal (அறுவடை)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Field: Special Event */}
            <div>
              <label
                htmlFor="select-special-event"
                className="block text-xs font-bold text-slate-800 mb-1.5"
              >
                {t.specialEventLabel}
              </label>
              <select
                id="select-special-event"
                value={specialEvent}
                onChange={(e) => setSpecialEvent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white outline-none focus:ring-2 focus:ring-slate-100 focus:border-slate-900 cursor-pointer"
              >
                <option value="None">{language === 'en' ? 'None (Standard Service)' : 'எதுவுமில்லை (வழக்கமான சேவை)'}</option>
                <option value="College Function">{language === 'en' ? 'College Function' : 'கல்லூரி விழா'}</option>
                <option value="Marriage Function">{language === 'en' ? 'Marriage Function' : 'திருமண விழா'}</option>
                <option value="Corporate Event">{language === 'en' ? 'Corporate Event' : 'கார்ப்பரேட் நிகழ்வு'}</option>
                <option value="Local Event">{language === 'en' ? 'Local Event' : 'உள்ளூர் நிகழ்வு'}</option>
              </select>
            </div>

            {/* Field: Special Offer? (Yes / No) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-900 block">
                  {t.specialOfferLabel}
                </label>
                <p className="text-[10px] text-slate-500">
                  {language === 'en'
                    ? 'Active restaurant promotion or dining discount'
                    : 'செயலில் உள்ள உணவக விளம்பரச் சலுகை'}
                </p>
              </div>

              <div className="flex items-center rounded-lg border border-slate-300 bg-white p-0.5 shrink-0">
                <button
                  id="offer-toggle-no"
                  type="button"
                  onClick={() => setHasSpecialOffer(false)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    !hasSpecialOffer
                      ? 'bg-[#0B132B] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.noLabel}
                </button>
                <button
                  id="offer-toggle-yes"
                  type="button"
                  onClick={() => setHasSpecialOffer(true)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    hasSpecialOffer
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.yesLabel}
                </button>
              </div>
            </div>
          </div>

          {/* Professional ML Prediction Service Status Banner */}
          {predictionError && (
            <div
              id="ml-service-error-banner"
              className="p-4 rounded-xl bg-amber-50 border border-amber-300/80 text-amber-950 flex items-start space-x-3 text-xs leading-relaxed"
            >
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-950">
                  {language === 'en'
                    ? 'ML Prediction Service Notice'
                    : 'ML கணிப்பு சேவை அறிவிப்பு'}
                </p>
                <p className="text-amber-900">{predictionError}</p>
              </div>
            </div>
          )}

          {/* Step 3 Actions: Back & Generate Preparation Plan */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              id="step3-back-btn"
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </button>

            <button
              id="generate-prep-plan-btn"
              type="button"
              onClick={handleGeneratePlan}
              disabled={isPredicting}
              className={`px-6 py-3 rounded-xl bg-[#0B132B] hover:bg-[#162447] text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center space-x-2.5 border border-amber-500/40 transition-all cursor-pointer shadow-sm ${
                isPredicting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isPredicting ? (
                <>
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>
                    {language === 'en' ? 'Running ML Inference...' : 'ML கணிப்பு இயங்குகிறது...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t.generatePrepPlanBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

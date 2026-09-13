import { Language } from './types';

export interface TranslationDict {
  brandName: string;
  brandTagline: string;
  navDashboard: string;
  navNewPlan: string;
  navHistory: string;
  navModelSpecs: string;
  login: string;
  signup: string;
  logout: string;
  demoLogin: string;
  managerPortal: string;
  executiveChef: string;
  welcomeBack: string;

  // Landing
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  ctaStartPlanning: string;
  ctaExploreDashboard: string;
  keyFeature1Title: string;
  keyFeature1Desc: string;
  keyFeature2Title: string;
  keyFeature2Desc: string;
  keyFeature3Title: string;
  keyFeature3Desc: string;
  modelNoticeTitle: string;
  modelNoticeDesc: string;

  // Dashboard
  todayOverview: string;
  serviceShift: string;
  hotelOccupancy: string;
  expectedDiners: string;
  activeMealSlot: string;
  wasteReductionRate: string;
  recentPlansTitle: string;
  noRecentPlans: string;
  quickPlanAction: string;
  breakfastService: string;
  lunchService: string;
  dinnerService: string;
  kitchenStatus: string;
  readyForExecution: string;
  inPreparation: string;
  completed: string;
  viewDetails: string;
  actionRequired: string;
  shiftMorning: string;
  shiftAfternoon: string;
  shiftEvening: string;

  // Guided Workflow
  workflowTitle: string;
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  step2Subtitle: string;
  step3Title: string;
  step3Subtitle: string;
  step4Title: string;
  step4Subtitle: string;
  step5Title: string;
  step5Subtitle: string;

  nextStep: string;
  prevStep: string;
  generatePlan: string;
  backToDashboard: string;

  // Form fields & steps
  selectDate: string;
  mealSlotLabel: string;
  serviceTypeLabel: string;
  buffetOption: string;
  alacarteOption: string;
  banquetOption: string;
  roomServiceOption: string;
  occupancyLabel: string;
  inHouseGuestsLabel: string;
  walkInLabel: string;
  banquetDelegatesLabel: string;
  dayTypeLabel: string;
  weekdayOption: string;
  weekendOption: string;
  festivalOption: string;
  weatherLabel: string;
  weatherNormal: string;
  weatherHot: string;
  weatherRainy: string;
  weatherCloudy: string;
  bufferMarginLabel: string;
  bufferMarginHelp: string;

  // Menu Selection
  menuSelectTitle: string;
  menuSelectSubtitle: string;
  filterAll: string;
  selectedItemsCount: string;
  prepTime: string;
  portionUnit: string;
  dietaryVeg: string;
  dietaryNonVeg: string;
  dietaryVegan: string;
  dietaryJain: string;
  selectAll: string;
  deselectAll: string;

  // Plan Results
  planResultTitle: string;
  planResultSubtitle: string;
  mlModelBadge: string;
  rfArchitectureNotice: string;
  totalGuestsCard: string;
  prepItemsCard: string;
  printPrepSheet: string;
  saveToArchive: string;
  dispatchToKitchen: string;
  chefApproval: string;
  chefApprovedNotice: string;
  itemCol: string;
  categoryCol: string;
  portionsCol: string;
  quantityCol: string;
  bufferCol: string;
  chefNotesPlaceholder: string;
  chefNotesTitle: string;

  // ML Specs Modal
  mlModalTitle: string;
  mlModalSubtitle: string;
  featureInputsTitle: string;
  targetOutputTitle: string;
  closeBtn: string;

  // Meal Selection on Dashboard
  selectMealsPrompt: string;
  startPlanning: string;
  selectedMeals: string;
  noMealsSelected: string;
  allThreeMeals: string;
  breakfastDesc: string;
  lunchDesc: string;
  dinnerDesc: string;
  planForMeals: string;
  recentPlansEmpty: string;
  plannedServices: string;

  // Core 3-Step Guided Workflow
  expectedCustomersLabel: string;
  advanceBookingsLabel: string;
  isHolidayLabel: string;
  holidayNameLabel: string;
  holidayNamePlaceholder: string;
  isFestivalLabel: string;
  festivalNameLabel: string;
  festivalNamePlaceholder: string;
  festivalTypeLabel: string;
  specialEventLabel: string;
  weatherLabelField: string;
  specialOfferLabel: string;
  yesLabel: string;
  noLabel: string;
  generatePrepPlanBtn: string;
  continueBtn: string;
  backBtn: string;
  step1SelectMeals: string;
  step2MealDetails: string;
  step3CommonConditions: string;
  errorSelectAtLeastOneMeal: string;
  errorExpectedCustomersZero: string;
  errorAdvanceBookingsExceed: string;
  errorHolidayNameRequired: string;
  errorFestivalRequired: string;
  prepPlanSummaryTemplate: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    brandName: 'MealMind AI',
    brandTagline: 'Precision Food Demand Forecasting & Kitchen Preparation Engine',
    navDashboard: 'Dashboard',
    navNewPlan: 'New Plan',
    navHistory: 'Past Plans',
    navModelSpecs: 'ML Pipeline Architecture',
    login: 'Manager Login',
    signup: 'Create Account',
    logout: 'Sign Out',
    demoLogin: 'Quick Demo Access',
    managerPortal: 'Hospitality Management Portal',
    executiveChef: 'Executive Chef & Operations',
    welcomeBack: 'Welcome back',

    // Landing
    heroBadge: 'Hotel & Restaurant Culinary Intelligence',
    heroTitle1: 'Forecast food demand with',
    heroTitleHighlight: 'Random Forest precision',
    heroSubtitle: 'Eliminate costly buffet overproduction and kitchen shortages. Designed specifically for hotel food & beverage directors, executive chefs, and restaurant managers.',
    ctaStartPlanning: 'Start Meal Planning Workflow',
    ctaExploreDashboard: 'Open Operations Dashboard',
    keyFeature1Title: 'Target Demand Precision',
    keyFeature1Desc: 'Predicts exact preparation quantities for each menu item to eliminate buffet overproduction and food waste.',
    keyFeature2Title: 'Hospitality Factor Grounding',
    keyFeature2Desc: 'Integrates customer bookings, advance reservations, weather conditions, holidays, festivals, and promotional offers.',
    keyFeature3Title: 'Multi-Service Support',
    keyFeature3Desc: 'Specialized menu configurations for Executive Breakfast buffets, Grand Lunch spreads, and Fine-Dining Dinners.',
    modelNoticeTitle: 'Random Forest Model Ready',
    modelNoticeDesc: 'Structured to accept trained Random Forest regression pipelines based on multi-variate hospitality operational features.',

    // Dashboard
    todayOverview: "Today's Service Overview",
    serviceShift: 'Active Shift',
    hotelOccupancy: 'Room Occupancy',
    expectedDiners: 'Projected Diners',
    activeMealSlot: 'Target Service',
    wasteReductionRate: 'Food Waste Avoided',
    recentPlansTitle: 'Recent Meal Preparation Plans',
    noRecentPlans: 'No recent plans created yet. Launch your first workflow.',
    quickPlanAction: 'Create New Meal Plan',
    breakfastService: 'Breakfast',
    lunchService: 'Lunch',
    dinnerService: 'Dinner',
    kitchenStatus: 'Kitchen Readiness',
    readyForExecution: 'Ready for Prep',
    inPreparation: 'In Production',
    completed: 'Service Completed',
    viewDetails: 'View Plan Details',
    actionRequired: 'Action Required',
    shiftMorning: 'Morning Shift (06:00 - 11:30)',
    shiftAfternoon: 'Afternoon Shift (11:30 - 16:30)',
    shiftEvening: 'Evening Shift (17:00 - 23:30)',

    // Guided Workflow
    workflowTitle: 'Guided Meal Planning Workflow',
    step1Title: 'Service & Schedule',
    step1Subtitle: 'Date, meal timing, and dining format',
    step2Title: 'Guest Demand Parameters',
    step2Subtitle: 'Occupancy rate, in-house guests & walk-ins',
    step3Title: 'Menu & Dish Selection',
    step3Subtitle: 'Choose offerings for this meal slot',
    step4Title: 'Forecasting Parameters',
    step4Subtitle: 'Safety margins and model confidence',
    step5Title: 'Review & Model Inference',
    step5Subtitle: 'Verify parameters before computing prep quantities',

    nextStep: 'Continue to Next Step',
    prevStep: 'Back',
    generatePlan: 'Compute Preparation Quantities',
    backToDashboard: 'Return to Dashboard',

    // Form fields & steps
    selectDate: 'Service Date',
    mealSlotLabel: 'Meal Slot',
    serviceTypeLabel: 'Service Format',
    buffetOption: 'Grand Buffet Spread',
    alacarteOption: 'À la Carte Dining',
    banquetOption: 'Banquet & Private Dining',
    roomServiceOption: 'All-Day Dining / Room Service',
    occupancyLabel: 'Hotel Room Occupancy (%)',
    inHouseGuestsLabel: 'In-House Registered Guests',
    walkInLabel: 'Estimated Walk-in Diners',
    banquetDelegatesLabel: 'Banquet & Event Attendees',
    dayTypeLabel: 'Day Type & Seasonality',
    weekdayOption: 'Standard Weekday (Mon - Thu)',
    weekendOption: 'High-Volume Weekend (Fri - Sun)',
    festivalOption: 'Festival / Peak Holiday Event',
    weatherLabel: 'Weather Condition',
    weatherNormal: 'Normal',
    weatherHot: 'Hot',
    weatherRainy: 'Rainy',
    weatherCloudy: 'Cloudy',
    bufferMarginLabel: 'Safety Buffer Margin (%)',
    bufferMarginHelp: 'Protects against sudden guest surges while maintaining zero-shortage standards',

    // Menu Selection
    menuSelectTitle: 'Select Dishes for Preparation',
    menuSelectSubtitle: 'Select menu items to generate recommended batch cooking quantities',
    filterAll: 'All Categories',
    selectedItemsCount: 'dishes selected',
    prepTime: 'Prep Time',
    portionUnit: 'Unit',
    dietaryVeg: 'Vegetarian',
    dietaryNonVeg: 'Non-Vegetarian',
    dietaryVegan: 'Vegan',
    dietaryJain: 'Jain Friendly',
    selectAll: 'Select All in Category',
    deselectAll: 'Deselect All',

    // Plan Results
    planResultTitle: 'Kitchen Preparation & Portion Plan',
    planResultSubtitle: 'Targeted preparation quantities generated for kitchen execution',
    mlModelBadge: 'Random Forest Model v2.4 (Active)',
    rfArchitectureNotice: 'Calculated using Random Forest multivariate regressors with historical banquet & occupancy weights.',
    totalGuestsCard: 'Total Projected Diners',
    prepItemsCard: 'Scheduled Dishes',
    printPrepSheet: 'Print Kitchen Prep Sheet',
    saveToArchive: 'Save to Operations Log',
    dispatchToKitchen: 'Dispatch to Executive Chef',
    chefApproval: 'Executive Chef Sign-Off',
    chefApprovedNotice: 'Plan approved by Executive Chef on duty. Ready for kitchen stations.',
    itemCol: 'Dish / Recipe',
    categoryCol: 'Category',
    portionsCol: 'Target Portions',
    quantityCol: 'Total Recommended Quantity',
    bufferCol: 'Safety Buffer',
    chefNotesPlaceholder: 'Add kitchen instructions, allergen alerts, or special station assignments...',
    chefNotesTitle: 'Kitchen Dispatch Notes',

    // ML Specs Modal
    mlModalTitle: 'Random Forest Machine Learning Architecture',
    mlModalSubtitle: 'Technical blueprint and feature vector pipeline for food demand forecasting',
    featureInputsTitle: 'Primary Feature Input Vectors',
    targetOutputTitle: 'Model Target Outputs',
    closeBtn: 'Close Specifications',

    // Meal Selection on Dashboard
    selectMealsPrompt: 'Select meal services for daily kitchen preparation and demand forecasting.',
    startPlanning: 'Start Planning',
    selectedMeals: 'Selected Services',
    noMealsSelected: 'Select at least one meal to begin planning',
    allThreeMeals: 'All Services (Breakfast, Lunch, Dinner)',
    breakfastDesc: 'Morning service · 06:30 – 10:30',
    lunchDesc: 'Midday service · 12:00 – 15:30',
    dinnerDesc: 'Evening service · 19:00 – 23:30',
    planForMeals: 'Plan Preparation for',
    recentPlansEmpty: 'No preparation plans generated yet. Select a service above to create the day\'s first plan.',
    plannedServices: 'Services Planned',

    // Core 3-Step Guided Workflow
    expectedCustomersLabel: 'Expected Customers',
    advanceBookingsLabel: 'Advance Bookings',
    isHolidayLabel: 'Is it a Holiday?',
    holidayNameLabel: 'Holiday Name',
    holidayNamePlaceholder: 'e.g., National Day, Diwali Holiday, New Year',
    isFestivalLabel: 'Is there a Festival?',
    festivalNameLabel: 'Festival Name',
    festivalNamePlaceholder: 'e.g., Pongal, Eid, Diwali, Christmas',
    festivalTypeLabel: 'Festival Type',
    specialEventLabel: 'Special Event',
    weatherLabelField: 'Weather Condition',
    specialOfferLabel: 'Special Promotional Offer Active?',
    yesLabel: 'Yes',
    noLabel: 'No',
    generatePrepPlanBtn: 'Generate Preparation Plan',
    continueBtn: 'Continue',
    backBtn: 'Back',
    step1SelectMeals: 'Select Meals',
    step2MealDetails: 'Meal Details',
    step3CommonConditions: 'Common Conditions',
    errorSelectAtLeastOneMeal: 'Please select at least one meal to continue.',
    errorExpectedCustomersZero: 'Expected customers must be greater than 0.',
    errorAdvanceBookingsExceed: 'Advance bookings cannot exceed expected customers.',
    errorHolidayNameRequired: 'Please enter the holiday name.',
    errorFestivalRequired: 'Please provide the festival name and select its type.',
    prepPlanSummaryTemplate: 'Preparation plan generated for {count} expected customers.',
  },
  ta: {
    brandName: 'மீல்மைண்ட் AI',
    brandTagline: 'ஹோட்டல் & உணவகங்களுக்கான உணவுத் தேவை முன்கணிப்பு மற்றும் சமையல் திட்டமிடல் தளம்',
    navDashboard: 'டாஷ்போர்டு',
    navNewPlan: 'புதிய திட்டம்',
    navHistory: 'முந்தைய திட்டங்கள்',
    navModelSpecs: 'ML மாதிரி கட்டமைப்பு',
    login: 'மேலாளர் உள்நுழைவு',
    signup: 'பதிவு செய்க',
    logout: 'வெளியேறு',
    demoLogin: 'டெமோ நேரடி அணுகல்',
    managerPortal: 'ஹோட்டல் மேலாண்மை தளம்',
    executiveChef: 'தலைமை செஃப் & செயல்பாடுகள்',
    welcomeBack: 'மீண்டும் நல்வரவு',

    // Landing
    heroBadge: 'ஹோட்டல் சமையலறை நுண்ணறிவு தளம்',
    heroTitle1: 'உணவுத் தேவையை துல்லியமாக கணிக்க',
    heroTitleHighlight: 'ரேண்டம் ஃபாரஸ்ட் துல்லியம்',
    heroSubtitle: 'உணவு வீணாவதைத் தடுத்து, சமையலறை பற்றாக்குறையை முற்றிலும் ஒழிக்க உதவும் அதிநவீன AI உணவு மேலாண்மை தளம்.',
    ctaStartPlanning: 'உணவு திட்டமிடலைத் தொடங்குக',
    ctaExploreDashboard: 'டாஷ்போர்டைத் திறக்க',
    keyFeature1Title: 'துல்லிய உணவு தயாரிப்பு அளவு',
    keyFeature1Desc: 'ஒவ்வொரு உணவுப் பொருளுக்கும் தேவையான துல்லிய தயாரிப்பு அளவைக் கணித்து உணவு விரயத்தை முற்றிலும் குறைக்கிறது.',
    keyFeature2Title: 'ஹோட்டல் தேவைக் காரணிகள்',
    keyFeature2Desc: 'அறை முன்பதிவு, வெளி விருந்தினர்கள், சுபநிகழ்ச்சிகள், வானிலை மற்றும் விடுமுறை நாட்களை அடிப்படையாகக் கொண்டது.',
    keyFeature3Title: 'அனைத்து வேளைகளுக்கான ஆதரவு',
    keyFeature3Desc: 'காலை உணவு, மதிய உணவு மற்றும் இரவு உணவுக்கான பிரத்யேக உணவுப் பட்டியல் மற்றும் அளவு கணிப்பு.',
    modelNoticeTitle: 'ரேண்டம் ஃபாரஸ்ட் மாதிரி தயார்நிலை',
    modelNoticeDesc: 'ஹோட்டல் செயல்பாட்டுத் தரவுகளுடன் பயிற்சி பெற்ற ரேண்டம் ஃபாரஸ்ட் ML மாதிரியுடன் இணைக்கும் கட்டமைப்பு.',

    // Dashboard
    todayOverview: 'இன்றைய சேவை நிலவரம்',
    serviceShift: 'தற்போதைய ஷிப்ட்',
    hotelOccupancy: 'அறை முன்பதிவு விகிதம்',
    expectedDiners: 'எதிர்பார்க்கப்படும் விருந்தினர்கள்',
    activeMealSlot: 'உணவு வேளை',
    wasteReductionRate: 'உணவு விரயம் குறைப்பு',
    recentPlansTitle: 'சமீபத்திய உணவு திட்டங்கள்',
    noRecentPlans: 'இன்னும் திட்டங்கள் உருவாக்கப்படவில்லை. முதல் திட்டத்தை துவங்குங்கள்.',
    quickPlanAction: 'புதிய திட்டம் உருவாக்குக',
    breakfastService: 'காலை உணவு',
    lunchService: 'மதிய உணவு',
    dinnerService: 'இரவு உணவு',
    kitchenStatus: 'சமையலறை தயார்நிலை',
    readyForExecution: 'தயாரிப்புக்குத் தயார்',
    inPreparation: 'சமையல் நடைபெறுகிறது',
    completed: 'சேவை முடிந்தது',
    viewDetails: 'விவரங்களை காண்க',
    actionRequired: 'கவனம் தேவை',
    shiftMorning: 'காலை ஷிப்ட் (06:00 - 11:30)',
    shiftAfternoon: 'மதிய ஷிப்ட் (11:30 - 16:30)',
    shiftEvening: 'மாலை ஷிப்ட் (17:00 - 23:30)',

    // Guided Workflow
    workflowTitle: 'வழிகாட்டப்பட்ட உணவு திட்டமிடல்',
    step1Title: 'சேவை & அட்டவணை',
    step1Subtitle: 'தேதி, உணவு வேளை மற்றும் சேவை வடிவம்',
    step2Title: 'விருந்தினர் தேவை அளவுருக்கள்',
    step2Subtitle: 'அறை முன்பதிவு, தங்கியுள்ளோர் & வெளி விருந்தினர்கள்',
    step3Title: 'உணவு & மெனு தேர்வு',
    step3Subtitle: 'இந்த வேளைக்கான உணவு வகைகளைத் தேர்ந்தெடுக்கவும்',
    step4Title: 'முன்கணிப்பு அளவுருக்கள்',
    step4Subtitle: 'பாதுகாப்பு வரம்பு மற்றும் ML அமைப்புகள்',
    step5Title: 'மதிப்பாய்வு & அளவு கணிப்பு',
    step5Subtitle: 'சமையல் அளவுகளை கணக்கிடுவதற்கு முன் சரிபார்க்கவும்',

    nextStep: 'அடுத்த படிக்குச் செல்க',
    prevStep: 'பின்செல்',
    generatePlan: 'சமையல் அளவுகளை கணக்கிடு',
    backToDashboard: 'டாஷ்போர்டுக்கு திரும்பு',

    // Form fields & steps
    selectDate: 'சேவை தேதி',
    mealSlotLabel: 'உணவு வேளை',
    serviceTypeLabel: 'சேவை முறை',
    buffetOption: 'கிராண்ட் பஃபே (Buffet)',
    alacarteOption: 'ஆ ல கார்ட் (À la Carte)',
    banquetOption: 'விருந்து அரங்கம் (Banquet)',
    roomServiceOption: 'அறை சேவை (Room Service)',
    occupancyLabel: 'ஹோட்டல் அறை முன்பதிவு (%)',
    inHouseGuestsLabel: 'ஹோட்டலில் தங்கியுள்ள விருந்தினர்கள்',
    walkInLabel: 'எதிர்பார்க்கப்படும் வெளி விருந்தினர்கள்',
    banquetDelegatesLabel: 'நிகழ்ச்சி / கூட்ட விருந்தினர்கள்',
    dayTypeLabel: 'நாள் வகை & சீசன்',
    weekdayOption: 'வழக்கமான வார நாள் (திங்கள் - வியாழன்)',
    weekendOption: 'அதிக கூட்டம் உள்ள வார இறுதி (வெள்ளி - ஞாயிறு)',
    festivalOption: 'திருவிழா / விடுமுறை சிறப்பு தினம்',
    weatherLabel: 'வானிலை நிலை',
    weatherNormal: 'இயல்பு (Normal)',
    weatherHot: 'வெப்பம் (Hot)',
    weatherRainy: 'மழை (Rainy)',
    weatherCloudy: 'மேகமூட்டம் (Cloudy)',
    bufferMarginLabel: 'பாதுகாப்பு கூடுதல் அளவு (%)',
    bufferMarginHelp: 'திடீர் கூட்டத்தை சமாளிக்கவும் பற்றாக்குறையைத் தவிர்க்கவும் உதவும்',

    // Menu Selection
    menuSelectTitle: 'தயாரிப்பிற்கான உணவுகளைத் தேர்வு செய்க',
    menuSelectSubtitle: 'தேவைப்படும் உணவுப் பொருட்களைத் தேர்ந்தெடுத்து சமையல் அளவுகளை அறியவும்',
    filterAll: 'அனைத்து பிரிவுகள்',
    selectedItemsCount: 'உணவுகள் தேர்ந்தெடுக்கப்பட்டுள்ளன',
    prepTime: 'சமையல் நேரம்',
    portionUnit: 'அலகு',
    dietaryVeg: 'சைவம்',
    dietaryNonVeg: 'அசைவம்',
    dietaryVegan: 'வீகன்',
    dietaryJain: 'சைன உணவு',
    selectAll: 'அனைத்தையும் தேர்ந்தெடு',
    deselectAll: 'நீக்கு',

    // Plan Results
    planResultTitle: 'சமையலறை தயாரிப்பு & அளவு திட்டம்',
    planResultSubtitle: 'சமையலறை பயன்பாட்டிற்காக கணக்கிடப்பட்ட துல்லிய அளவுகள்',
    mlModelBadge: 'ரேண்டம் ஃபாரஸ்ட் மாடல் v2.4 (செயலில்)',
    rfArchitectureNotice: 'கடந்த கால நுகர்வு மற்றும் விருந்தினர் தரவுகளின் அடிப்படையில் கணக்கிடப்பட்டது.',
    totalGuestsCard: 'மொத்த விருந்தினர்கள்',
    prepItemsCard: 'திட்டமிடப்பட்ட உணவுகள்',
    printPrepSheet: 'சமையல் தாளை அச்சிடு (Print Sheet)',
    saveToArchive: 'திட்டத்தை சேமிக்க',
    dispatchToKitchen: 'சமையலறைக்கு அனுப்புக',
    chefApproval: 'தலைமை செஃப் ஒப்புதல்',
    chefApprovedNotice: 'தலைமை செஃப் ஒப்புதல் வழங்கியுள்ளார். சமையலறை தயாரிப்புக்கு தயார்.',
    itemCol: 'உணவுப் பெயர்',
    categoryCol: 'பிரிவு',
    portionsCol: 'விருந்தினர் பங்கும் அளவு',
    quantityCol: 'மொத்த பரிந்துரை அளவு',
    bufferCol: 'கூடுதல் பாதுகாப்பு',
    chefNotesPlaceholder: 'சமையல் குறிப்புகள், ஒவ்வாமை எச்சரிக்கைகள் அல்லது சிறப்பு வழிமுறைகளை உள்ளிடவும்...',
    chefNotesTitle: 'சமையலறை வழிமுறைகள்',

    // ML Specs Modal
    mlModalTitle: 'ரேண்டம் ஃபாரஸ்ட் இயந்திர கற்றல் கட்டமைப்பு',
    mlModalSubtitle: 'உணவு தேவை கணிப்புக்கான தொழில்நுட்ப வடிவமைப்பு மற்றும் அம்சங்கள்',
    featureInputsTitle: 'முக்கிய உள்ளீட்டு அம்சங்கள் (Feature Inputs)',
    targetOutputTitle: 'கணிப்பு வெளியீடுகள் (Model Outputs)',
    closeBtn: 'மூடுக',

    // Meal Selection on Dashboard
    selectMealsPrompt: 'சமையல் தயாரிப்பு மற்றும் தேவை திட்டமிடலை தொடங்க உணவு சேவைகளைத் தேர்ந்தெடுக்கவும்.',
    startPlanning: 'திட்டமிடத் தொடங்குங்கள்',
    selectedMeals: 'தேர்ந்தெடுக்கப்பட்ட சேவைகள்',
    noMealsSelected: 'தொடங்குவதற்கு குறைந்தபட்சம் ஒரு சேவையைத் தேர்ந்தெடுக்கவும்',
    allThreeMeals: 'அனைத்து சேவைகளும் (காலை, மதியம், இரவு)',
    breakfastDesc: 'காலை உணவு சேவை · 06:30 – 10:30',
    lunchDesc: 'மதிய உணவு சேவை · 12:00 – 15:30',
    dinnerDesc: 'இரவு உணவு சேவை · 19:00 – 23:30',
    planForMeals: 'சமையல் தயாரிப்பை திட்டமிடு',
    recentPlansEmpty: 'இன்னும் சமையல் திட்டங்கள் உருவாக்கப்படவில்லை. மேலே சேவையைத் தேர்ந்தெடுத்து முதல் திட்டத்தை உருவாக்கவும்.',
    plannedServices: 'திட்டமிடப்பட்ட சேவைகள்',

    // Core 3-Step Guided Workflow
    expectedCustomersLabel: 'எதிர்பார்க்கப்படும் வாடிக்கையாளர்கள்',
    advanceBookingsLabel: 'முன்பதிவுகள் (Advance Bookings)',
    isHolidayLabel: 'விடுமுறை தினமா?',
    holidayNameLabel: 'விடுமுறை பெயர்',
    holidayNamePlaceholder: 'எ.கா: தேசிய விடுமுறை, தீபாவளி விடுமுறை',
    isFestivalLabel: 'திருவிழா உள்ளதா?',
    festivalNameLabel: 'திருவிழா பெயர்',
    festivalNamePlaceholder: 'எ.கா: பொங்கல், தீபாவளி, ரம்ஜான், கிறிஸ்துமஸ்',
    festivalTypeLabel: 'திருவிழா வகை',
    specialEventLabel: 'சிறப்பு நிகழ்வு (Special Event)',
    weatherLabelField: 'வானிலை நிலை',
    specialOfferLabel: 'சிறப்புச் சலுகை உள்ளதா?',
    yesLabel: 'ஆம் (Yes)',
    noLabel: 'இல்லை (No)',
    generatePrepPlanBtn: 'தயாரிப்பு திட்டத்தை உருவாக்குக',
    continueBtn: 'தொடர்க (Continue)',
    backBtn: 'பின்செல் (Back)',
    step1SelectMeals: 'உணவு தேர்வு',
    step2MealDetails: 'உணவு விபரங்கள்',
    step3CommonConditions: 'பொது நிபந்தனைகள்',
    errorSelectAtLeastOneMeal: 'தொடங்குவதற்கு குறைந்தபட்சம் ஒரு உணவைத் தேர்ந்தெடுக்கவும்.',
    errorExpectedCustomersZero: 'எதிர்பார்க்கப்படும் வாடிக்கையாளர்கள் எண்ணிக்கை 0-ஐ விட அதிகமாக இருக்க வேண்டும்.',
    errorAdvanceBookingsExceed: 'முன்பதிவுகள் எண்ணிக்கை வாடிக்கையாளர் எண்ணிக்கையை விட அதிகமாக இருக்க முடியாது.',
    errorHolidayNameRequired: 'விடுமுறை பெயரை உள்ளிடவும்.',
    errorFestivalRequired: 'திருவிழா பெயர் மற்றும் வகையை குறிப்பிடவும்.',
    prepPlanSummaryTemplate: '{count} வாடிக்கையாளர்களுக்கான சமையல் தயாரிப்பு திட்டம் உருவாக்கப்பட்டது.',
  },
};

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type CuisineType =
  | 'cantonese-teochew'
  | 'peranakan'
  | 'hainanese'
  | 'malay'
  | 'indian'
  | 'western';

export type DietaryRestriction =
  | 'low-sodium'
  | 'diabetic-safe'
  | 'dysphagia-soft'
  | 'low-purine'
  | 'renal-safe'
  | 'lactose-free'
  | 'halal'
  | 'vegetarian';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'supper';

export type TextureLevel =
  | 'Level 7: Easy to Chew'
  | 'Level 6: Soft & Bite-Sized (15mm max)'
  | 'Level 5: Minced & Moist (4mm max)'
  | 'Level 4: Pureed & Smooth';

export type GrocerId = 'fairprice' | 'redmart' | 'coldstorage' | 'shengsiong';

export interface GrocerOption {
  id: GrocerId;
  name: string;
  tagline: string;
  deliveryTime: string;
  freeDeliveryThreshold: number;
  searchUrlTemplate: string;
  homeUrl: string;
}

export interface ElderlyProfileState {
  elderlyCount: number;
  primaryCuisines: CuisineType[];
  restrictions: DietaryRestriction[];
  activeMealSlots: MealSlot[];
  budgetPerMeal: number; // in SGD
  textureLevel: TextureLevel;
  chewingAssistanceRequired: boolean;
  selectedGrocer: GrocerId;
  activeDays: DayOfWeek[];
}

export interface RecipeIngredient {
  name: string;
  baseAmountPerPax: number;
  unit: string;
  category: 'produce' | 'protein' | 'pantry' | 'grains';
  singaporeSearchTerm: string;
  estimatedPricePerPaxSgd: number;
  elderlyPreparationTip?: string;
}

export interface ElderlyNutritionInfo {
  calories: number;
  proteinGrams: number;
  calciumMg: number;
  sodiumMg: number;
  potassiumMg: number;
  dietaryFiberGrams: number;
  glycemicIndexTier: 'Low' | 'Medium';
}

export interface CaregiverPrepTips {
  deboningAdvice: string;
  textureModification: string;
  steamingOrSimmerTime: string;
  swallowingSafetyTip: string;
  domesticHelperTip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  chineseTitle?: string;
  subtitle: string;
  mealSlot: MealSlot;
  cuisine: CuisineType;
  prepMinutes: number;
  image: string;
  textureLevel: TextureLevel;
  dietaryBadges: string[];
  elderlyNutrition: ElderlyNutritionInfo;
  estimatedCostPerPaxSgd: number;
  ingredients: RecipeIngredient[];
  caregiverTips: CaregiverPrepTips;
  cookingSteps: string[];
  singaporeGrocerRecommendation: string;
}

export interface WeeklyScheduleDay {
  day: DayOfWeek;
  dateLabel: string;
  meals: {
    [key in MealSlot]?: Recipe;
  };
}

export interface ConsolidatedCartItem {
  id: string;
  name: string;
  totalQuantity: string;
  category: 'produce' | 'protein' | 'pantry' | 'grains';
  estimatedCostSgd: number;
  singaporeSearchTerm: string;
  usedInMeals: Array<{ day: DayOfWeek; mealSlot: MealSlot; recipeTitle: string }>;
  helperNotes?: string;
}

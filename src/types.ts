export type HouseholdPresetId = 'solo' | 'couples' | 'small-family' | 'big-table';

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type DishStyle = '1-Dish Wonder' | '2-Dish Balanced' | '3-Dish Family Feast';

export type GrocerId = 'fairprice' | 'redmart' | 'coldstorage' | 'amazonfresh';

export interface GrocerOption {
  id: GrocerId;
  name: string;
  tagline: string;
  iconName: string;
  freeDeliveryThreshold: number;
}

export interface ProfileState {
  adults: number;
  kids: number;
  activePreset: HouseholdPresetId | 'custom';
  activeDays: DayOfWeek[];
  dishStyle: DishStyle;
  pacingConstraints: string[];
  eatingStyles: string[];
  allergies: string[];
  dislikes: string[];
  grocer: GrocerId;
  budgetMidpoint: number;
  calorieTarget: number;
  proteinTarget: number;
  carbPreference: 'balanced' | 'low' | 'complex';
  sodiumPreference: 'normal' | 'low-sodium' | 'no-msg';
}

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  dishStyle: DishStyle;
  prepMinutes: number;
  proteinGrams: number;
  calories: number;
  image: string;
  dietTags: string[];
  mainDish: string;
  sideDish?: string;
  soupDish?: string;
  ingredients: {
    name: string;
    amount: string;
    category: 'produce' | 'protein' | 'pantry' | 'bakery';
    zeroWasteNote?: string;
  }[];
  instructions: string[];
  singaporeTip?: string;
}

export interface MealPlanDay {
  day: DayOfWeek;
  recipe: Recipe;
  servings: number;
  adultCount: number;
  kidCount: number;
  zeroWasteLink: string;
}

export interface CartItem {
  id: string;
  name: string;
  quantity: string;
  estimatedPriceSgd: number;
  category: 'produce' | 'protein' | 'pantry';
  alreadyInPantry: boolean;
  usedInDays: DayOfWeek[];
  zeroWasteSharedWith?: string;
}

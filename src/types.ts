export type SupermarketId = 'fairprice' | 'redmart' | 'coldstorage' | 'shengsiong' | 'scoop';

export interface Supermarket {
  id: SupermarketId;
  name: string;
  tagline: string;
  badgeBg: string;
  badgeText: string;
  minOrderSgd: number;
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  nextAvailableSlot: string;
  logoIcon: string;
}

export type SuitabilityRating = 'matches' | 'check_needed' | 'not_suitable' | 'insufficient_info';

export interface SuitabilityAnalysis {
  status: SuitabilityRating;
  title: string;
  summary: string;
  matchingPoints: string[];
  warningPoints: string[];
  conflictPoints: string[];
  isMedicallyCritical: boolean;
}

export interface NutritionFacts {
  servingSize: string;
  calories: number;
  proteinG: number;
  totalCarbG: number;
  sugarsG: number;
  dietaryFiberG?: number;
  sodiumMg: number;
  potassiumMg?: number;
  phosphorusMg?: number;
  saturatedFatG?: number;
  glycemicIndex?: 'Low' | 'Medium' | 'High';
}

export interface RetailerPrice {
  supermarketId: SupermarketId;
  priceSgd: number;
  originalPriceSgd?: number;
  unitPrice: string; // e.g. "$0.85 / 100g"
  inStock: boolean;
  stockLevel: 'In Stock' | 'Low Stock (Only 2 left)' | 'Out of Stock';
  lastUpdated: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  packSize: string;
  category: 'Pantry & Sauces' | 'Fresh Produce' | 'Proteins & Seafood' | 'Dairy & Plant Mylks' | 'Grains & Bakery' | 'Snacks & Beverages' | 'Elderly & Special Care';
  image: string;
  description: string;
  ingredientsList: string[];
  declaredAllergens: string[];
  precautionaryStatements: string[]; // e.g. ["May contain traces of peanuts", "Manufactured in a facility that processes soy"]
  nutritionFacts: NutritionFacts;
  healthBadges: string[]; // e.g. ["Healthier Choice (Lower Sodium)", "Low GI Verified", "No Added Sugar", "Halal"]
  retailers: RetailerPrice[];
  dataQuality: {
    isVerified: boolean;
    verifiedBy: string;
    lastAudited: string;
    missingFields?: string[];
  };
}

export interface HouseholdMemberProfile {
  id: string;
  name: string;
  relationship: 'Self' | 'Parent / Elderly' | 'Child' | 'Partner' | 'Other';
  avatarColor: string;
  isPrimary: boolean;
  // Diagnosed medical requirements vs preferences
  allergies: string[]; // e.g. Peanuts, Tree Nuts, Dairy, Eggs, Soy, Gluten, Shellfish, Fish, Sesame
  intolerances: string[]; // e.g. Lactose, Gluten, FODMAP, Histamine
  healthConditions: string[]; // e.g. Type 2 Diabetes (Low GI), Hypertension (Low Sodium), High Cholesterol (Heart Healthy), Kidney Care (Low Potassium & Phosphorus), Gout (Low Purine)
  dietaryPreferences: string[]; // e.g. Vegetarian, Vegan, Halal, High Protein, Mediterranean, Low Carb
  ingredientsToAvoid: string[]; // e.g. MSG, Palm Oil, Aspartame, High Fructose Corn Syrup, Raw Cilantro
  nutritionalGoals: {
    maxSodiumMgPerServing?: number;
    maxSugarGramsPer100g?: number;
    minProteinGramsPerServing?: number;
    maxSaturatedFatGrams?: number;
  };
  substitutionPolicy: 'strict-approval-only' | 'dietary-equivalent-auto' | 'no-substitutes';
  caregiverNotes?: string;
}

export interface BasketItem {
  productId: string;
  product: Product;
  selectedRetailerId: SupermarketId;
  quantity: number;
  forProfileId: string;
  userNotes?: string;
}

export interface DeliveryAddress {
  id: string;
  label: string; // e.g. "Mum & Dad's Flat (Bishan)", "Home (Tampines)"
  recipientName: string;
  phone: string;
  addressLine1: string;
  postalCode: string;
  unitNumber: string;
  isDefault: boolean;
  specialInstructions?: string; // e.g. "Elderly resident. Please knock loudly or call. Do not leave on doorstep."
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  packSize: string;
  image: string;
  priceSgd: number;
  quantity: number;
  retailerId: SupermarketId;
  suitabilityStatus: SuitabilityRating;
}

export interface RetailerSubOrder {
  retailerId: SupermarketId;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  deliverySlot: string;
  status: 'Packing' | 'Driver Assigned' | 'Out for Delivery' | 'Delivered';
  estimatedArrival: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  subOrders: RetailerSubOrder[];
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  overallStatus: 'Confirmed' | 'In Progress' | 'Delivered' | 'Cancelled';
}

export interface SavedList {
  id: string;
  title: string;
  description: string;
  forProfileId: string;
  productIds: string[];
  icon: string;
}

export interface DietaryRecipe {
  id: string;
  title: string;
  subtitle: string;
  prepMinutes: number;
  servings: number;
  image: string;
  suitableProfiles: string[];
  nutritionPerServing: {
    calories: number;
    sodiumMg: number;
    sugarsG: number;
    proteinG: number;
    carbsG: number;
    potassiumMg?: number;
  };
  ingredients: {
    name: string;
    amount: string;
    matchedProductId?: string;
    dietarySafetyNote: string;
  }[];
  instructions: string[];
  clinicalDietitianTip: string;
}

export type ActiveTab = 'home' | 'discover' | 'recipes' | 'basket' | 'saved-orders' | 'profile' | 'talk-to-us';

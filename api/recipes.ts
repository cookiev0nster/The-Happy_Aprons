import type { Request, Response } from 'express';

export interface UsdaNutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface MealDbRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface EnrichedRecipeResponse {
  success: boolean;
  timestamp: string;
  query: {
    ingredient: string;
    nutritionQuery: string;
    mealSlot?: string;
    cuisine?: string;
    restriction?: string;
    elderlyCount?: number;
    pageSize: number;
  };
  sources: {
    theMealDbEndpoint: string;
    usdaEndpoint: string;
  };
  meals: MealDbRecipe[];
  usdaNutrition: {
    status: 'connected' | 'unconfigured' | 'error';
    query: string;
    totalHits?: number;
    foods: Array<{
      fdcId: number;
      description: string;
      brandOwner?: string;
      nutrients: Record<string, { value: number; unit: string }>;
    }>;
    message?: string;
    error?: string;
  };
  singaporeElderlyInsights?: {
    textureGuidance: string;
    chewingSafetyNote: string;
    localSupermarketAvailability: string[];
  };
}

export async function fetchMealDbRecipes(ingredient: string): Promise<MealDbRecipe[]> {
  const formattedIng = ingredient.trim().replace(/\s+/g, '_').toLowerCase();
  const endpoint = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(formattedIng)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        accept: 'application/json',
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`TheMealDB HTTP ${res.status}: ${res.statusText}`);
    }

    const data: any = await res.json();
    return Array.isArray(data?.meals) ? data.meals : [];
  } catch (err) {
    console.warn(`[TheMealDB] Failed to fetch recipes for "${ingredient}":`, err);
    return [];
  }
}

export async function fetchUsdaNutrition(query: string, pageSize = 5): Promise<{
  status: 'connected' | 'unconfigured' | 'error';
  foods: any[];
  totalHits?: number;
  message?: string;
  error?: string;
}> {
  const apiKey = (process.env.DATA_GOV_KEY || '').trim();
  const endpointTemplate = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar&pageSize=5&api_key=<DATA_GOV_KEY>';

  // If no key is set yet, do not use any fallback key
  if (!apiKey) {
    return {
      status: 'unconfigured',
      foods: [],
      totalHits: 0,
      message: 'DATA_GOV_KEY environment variable is not configured yet. Set DATA_GOV_KEY in your environment to fetch live USDA FoodData Central records.',
    };
  }

  const endpoint = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
    query
  )}&pageSize=${pageSize}&api_key=${encodeURIComponent(apiKey)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        AccountKey: apiKey,
      },
    });

    clearTimeout(timeout);

    if (res.status === 429) {
      return {
        status: 'error',
        foods: [],
        error: 'USDA rate limit exceeded for the provided DATA_GOV_KEY.',
      };
    }

    if (!res.ok) {
      return {
        status: 'error',
        foods: [],
        error: `USDA API HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data: any = await res.json();
    const rawFoods: any[] = Array.isArray(data?.foods) ? data.foods : [];

    const formattedFoods = rawFoods.map((f: any) => {
      const nutrients: Record<string, { value: number; unit: string }> = {};
      if (Array.isArray(f.foodNutrients)) {
        for (const n of f.foodNutrients) {
          const name = n.nutrientName || n.nutrient?.name;
          const value = n.value ?? n.amount;
          const unit = n.unitName || n.nutrient?.unitName || '';
          if (name && value !== undefined) {
            nutrients[name] = { value: Number(value), unit };
          }
        }
      }
      return {
        fdcId: f.fdcId,
        description: f.description,
        brandOwner: f.brandOwner || f.brandName,
        nutrients,
      };
    });

    return {
      status: 'connected',
      foods: formattedFoods,
      totalHits: data.totalHits,
    };
  } catch (err: any) {
    return {
      status: 'error',
      foods: [],
      error: err?.message || 'Connection to USDA FoodData Central failed',
    };
  }
}

export default async function recipesHandler(req: Request, res: Response) {
  const ingredient = (req.query.ingredient as string) || (req.query.i as string) || 'chicken_breast';
  const nutritionQuery = (req.query.nutritionQuery as string) || (req.query.query as string) || 'tofu';
  const mealSlot = (req.query.mealSlot as string) || undefined;
  const cuisine = (req.query.cuisine as string) || undefined;
  const restriction = (req.query.restriction as string) || undefined;
  const elderlyCount = parseInt(req.query.elderlyCount as string, 10) || 2;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 5;

  const [meals, usdaResult] = await Promise.all([
    fetchMealDbRecipes(ingredient),
    fetchUsdaNutrition(nutritionQuery, pageSize),
  ]);

  const responsePayload: EnrichedRecipeResponse = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
      ingredient,
      nutritionQuery,
      mealSlot,
      cuisine,
      restriction,
      elderlyCount,
      pageSize,
    },
    sources: {
      theMealDbEndpoint: `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`,
      usdaEndpoint: `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(nutritionQuery)}&pageSize=${pageSize}&api_key=<DATA_GOV_KEY>`,
    },
    meals,
    usdaNutrition: {
      status: usdaResult.status,
      query: nutritionQuery,
      totalHits: usdaResult.totalHits,
      foods: usdaResult.foods,
      message: usdaResult.message,
      error: usdaResult.error,
    },
    singaporeElderlyInsights: {
      textureGuidance: 'Recommended IDDSI Level 5 (Minced & Moist) or Level 6 (Soft & Bite-Sized) for Singapore seniors with mild swallowing or dental loss.',
      chewingSafetyNote: 'Always debone fish (threadfin, barramundi) thoroughly; steam leafy vegetable stems until fork-crushable.',
      localSupermarketAvailability: [
        'FairPrice Online (Pasar Fresh Chilled Counters)',
        'RedMart (Lazada 2-hr Chilled Delivery)',
        'Cold Storage / CS Fresh (Air-Flown Fish & Organic Tofu)',
        'Sheng Siong Online (Fresh Pasar Seafood & Chinese Herbal Soup Packs)',
      ],
    },
  };

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(responsePayload);
}

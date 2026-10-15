import type { Request, Response } from 'express';

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
    pageSize: number;
  };
  sources: {
    theMealDbEndpoint: string;
    usdaEndpoint: string;
  };
  headers: {
    accept: string;
    accountKeyProvided: boolean;
  };
  meals: MealDbRecipe[];
  usdaNutrition: {
    query: string;
    keyConfigured: boolean;
    totalHits?: number;
    foods: Array<{
      fdcId: number;
      description: string;
      brandOwner?: string;
      nutrients: Record<string, { value: number; unit: string }>;
    }>;
    note?: string;
  };
}

export async function fetchMealDbRecipes(ingredient: string): Promise<MealDbRecipe[]> {
  const formattedIng = ingredient.trim().replace(/\s+/g, '_').toLowerCase();
  const endpoint = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(formattedIng)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const headers: Record<string, string> = {
      accept: 'application/json',
    };
    if (process.env.LTA_ACCOUNT_KEY) {
      headers['AccountKey'] = process.env.LTA_ACCOUNT_KEY;
    }

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`TheMealDB HTTP ${res.status}: ${res.statusText}`);
    }

    const data: any = await res.json();
    return Array.isArray(data?.meals) ? data.meals : [];
  } catch (err) {
    console.warn(`[TheMealDB] Fetch error for "${ingredient}":`, err);
    return [];
  }
}

export async function fetchUsdaNutrition(query: string, pageSize = 5): Promise<{
  foods: any[];
  totalHits?: number;
  keyConfigured: boolean;
  note?: string;
}> {
  const apiKey = process.env.DATA_GOV_KEY;
  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY;

  if (!apiKey) {
    return {
      foods: [],
      keyConfigured: false,
      note: 'DATA_GOV_KEY environment variable is not configured. Please supply your API key to enable live USDA FoodData Central retrieval.',
    };
  }

  const endpoint = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
    query
  )}&pageSize=${pageSize}&api_key=${encodeURIComponent(apiKey)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const headers: Record<string, string> = {
      accept: 'application/json',
    };
    if (ltaAccountKey) {
      headers['AccountKey'] = ltaAccountKey;
    }

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeout);

    if (res.status === 429) {
      return {
        foods: [],
        keyConfigured: true,
        totalHits: 0,
        note: 'USDA rate limit reached for the configured key.',
      };
    }

    if (!res.ok) {
      throw new Error(`USDA API HTTP ${res.status}: ${res.statusText}`);
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
      foods: formattedFoods,
      totalHits: data.totalHits,
      keyConfigured: true,
    };
  } catch (err: any) {
    console.warn(`[USDA FoodData] Fetch error for "${query}":`, err?.message);
    return {
      foods: [],
      keyConfigured: true,
      note: `Live USDA connection failed: ${err?.message || 'unknown error'}`,
    };
  }
}

export default async function recipesHandler(req: Request, res: Response) {
  const ingredient = (req.query.ingredient as string) || (req.query.i as string) || 'chicken_breast';
  const nutritionQuery = (req.query.nutritionQuery as string) || (req.query.query as string) || 'cheddar';
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
      pageSize,
    },
    sources: {
      theMealDbEndpoint: `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`,
      usdaEndpoint: `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(nutritionQuery)}&pageSize=${pageSize}&api_key=<DATA_GOV_KEY>`,
    },
    headers: {
      accept: 'application/json',
      accountKeyProvided: Boolean(process.env.LTA_ACCOUNT_KEY),
    },
    meals,
    usdaNutrition: {
      query: nutritionQuery,
      keyConfigured: usdaResult.keyConfigured,
      totalHits: usdaResult.totalHits,
      foods: usdaResult.foods,
      note: usdaResult.note,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(responsePayload);
}

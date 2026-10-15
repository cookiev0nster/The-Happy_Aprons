import type { Request, Response } from 'express';

export interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  connections: {
    usdaFoodDataCentral: {
      status: 'connected' | 'error' | 'rate_limited';
      endpoint: string;
      latencyMs?: number;
      error?: string;
      sampleItemCount?: number;
    };
    theMealDb: {
      status: 'connected' | 'error';
      endpoint: string;
      latencyMs?: number;
      error?: string;
      sampleRecipeCount?: number;
    };
  };
}

export async function checkUsdaHealth(): Promise<{
  status: 'connected' | 'error' | 'rate_limited';
  endpoint: string;
  latencyMs?: number;
  error?: string;
  sampleItemCount?: number;
}> {
  const apiKey = process.env.DATA_GOV_KEY || 'DEMO_KEY';
  const endpoint = `https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar&pageSize=5&api_key=${encodeURIComponent(apiKey)}`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.status === 429) {
      return {
        status: 'rate_limited',
        endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search',
        latencyMs,
        error: 'USDA FoodData Central DEMO_KEY hourly rate limit reached.',
      };
    }

    if (!res.ok) {
      return {
        status: 'error',
        endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search',
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data: any = await res.json();
    return {
      status: 'connected',
      endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search',
      latencyMs,
      sampleItemCount: Array.isArray(data?.foods) ? data.foods.length : 0,
    };
  } catch (err: any) {
    return {
      status: 'error',
      endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search',
      latencyMs: Date.now() - startTime,
      error: err?.message || 'Connection failed',
    };
  }
}

export async function checkMealDbHealth(): Promise<{
  status: 'connected' | 'error';
  endpoint: string;
  latencyMs?: number;
  error?: string;
  sampleRecipeCount?: number;
}> {
  const endpoint = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast';
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      return {
        status: 'error',
        endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php',
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data: any = await res.json();
    const count = Array.isArray(data?.meals) ? data.meals.length : 0;

    return {
      status: 'connected',
      endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php',
      latencyMs,
      sampleRecipeCount: count,
    };
  } catch (err: any) {
    return {
      status: 'error',
      endpoint: 'https://www.themealdb.com/api/json/v1/1/filter.php',
      latencyMs: Date.now() - startTime,
      error: err?.message || 'Connection failed',
    };
  }
}

export default async function healthHandler(req: Request, res: Response) {
  const [usdaResult, mealDbResult] = await Promise.all([
    checkUsdaHealth(),
    checkMealDbHealth(),
  ]);

  const isDegraded =
    usdaResult.status !== 'connected' || mealDbResult.status !== 'connected';
  const isError =
    usdaResult.status === 'error' && mealDbResult.status === 'error';

  const healthData: HealthCheckResult = {
    status: isError ? 'error' : isDegraded ? 'degraded' : 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    connections: {
      usdaFoodDataCentral: usdaResult,
      theMealDb: mealDbResult,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  return res.status(isError ? 503 : 200).json(healthData);
}

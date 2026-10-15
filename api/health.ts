import type { Request, Response } from 'express';

export interface UsdaHealthStatus {
  status: 'connected' | 'unconfigured' | 'rate_limited' | 'error';
  endpoint: string;
  latencyMs?: number;
  message?: string;
  error?: string;
  sampleItemCount?: number;
}

export interface MealDbHealthStatus {
  status: 'connected' | 'error';
  endpoint: string;
  latencyMs?: number;
  error?: string;
  sampleRecipeCount?: number;
}

export interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'unconfigured';
  timestamp: string;
  uptimeSeconds: number;
  connections: {
    usdaFoodDataCentral: UsdaHealthStatus;
    theMealDb: MealDbHealthStatus;
  };
}

export async function checkUsdaHealth(): Promise<UsdaHealthStatus> {
  const apiKey = (process.env.DATA_GOV_KEY || '').trim();
  const endpointTemplate = 'https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar&pageSize=5&api_key=<DATA_GOV_KEY>';

  if (!apiKey) {
    return {
      status: 'unconfigured',
      endpoint: endpointTemplate,
      message: 'DATA_GOV_KEY environment variable is not configured yet. Please provide your USDA Data.gov API key.',
    };
  }

  const requestUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar&pageSize=5&api_key=${encodeURIComponent(apiKey)}`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(requestUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        AccountKey: apiKey,
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.status === 429) {
      return {
        status: 'rate_limited',
        endpoint: endpointTemplate,
        latencyMs,
        error: 'USDA FoodData Central rate limit reached for the configured key.',
      };
    }

    if (!res.ok) {
      return {
        status: 'error',
        endpoint: endpointTemplate,
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data: any = await res.json();
    return {
      status: 'connected',
      endpoint: endpointTemplate,
      latencyMs,
      sampleItemCount: Array.isArray(data?.foods) ? data.foods.length : 0,
    };
  } catch (err: any) {
    return {
      status: 'error',
      endpoint: endpointTemplate,
      latencyMs: Date.now() - startTime,
      error: err?.message || 'Connection failed',
    };
  }
}

export async function checkMealDbHealth(): Promise<MealDbHealthStatus> {
  const endpoint = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast';
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      return {
        status: 'error',
        endpoint,
        latencyMs,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data: any = await res.json();
    const count = Array.isArray(data?.meals) ? data.meals.length : 0;

    return {
      status: 'connected',
      endpoint,
      latencyMs,
      sampleRecipeCount: count,
    };
  } catch (err: any) {
    return {
      status: 'error',
      endpoint,
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

  let overallStatus: 'ok' | 'degraded' | 'unconfigured' = 'ok';
  if (usdaResult.status === 'unconfigured') {
    overallStatus = 'unconfigured';
  } else if (usdaResult.status !== 'connected' || mealDbResult.status !== 'connected') {
    overallStatus = 'degraded';
  }

  const healthData: HealthCheckResult = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    connections: {
      usdaFoodDataCentral: usdaResult,
      theMealDb: mealDbResult,
    },
  };

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(healthData);
}

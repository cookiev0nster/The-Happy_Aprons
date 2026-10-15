import type { Request, Response } from 'express';

export interface HealthCheckResult {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptimeSeconds: number;
  connections: {
    usdaFoodDataCentral: {
      status: 'connected' | 'unconfigured' | 'error' | 'rate_limited';
      endpoint: string;
      latencyMs?: number;
      error?: string;
      sampleItemCount?: number;
      keyConfigured: boolean;
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
  status: 'connected' | 'unconfigured' | 'error' | 'rate_limited';
  endpoint: string;
  latencyMs?: number;
  error?: string;
  sampleItemCount?: number;
  keyConfigured: boolean;
}> {
  const apiKey = process.env.DATA_GOV_KEY;
  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY;

  if (!apiKey) {
    return {
      status: 'unconfigured',
      endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar&pageSize=5&api_key=<DATA_GOV_KEY>',
      keyConfigured: false,
      error: 'DATA_GOV_KEY environment variable is not set. Please provide your API key in environment variables.',
    };
  }

  const endpoint = `https://api.nal.usda.gov/fdc/v1/foods/search?query=cheddar&pageSize=5&api_key=${encodeURIComponent(apiKey)}`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

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

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (res.status === 429) {
      return {
        status: 'rate_limited',
        endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search',
        latencyMs,
        keyConfigured: true,
        error: 'USDA FoodData Central API rate limit reached.',
      };
    }

    if (!res.ok) {
      return {
        status: 'error',
        endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search',
        latencyMs,
        keyConfigured: true,
        error: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const data: any = await res.json();
    return {
      status: 'connected',
      endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search',
      latencyMs,
      keyConfigured: true,
      sampleItemCount: Array.isArray(data?.foods) ? data.foods.length : 0,
    };
  } catch (err: any) {
    return {
      status: 'error',
      endpoint: 'https://api.nal.usda.gov/fdc/v1/foods/search',
      latencyMs: Date.now() - startTime,
      keyConfigured: true,
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
  return res.status(200).json(healthData);
}

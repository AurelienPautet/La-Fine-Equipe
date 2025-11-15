/**
 * Retry utility with exponential backoff strategy
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  onRetry: () => {},
};

/**
 * Calculate delay with exponential backoff
 */
export function calculateExponentialBackoff(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number
): number {
  const delay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
  // Add jitter to prevent thundering herd problem
  const jitter = Math.random() * 0.1 * delay;
  return Math.min(delay + jitter, maxDelayMs);
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generic retry function for any async operation
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns The result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < config.maxAttempts) {
        const delay = calculateExponentialBackoff(
          attempt,
          config.initialDelayMs,
          config.maxDelayMs,
          config.backoffMultiplier
        );

        config.onRetry(attempt, lastError);
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error("Retry failed with unknown error");
}

/**
 * Retry wrapper specifically for fetch operations
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit & RetryOptions
): Promise<Response> {
  const retryOptions: RetryOptions = {};
  const fetchOptions: RequestInit = {};

  // Separate retry options from fetch options
  const {
    maxAttempts,
    initialDelayMs,
    maxDelayMs,
    backoffMultiplier,
    onRetry,
    ...fetchOpts
  } = options || {};

  if (maxAttempts !== undefined) retryOptions.maxAttempts = maxAttempts;
  if (initialDelayMs !== undefined) retryOptions.initialDelayMs = initialDelayMs;
  if (maxDelayMs !== undefined) retryOptions.maxDelayMs = maxDelayMs;
  if (backoffMultiplier !== undefined)
    retryOptions.backoffMultiplier = backoffMultiplier;
  if (onRetry !== undefined) retryOptions.onRetry = onRetry;

  Object.assign(fetchOptions, fetchOpts);

  return retryWithBackoff(
    () => fetch(url, fetchOptions),
    retryOptions
  );
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError) {
    // Network errors
    return true;
  }

  if (error instanceof Error) {
    // Timeout errors
    if (error.message.includes("timeout")) return true;
    // Connection errors
    if (error.message.includes("Connection") || error.message.includes("ECONNREFUSED"))
      return true;
  }

  return false;
}

/**
 * Retry configuration presets
 */
export const RetryPresets = {
  /**
   * Conservative retry: 2 attempts, slow backoff
   */
  conservative: {
    maxAttempts: 2,
    initialDelayMs: 500,
    maxDelayMs: 2000,
    backoffMultiplier: 2,
  },

  /**
   * Default retry: 3 attempts, moderate backoff
   */
  default: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  },

  /**
   * Aggressive retry: 5 attempts, fast backoff
   */
  aggressive: {
    maxAttempts: 5,
    initialDelayMs: 500,
    maxDelayMs: 30000,
    backoffMultiplier: 1.5,
  },

  /**
   * Quick retry: 3 attempts, minimal backoff (for fast operations)
   */
  quick: {
    maxAttempts: 3,
    initialDelayMs: 100,
    maxDelayMs: 1000,
    backoffMultiplier: 2,
  },
};

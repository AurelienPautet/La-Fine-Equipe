export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, "shouldRetry">> = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  onRetry: () => {},
};

export function calculateExponentialBackoff(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number
): number {
  const delay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
  const jitter = Math.random() * 0.1 * delay;
  return Math.min(delay + jitter, maxDelayMs);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableError(error: Error): boolean {
  const retryablePatterns = [
    "ECONNREFUSED",
    "ETIMEDOUT",
    "EHOSTUNREACH",
    "getaddrinfo",
    "503",
    "502",
    "500",
    "429",
  ];
  return retryablePatterns.some((pattern) => error.message.includes(pattern));
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const shouldRetry =
    options.shouldRetry || ((error: Error) => isRetryableError(error));
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < config.maxAttempts && shouldRetry(lastError)) {
        const delay = calculateExponentialBackoff(
          attempt,
          config.initialDelayMs,
          config.maxDelayMs,
          config.backoffMultiplier
        );
        config.onRetry(attempt, lastError);
        await sleep(delay);
      } else if (attempt === config.maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }
    }
  }

  throw lastError || new Error("Retry failed with unknown error");
}

export const RetryPresets = {
  apiCall: {
    maxAttempts: 6,
    initialDelayMs: 1000,
    maxDelayMs: 15000,
    backoffMultiplier: 2,
  },
  database: {
    maxAttempts: 3,
    initialDelayMs: 500,
    maxDelayMs: 5000,
    backoffMultiplier: 2,
  },
  vectorStore: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  },
  quick: {
    maxAttempts: 2,
    initialDelayMs: 100,
    maxDelayMs: 1000,
    backoffMultiplier: 2,
  },
};

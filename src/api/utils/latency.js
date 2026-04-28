export const DEFAULT_FAKE_API_LATENCY_MS = 120;

export function withLatency(factoryOrValue, latencyMs = DEFAULT_FAKE_API_LATENCY_MS) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const value = typeof factoryOrValue === 'function' ? factoryOrValue() : factoryOrValue;
        resolve(value);
      } catch (error) {
        reject(error);
      }
    }, latencyMs);
  });
}

const KATEX_MISSING_METRICS_PREFIX = 'No character metrics ';

export function isKatexMissingMetricsWarning(args) {
  return (
    args.length > 0 &&
    typeof args[0] === 'string' &&
    args[0].startsWith(KATEX_MISSING_METRICS_PREFIX)
  );
}

export function withSuppressedKatexMetricWarnings(callback) {
  if (typeof console === 'undefined' || typeof console.warn !== 'function') {
    return callback();
  }

  const originalWarn = console.warn;

  console.warn = (...args) => {
    if (!isKatexMissingMetricsWarning(args)) {
      originalWarn.apply(console, args);
    }
  };

  try {
    return callback();
  } finally {
    console.warn = originalWarn;
  }
}

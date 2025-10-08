// A function that converts JSON strings representing functions into actual functions within an object. Just checking for keys named "callback". Add more keys if needed.

export function jsonToFunction<T>(obj: T): T {
  function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null;
  }
  function format(o: Record<string, unknown>): void {
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (
        k === 'callback' &&
        typeof v === 'string' &&
        /^\s*(function\s*\(|\([^)]*\)\s*=>)/.test(v)
      ) {
        (o as Record<string, unknown>)[k] = eval(`(${v})`);
      } else if (isObject(v)) {
        format(v);
      }
    }
  }
  if (isObject(obj)) format(obj as unknown as Record<string, unknown>);
  return obj;
}

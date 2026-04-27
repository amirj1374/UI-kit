export function defaultFilterAdapter(raw: Record<string, any>) {
  const out: Record<string, any> = {};

  for (const [key, value] of Object.entries(raw)) {
    if (value === '' || value === null || value === undefined) continue;

    out[key] = value;
  }

  return out;
}

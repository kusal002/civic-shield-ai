export function publicLocationLabel(value: string) {
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length > 2 ? parts.slice(1, Math.min(parts.length, 4)).join(", ") : value;
}

export function publicCoordinate(value: number | null) {
  return typeof value === "number" ? Number(value.toFixed(2)) : null;
}

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const latitude = url.searchParams.get("lat");
  const longitude = url.searchParams.get("lon");
  if ((!query || query.length < 3) && (!latitude || !longitude)) return NextResponse.json({ error: "Enter a location search or valid coordinates." }, { status: 400 });

  try {
    const endpoint = latitude && longitude
      ? `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`
      : `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query ?? "")}`;
    const response = await fetch(endpoint, {
      headers: { "User-Agent": "CivicShieldAI-Hackathon/0.1 (contact: project-demo)" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error("Geocoder request failed");
    const payload = await response.json() as { display_name?: string; lat?: string; lon?: string } | Array<{ display_name: string; lat: string; lon: string }>;
    const result = Array.isArray(payload) ? payload[0] : payload;
    if (!result) return NextResponse.json({ error: "Location not found." }, { status: 404 });
    return NextResponse.json({ label: result.display_name, latitude: Number(result.lat), longitude: Number(result.lon) });
  } catch {
    return NextResponse.json({ error: "Location search is temporarily unavailable." }, { status: 503 });
  }
}

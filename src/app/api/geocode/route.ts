import { NextResponse } from "next/server";

type LocationResult = {
  label: string;
  latitude: number;
  longitude: number;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const latitude = url.searchParams.get("lat");
  const longitude = url.searchParams.get("lon");
  if ((!query || query.length < 3) && (!latitude || !longitude)) return NextResponse.json({ error: "Enter a location search or valid coordinates." }, { status: 400 });

  const googleKey = process.env.GOOGLE_MAPS_API_KEY;
  if (googleKey) {
    const googleResult = latitude && longitude
      ? await reverseGeocodeWithGoogle({ latitude, longitude, googleKey })
      : await searchWithGoogle({ query: query ?? "", googleKey });
    if (googleResult) return NextResponse.json(googleResult);
  }

  try {
    const endpoint = latitude && longitude
      ? `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`
      : `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(query ?? "")}`;
    const response = await fetch(endpoint, {
      headers: { "User-Agent": "CivicShieldAI-Hackathon/0.1 (contact: project-demo)" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error("Geocoder request failed");
    const payload = await response.json() as { display_name?: string; lat?: string; lon?: string } | Array<{ display_name: string; lat: string; lon: string }>;
    if (Array.isArray(payload)) {
      const results = payload.map((result) => ({ label: result.display_name, latitude: Number(result.lat), longitude: Number(result.lon) }));
      if (!results.length) return NextResponse.json({ error: "Location not found." }, { status: 404 });
      return NextResponse.json({ results });
    }
    const result = payload;
    if (!result) return NextResponse.json({ error: "Location not found." }, { status: 404 });
    return NextResponse.json({ label: result.display_name, latitude: Number(result.lat), longitude: Number(result.lon) });
  } catch {
    return NextResponse.json({ error: "Location search is temporarily unavailable." }, { status: 503 });
  }
}

async function searchWithGoogle({ query, googleKey }: { query: string; googleKey: string }) {
  try {
    const endpoint = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    endpoint.searchParams.set("address", query);
    endpoint.searchParams.set("key", googleKey);
    endpoint.searchParams.set("region", "in");

    const response = await fetch(endpoint, { next: { revalidate: 86400 } });
    if (!response.ok) return null;
    const payload = await response.json() as {
      status?: string;
      results?: Array<{
        formatted_address?: string;
        geometry?: { location?: { lat?: number; lng?: number } };
      }>;
    };
    if (payload.status !== "OK") return null;

    const results = (payload.results ?? [])
      .map((result): LocationResult | null => {
        const latitude = result.geometry?.location?.lat;
        const longitude = result.geometry?.location?.lng;
        if (!result.formatted_address || typeof latitude !== "number" || typeof longitude !== "number") return null;
        return { label: result.formatted_address, latitude, longitude };
      })
      .filter((result): result is LocationResult => Boolean(result))
      .slice(0, 5);

    return results.length ? { results } : null;
  } catch {
    return null;
  }
}

async function reverseGeocodeWithGoogle({
  latitude,
  longitude,
  googleKey,
}: {
  latitude: string;
  longitude: string;
  googleKey: string;
}) {
  try {
    const endpoint = new URL("https://maps.googleapis.com/maps/api/geocode/json");
    endpoint.searchParams.set("latlng", `${latitude},${longitude}`);
    endpoint.searchParams.set("key", googleKey);
    endpoint.searchParams.set("result_type", "street_address|premise|route|neighborhood|sublocality|locality");

    const response = await fetch(endpoint, { next: { revalidate: 86400 } });
    if (!response.ok) return null;
    const payload = await response.json() as {
      status?: string;
      results?: Array<{
        formatted_address?: string;
        geometry?: { location?: { lat?: number; lng?: number } };
      }>;
    };
    const firstResult = payload.results?.[0];
    const resultLatitude = firstResult?.geometry?.location?.lat;
    const resultLongitude = firstResult?.geometry?.location?.lng;
    if (payload.status !== "OK" || !firstResult?.formatted_address || typeof resultLatitude !== "number" || typeof resultLongitude !== "number") return null;

    return {
      label: firstResult.formatted_address,
      latitude: resultLatitude,
      longitude: resultLongitude,
    };
  } catch {
    return null;
  }
}

import { NextResponse } from "next/server";

const categoryQueries: Record<string, string> = {
  "Electrical safety": "electricity office municipal electrical maintenance",
  "Sanitation and waste": "municipal sanitation office solid waste department",
  "Drainage and water": "municipal water drainage department office",
  "Roads and infrastructure": "public works department municipal engineering office",
  "Traffic safety": "traffic police traffic engineering office",
  "General civic issue": "municipal corporation public grievance office",
};

type DepartmentPlace = {
  name: string;
  address: string;
  phone?: string;
  distanceMeters?: number;
  mapsUrl?: string;
  source: "google";
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get("lat"));
  const lon = Number(url.searchParams.get("lon"));
  const category = url.searchParams.get("category")?.trim() || "General civic issue";
  const routeName = url.searchParams.get("route")?.trim();

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Valid coordinates are required." }, { status: 400 });
  }

  const googleKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleKey) {
    return NextResponse.json({ departments: [], provider: "missing-google-key" });
  }

  const queryBase = categoryQueries[category] ?? categoryQueries["General civic issue"];
  const textQuery = `${routeName || queryBase} ${queryBase} near ${lat},${lon}`;

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": googleKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.googleMapsUri,places.location",
      },
      body: JSON.stringify({
        textQuery,
        maxResultCount: 5,
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lon },
            radius: 20000,
          },
        },
      }),
      next: { revalidate: 600 },
    });

    if (!response.ok) return NextResponse.json({ departments: [], provider: `google-http-${response.status}` });
    const payload = await response.json() as {
      places?: Array<{
        displayName?: { text?: string };
        formattedAddress?: string;
        nationalPhoneNumber?: string;
        internationalPhoneNumber?: string;
        googleMapsUri?: string;
        location?: { latitude?: number; longitude?: number };
      }>;
    };

    const departments: DepartmentPlace[] = (payload.places ?? []).map((place) => ({
      name: place.displayName?.text ?? "Nearby civic office",
      address: place.formattedAddress ?? "Address not available",
      phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber,
      mapsUrl: place.googleMapsUri,
      distanceMeters: place.location?.latitude && place.location.longitude ? getDistanceMeters(lat, lon, place.location.latitude, place.location.longitude) : undefined,
      source: "google",
    }));

    return NextResponse.json({ departments, provider: "google" });
  } catch {
    return NextResponse.json({ departments: [], provider: "google-request-failed" });
  }
}

function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const earthRadiusMeters = 6371000;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  return Math.round(earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function toRadians(value: number) {
  return value * Math.PI / 180;
}

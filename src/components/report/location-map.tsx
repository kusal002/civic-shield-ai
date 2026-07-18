"use client";

import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

type Coordinates = { latitude: number; longitude: number };

function MapClickHandler({ onSelect }: { onSelect: (coordinates: Coordinates) => void }) {
  useMapEvents({
    click(event) {
      onSelect({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });
  return null;
}

function MapViewportSync({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();
  useEffect(() => {
    map.setView([coordinates.latitude, coordinates.longitude], Math.max(map.getZoom(), 15), { animate: true });
  }, [coordinates.latitude, coordinates.longitude, map]);
  return null;
}

export function LocationMap({ coordinates, onSelect }: { coordinates: Coordinates; onSelect: (coordinates: Coordinates) => void }) {
  return (
    <MapContainer center={[coordinates.latitude, coordinates.longitude]} zoom={15} className="location-map h-64 w-full" scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapViewportSync coordinates={coordinates} />
      <CircleMarker center={[coordinates.latitude, coordinates.longitude]} pathOptions={{ color: "#076b5a", fillColor: "#076b5a", fillOpacity: 0.8 }} radius={10} />
      <MapClickHandler onSelect={onSelect} />
    </MapContainer>
  );
}

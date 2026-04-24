"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import { parkingSpots, ParkingSpot } from "../lib/parkingData";

// Fix icons (browser-safe)
const DefaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map() {
  const [selected, setSelected] = useState<ParkingSpot | null>(null);

  const center: [number, number] = [51.0447, -114.0719];

  const bestSpot = parkingSpots
    .filter((p) => p.available)
    .sort((a, b) => a.price - b.price)[0];

  return (
    <div className="w-full h-screen relative">
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            eventHandlers={{
              click: () => setSelected(spot),
            }}
          >
            <Popup>
              <b>{spot.name}</b>
              <br />
              ${spot.price}/hr
              <br />
              {spot.available ? "Available" : "Full"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selected && (
        <div className="absolute bottom-5 left-5 bg-white p-4 rounded shadow">
          <h2 className="font-bold">{selected.name}</h2>
          <p>Price: ${selected.price}/hr</p>
        </div>
      )}

      {bestSpot && (
        <div className="absolute top-5 left-5 bg-green-600 text-white p-3 rounded">
          ⭐ Recommended: {bestSpot.name}
        </div>
      )}
    </div>
  );
}
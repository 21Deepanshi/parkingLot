"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

const DefaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = DefaultIcon;

// Define type for parking spot
type ParkingSpot = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  price: number;
  available: boolean;
};

export default function Map() {
  const [selected, setSelected] = useState<ParkingSpot | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);

  const center: [number, number] = [51.0447, -114.0719];

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/parking");
        const data: ParkingSpot[] = await res.json();
        setParkingSpots(data);
      } catch (error) {
        console.error("Failed to fetch parking spots", error);
      }
    }

    fetchData();
  }, []);

  // Smart recommendation (cheapest available)
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

      {/* Selected Spot UI */}
      {selected && (
        <div className="absolute bottom-5 left-5 bg-white p-4 rounded shadow-md w-64">
          <h2 className="font-bold">{selected.name}</h2>
          <p>Price: ${selected.price}/hr</p>
          <p>Status: {selected.available ? "Available" : "Full"}</p>
        </div>
      )}

      {/* Recommendation */}
      {bestSpot && (
        <div className="absolute top-5 left-5 bg-green-600 text-white p-3 rounded shadow-md">
          ⭐ Recommended: {bestSpot.name} (${bestSpot.price}/hr)
        </div>
      )}
    </div>
  );
}
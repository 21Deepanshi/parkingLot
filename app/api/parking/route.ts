import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: 1,
      name: "Downtown Parking",
      lat: 51.0447,
      lng: -114.0719,
      price: 5,
      available: true,
    },
    {
      id: 2,
      name: "City Mall Parking",
      lat: 51.046,
      lng: -114.065,
      price: 3,
      available: false,
    },
    {
      id: 3,
      name: "Riverfront Parking",
      lat: 51.048,
      lng: -114.07,
      price: 4,
      available: true,
    },
  ]);
}
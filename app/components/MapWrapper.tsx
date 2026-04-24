"use client";

import dynamic from "next/dynamic";

// IMPORTANT: disable SSR ONLY here (safe place)
const Map = dynamic(() => import("./Map"), {
  ssr: false,
});

export default function MapWrapper() {
  return <Map />;
}
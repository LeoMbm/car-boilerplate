"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAppStore } from "@/lib/store";

// Fix the missing icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default function Map() {
  const [isMounted, setIsMounted] = useState(false);
  const { siteSettings } = useAppStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <MapContainer
      center={[50.85045, 4.34878]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[50.85045, 4.34878]}>
        <Popup>
          {siteSettings.title} <br /> {siteSettings.contactInfo.address}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

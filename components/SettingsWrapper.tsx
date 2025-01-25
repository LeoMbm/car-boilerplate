"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Service, SiteSettings, Vehicle } from "@/lib/db";

interface ClientWrapperProps {
  children: React.ReactNode;
  initialSiteSettings: SiteSettings;
  initialServices: Service[];
  initialVehicles: Vehicle[];
}

export default function ClientWrapper({
  children,
  initialSiteSettings,
  initialServices,
  initialVehicles,
}: ClientWrapperProps) {
  const { setSiteSettings, setServices, setVehicles } = useAppStore();

  useEffect(() => {
    // Set initial data from server
    setSiteSettings(initialSiteSettings);
    setServices(initialServices);
    setVehicles(initialVehicles);
  }, [
    initialSiteSettings,
    initialServices,
    initialVehicles,
    setSiteSettings,
    setServices,
    setVehicles,
  ]);

  return <>{children}</>;
}

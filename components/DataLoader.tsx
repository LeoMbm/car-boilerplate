"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { log } from "@/lib/logger";

export function DataLoader({ children, siteSettings, services, vehicles }) {
  const { setSiteSettings, setServices, setVehicles, setGeneralLoading } =
    useAppStore();

  useEffect(() => {
    setSiteSettings(siteSettings);
    setServices(services);
    setVehicles(vehicles);
    setGeneralLoading(false);
    // log("Initial data loaded", "info");
  }, []);

  return children;
}

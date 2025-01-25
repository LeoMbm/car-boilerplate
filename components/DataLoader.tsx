"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { log } from "@/lib/logger";

export function DataLoader({ children, siteSettings, services, vehicles }) {
  const { setSiteSettings, setServices, setVehicles, setGeneralLoading } =
    useAppStore();

  // const { setSiteSettings, setServices, setVehicles } = useAppStore();

  useEffect(() => {
    setSiteSettings(siteSettings);
    setServices(services);
    setVehicles(vehicles);
    setGeneralLoading(false);
    log("Initial data loaded", "info");
  }, []);

  return children;
}

//   useEffect(() => {
//     async function fetchInitialData() {
//       setGeneralLoading(true);
//       try {
//         const response = await fetch("/api/initial-data");
//         if (!response.ok) {
//           throw new Error("Failed to fetch initial data");
//         }
//         const data = await response.json();
//         // console.log("Initial data:", data);

//         setSiteSettings(data.siteSettings);
//         setServices(data.services);
//         setVehicles(data.vehicles);
//         setGeneralLoading(false);
//       } catch (error) {
//         console.error("Error loading initial data:", error);
//       }
//     }

//     fetchInitialData();
//   }, [setSiteSettings, setServices, setVehicles]);

//   return null;
// }

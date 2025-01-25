import { prisma } from "@/lib/prisma";
import { ContactInfo, SiteSettingsDB } from "@/types/siteSettings";
import { NextResponse } from "next/server";
// import { getSiteSettings, getServices, getVehicles } from "@/lib/db";

export async function getSiteSettings(): Promise<SiteSettingsDB | null> {
  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    console.log("Initial data:", settings);

    return settings;
  }
  return null;
}

export async function getServices() {
  console.log("[DATABASE] Fetching services...");
  const services = await prisma.service.findMany();
  if (services) {
    // console.log("Initial services:", services);
    return services;
  }

  return null;
}

export async function getVehicles() {
  return await prisma.vehicle.findMany();
}

export async function GET() {
  try {
    const [siteSettings, services, vehicles] = await Promise.all([
      getSiteSettings(),
      getServices(),
      getVehicles(),
    ]);
    if (!siteSettings) {
      return NextResponse.json(
        { error: "Site settings not found" },
        { status: 404 }
      );
    }

    console.log("Initial data:", siteSettings);

    return NextResponse.json({ siteSettings, services, vehicles });
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

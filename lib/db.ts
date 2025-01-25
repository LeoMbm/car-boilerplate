import { SiteSettingsDB } from "@/types/siteSettings";
import { prisma } from "./prisma";
import { log } from "./logger";

// Site Settings
export async function getSiteSettings(): Promise<SiteSettingsDB | null> {
  log("[DATABASE] Fetching settings...");
  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    return settings;
  }
  return null;
}

export async function getServices() {
  log("[DATABASE] Fetching services...");
  return await prisma.service.findMany();
}

export async function getVehicles() {
  log("[DATABASE] Fetching vehicles...");
  return await prisma.vehicle.findMany();
}

export async function updateSiteSettingsDB(data: Partial<SiteSettings>) {
  const settings = await prisma.siteSettings.findFirst();
  if (settings) {
    return await prisma.siteSettings.update({
      where: { id: settings.id },
      data,
    });
  } else {
    return await prisma.siteSettings.create({ data: data as SiteSettings });
  }
}

// Services

export async function createService(data: Partial<ServiceCreateDB>) {
  log("[DATABASE] Creating service...");

  const service = await prisma.service.create({
    data: data as ServiceCreateDB,
  });
  return service;
}

export async function updateService(
  id: number,
  data: Partial<ServiceCreateDB>
) {
  return await prisma.service.update({
    where: { id },
    data,
  });
}

export async function deleteService(id: number) {
  return await prisma.service.delete({
    where: { id },
  });
}

// Vehicles

type CleanedVehicle = {
  name: string;
  brand: string;
  price: number;
  year: number;
  description: string;
  mainImage?: string;
  additionalImages?: string[];
  characteristics?: { name: string; value: string }[];
};
export async function createVehicle(data: CleanedVehicle) {
  log("[DATABASE] Creating vehicle...");
  const additionalImages = data.additionalImages ? data.additionalImages : [];
  return await prisma.vehicle.create({
    data: {
      name: data.name,
      brand: data.brand,
      price: data.price,
      year: data.year,
      description: data.description,
      mainImage: data.mainImage,
      additionalImages: additionalImages,
      characteristics: data.characteristics
        ? JSON.stringify(data.characteristics)
        : [],
    },
  });
}

export async function updateVehicle(
  id: number,
  data: Partial<Omit<Vehicle, "id">>
) {
  return await prisma.vehicle.update({
    where: { id },
    data,
  });
}

export async function deleteVehicle(id: number) {
  log("[DATABASE] Deleting vehicle...");
  return await prisma.vehicle.delete({
    where: { id },
  });
}

// Types
export interface SiteSettings {
  id: number;
  title: string;
  description: string;
  logo: string;
  heroImage: string;
  primaryColor: string;
  secondaryColor: string;
  borderRadius: string;
  logoSize: number;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  featuredServices: number[];
  featuredVehicles: number[];
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
  showLogo: boolean;
  showTitle: boolean;
  metadata: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  colorTemplate: string;
  lightModeColors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
  };
  darkModeColors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
  };
}

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  details?: string[];
}

export interface ServiceCreateDB {
  icon: string;
  title: string;
  description: string;
  details?: string[];
}

export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  price: number;
  year: number;
  description: string;
  mainImage: string;
  additionalImages: string[];
  characteristics: Array<{ name: string; value: string }>;
}

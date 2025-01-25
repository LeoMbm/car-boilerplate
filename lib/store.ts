import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
// import { updateSettingsInKV } from "./kv";
import {
  getSiteSettings,
  getServices,
  getVehicles,
  updateSiteSettingsDB,
} from "./db";
import { JsonValue } from "@prisma/client/runtime/library";

type SocialMedia = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
};

type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  hours: string;
};

type AdminMetadata = {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
};

type ColorMode = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
};
interface SiteSettings {
  title: string;
  description: string;
  logo: string;
  heroImage: string;
  primaryColor: string;
  secondaryColor: string;
  borderRadius: string;
  logoSize: number;
  socialMedia: SocialMedia | JsonValue;
  featuredServices: number[];
  featuredVehicles: number[];
  contactInfo: ContactInfo | JsonValue;
  showLogo: boolean;
  showTitle: boolean;
  metadata: AdminMetadata | JsonValue;
  colorTemplate: string;
  lightModeColors: ColorMode | JsonValue;
  darkModeColors: ColorMode | JsonValue;
}

interface SiteSettingsUpdate {
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

interface Service {
  id?: number;
  icon: string;
  title: string;
  description: string;
  details: string[];
}

interface ServiceCreate {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

interface Vehicle {
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

interface AppState {
  siteSettings: Partial<SiteSettings> | SiteSettings;
  services: Service[];
  vehicles: Vehicle[];
  generalLoading: boolean;
  theme: "light" | "dark";
  isSending: boolean;
  setSiteSettings: (settings: SiteSettings) => void;
  setServices: (services: Service[]) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  updateSiteSettings: (settings: Partial<SiteSettingsUpdate>) => void;
  setGeneralLoading: (loading: boolean) => void;
  // fetchInitialData: () => Promise<void>;
  addService: (service: ServiceCreate) => void;
  updateService: (index: number, service: Partial<Service>) => void;
  removeService: (index: number) => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => void;
  removeVehicle: (id: number) => void;
  closeSidebar: () => void;
  setIsSending: (isSending: boolean) => void;
}

const initialSiteSettings: SiteSettings = {
  title: "LEO MOTORS",
  description:
    "Découvrez notre sélection de véhicules et nos services automobiles de qualité",
  logo: "/img/placeholder.svg",
  heroImage: "/img/placeholder.svg",
  primaryColor: "#3b82f6",
  secondaryColor: "#1e40af",
  borderRadius: "0.25rem",
  socialMedia: {
    facebook: "https://facebook.com/autoexpert",
    twitter: "https://twitter.com/autoexpert",
    instagram: "https://instagram.com/autoexpert",
  },
  featuredServices: [1, 2, 3],
  featuredVehicles: [1, 2, 3],
  contactInfo: {
    address: "123 Rue de l'Automobile, 1000 Bruxelles",
    phone: "01 23 45 67 89",
    email: "contact@autoexpert.com",
    hours: JSON.stringify({
      Lundi: { isOpen: true, open: "09:00", close: "18:00" },
      Mardi: { isOpen: true, open: "09:00", close: "18:00" },
      Mercredi: { isOpen: true, open: "09:00", close: "18:00" },
      Jeudi: { isOpen: true, open: "09:00", close: "18:00" },
      Vendredi: { isOpen: true, open: "09:00", close: "18:00" },
      Samedi: { isOpen: true, open: "10:00", close: "16:00" },
      Dimanche: { isOpen: false, open: "09:00", close: "18:00" },
    }),
  },
  showLogo: true,
  showTitle: true,
  metadata: {
    title: "Leo Motors - Votre Partenaire Automobile",
    description:
      "Découvrez notre sélection de véhicules et nos services automobiles de qualité",
    keywords: "automobile, voiture, garage, réparation, vente",
    ogImage: "/og-image.jpg",
  },
  logoSize: 25,
  colorTemplate: "Default (Black & White)",
  lightModeColors: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#0f172a",
    secondary: "#f1f5f9",
  },
  darkModeColors: {
    background: "#0f172a",
    foreground: "#ffffff",
    primary: "#e2e8f0",
    secondary: "#1e293b",
  },
};

const initialServices: Service[] = [
  {
    id: 1,
    icon: "Car",
    title: "Vente de véhicules",
    description:
      "Large sélection de véhicules neufs et d'occasion de toutes marques.",
    details: [
      "Véhicules neufs de grandes marques",
      "Véhicules d'occasion certifiés",
      "Financement et leasing disponibles",
      "Reprise de votre ancien véhicule",
    ],
  },
  {
    id: 2,
    icon: "Wrench",
    title: "Réparation et entretien",
    description:
      "Service de réparation professionnel pour toutes marques de véhicules.",
    details: [
      "Diagnostics précis avec équipement de pointe",
      "Réparations mécaniques et électriques",
      "Entretien régulier et révisions",
      "Réparation de carrosserie",
    ],
  },
  {
    id: 3,
    icon: "PaintBucket",
    title: "Personnalisation",
    description:
      "Donnez à votre véhicule un look unique avec nos services de personnalisation.",
    details: [
      "Peinture personnalisée",
      "Installation d'accessoires",
      "Tuning et amélioration des performances",
      "Teinture de vitres",
    ],
  },
  {
    id: 4,
    icon: "Zap",
    title: "Services pour véhicules électriques",
    description:
      "Expertise spécialisée pour l'entretien et la réparation de véhicules électriques.",
    details: [
      "Diagnostic et réparation de batteries",
      "Mise à jour des logiciels",
      "Installation de bornes de recharge",
      "Conseils pour optimiser l'autonomie",
    ],
  },
  {
    id: 5,
    icon: "ShieldCheck",
    title: "Contrôle technique",
    description:
      "Préparez votre véhicule pour le contrôle technique avec notre service de pré-contrôle.",
    details: [
      "Inspection complète du véhicule",
      "Identification des problèmes potentiels",
      "Réparations nécessaires avant le contrôle",
      "Accompagnement pour le passage du contrôle",
    ],
  },
  {
    id: 6,
    icon: "HelpCircle",
    title: "Conseil et assistance",
    description:
      "Notre équipe d'experts est là pour répondre à toutes vos questions automobiles.",
    details: [
      "Conseils d'achat personnalisés",
      "Assistance pour les démarches administratives",
      "Information sur l'entretien et la maintenance",
      "Support technique par téléphone",
    ],
  },
];

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    name: "Citadine Eco+",
    brand: "AutoExpert",
    price: 15000,
    year: 2023,
    description: "Parfaite pour la ville, économique et écologique.",
    image: "/img/placeholder.svg",
    characteristics: [
      { name: "Moteur", value: "Électrique" },
      { name: "Autonomie", value: "300 km" },
      { name: "0 à 100 km/h", value: "8 secondes" },
    ],
  },
  {
    id: 2,
    name: "SUV Familial",
    brand: "AutoExpert",
    price: 35000,
    year: 2023,
    description: "Spacieux et confortable, idéal pour les familles.",
    image: "/img/placeholder.svg",
    characteristics: [
      { name: "Moteur", value: "Hybride" },
      { name: "Consommation", value: "5L/100km" },
      { name: "Coffre", value: "600L" },
    ],
  },
  {
    id: 3,
    name: "Sport GT",
    brand: "AutoExpert",
    price: 55000,
    year: 2023,
    description: "Performances et élégance pour les amateurs de sensations.",
    image: "/img/placeholder.svg",
    characteristics: [
      { name: "Moteur", value: "V6 Turbo" },
      { name: "Puissance", value: "400 ch" },
      { name: "0 à 100 km/h", value: "4.5 secondes" },
    ],
  },
];

type InitialState = {
  siteSettings: SiteSettings;
  services: Service[];
  vehicles: Vehicle[];
};

export const getInitialState = async (): Promise<InitialState> => {
  return {
    siteSettings: {
      title: "",
      description: "",
      logo: "",
      heroImage: "",
      primaryColor: "",
      secondaryColor: "",
      borderRadius: "",
      logoSize: 0,
      socialMedia: null,
      featuredServices: [],
      featuredVehicles: [],
      contactInfo: null,
      showLogo: false,
      showTitle: false,
      metadata: null,
      colorTemplate: "",
      lightModeColors: null,
      darkModeColors: null,
    },
    services: [],
    vehicles: [],
  };
};

// const initialSiteSettings: SiteSettings = {
//   title: "",
//   description: "",
//   logo: "",
//   heroImage: "",
//   primaryColor: "",
//   secondaryColor: "",
//   borderRadius: "",
//   logoSize: 25,
//   socialMedia: {},
//   featuredServices: [],
//   featuredVehicles: [],
//   contactInfo: {
//     address: "",
//     phone: "",
//     email: "",
//     hours: "",
//   },
//   showLogo: true,
//   showTitle: true,
//   metadata: {
//     title: "",
//     description: "",
//     keywords: "",
//     ogImage: "",
//   },
//   colorTemplate: "",
//   lightModeColors: {
//     background: "",
//     foreground: "",
//     primary: "",
//     secondary: "",
//   },
//   darkModeColors: {
//     background: "",
//     foreground: "",
//     primary: "",
//     secondary: "",
//   },
// };

export const getInitialMetadata = async () => {
  return {
    siteSettings: {
      metadata: {
        title: "Leo Motors",
        description: "Yo",
        keywords: "garage, voiture, reparation",
        ogImage: "/img/placeholder.svg",
      },
    },
  };
};

export const useAppStore = create<AppState>()((set) => ({
  siteSettings: initialSiteSettings,
  generalLoading: false,
  services: [],
  vehicles: [],
  theme: "dark",
  isSending: false,
  setSiteSettings: (settings) => set({ siteSettings: settings }),
  setServices: (services) => set({ services }),
  setVehicles: (vehicles) => set({ vehicles }),

  // fetchInitialData: async () => {
  //   try {
  //     const [settings, services, vehicles] = await Promise.all([
  //       getSiteSettings(),
  //       getServices(),
  //       getVehicles(),
  //     ]);
  //     set({
  //       siteSettings: settings,
  //       services: services || [],
  //       vehicles: vehicles || [],
  //     });
  //   } catch (error) {
  //     console.error("Error fetching initial data:", error);
  //   }
  // },
  updateSiteSettings: async (newSettings) => {
    try {
      const response = await fetch("/api/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      set((state) => ({
        siteSettings: state.siteSettings
          ? { ...state.siteSettings, ...newSettings }
          : null,
      }));
      await fetch("/api/revalidate");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des paramètres:", error);
      throw error;
    }
  },
  setIsSending(isSending) {
    set({ isSending });
  },
  addService: async (service) => {
    try {
      set((state) => ({ isSending: true }));
      const response = await fetch("/api/service/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      });
      if (!response.ok) throw new Error("Failed to add service");
      const newService = await response.json();
      await fetch("/api/revalidate");
      set((state) => ({
        services: [...state.services, newService.data],
      }));
    } catch (error) {
      console.error("Error adding service:", error);
      set((state) => ({ isSending: false }));
      throw error;
    }
    set((state) => ({ isSending: false }));
  },
  updateService: (index, updatedService) =>
    set(
      produce((state) => {
        Object.assign(state.services[index], updatedService);
      })
    ),
  removeService: async (id) => {
    try {
      set((state) => ({ isSending: true }));
      const response = await fetch(`/api/service?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete service");
      await fetch("/api/revalidate");
      set((state) => ({
        services: state.services.filter((service) => service.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting service:", error);
      set((state) => ({ isSending: false }));
      throw error;
    }
    set((state) => ({ isSending: false }));
  },
  addVehicle: async (vehicle) => {
    try {
      set((state) => ({ isSending: true }));
      const response = await fetch("/api/vehicle/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicle),
      });
      if (!response.ok) throw new Error("Failed to add vehicle");
      const newVehicle = await response.json();
      await fetch("/api/revalidate");
      set((state) => ({
        vehicles: [...state.vehicles, newVehicle.data],
      }));
    } catch (error) {
      console.error("Error adding vehicle:", error);
      throw error;
    }
    set((state) => ({ isSending: false }));
  },
  updateVehicle: async (id, updatedVehicle) => {
    try {
      set((state) => ({ isSending: true }));
      const response = await fetch(`/api/vehicle?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVehicle),
      });
      if (!response.ok) throw new Error("Failed to update vehicle");
      await fetch("/api/revalidate");
      set((state) => ({
        vehicles: state.vehicles.map((v) =>
          v.id === id ? { ...v, ...updatedVehicle } : v
        ),
      }));
    } catch (error) {
      console.error("Error updating vehicle:", error);
      throw error;
    }
    set((state) => ({ isSending: false }));
  },
  removeVehicle: async (id) => {
    try {
      set((state) => ({ isSending: true }));
      const response = await fetch(`/api/vehicle?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete vehicle");
      await fetch("/api/revalidate");
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v.id !== id),
      }));
    } catch (error) {
      console.error("Erreur deleting vehicle:", error);
      throw error;
    }
    set((state) => ({ isSending: false }));
  },
  closeSidebar: () => set((state) => ({ ...state, sidebarOpen: false })),
  setGeneralLoading(loading) {
    set({ generalLoading: loading });
  },
}));

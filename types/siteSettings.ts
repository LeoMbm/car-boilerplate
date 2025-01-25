import { JsonValue } from "@prisma/client/runtime/library";

export type SocialMedia = {
  facebook?: string;
  twitter?: string;
  instagram?: string;
};

export type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  hours: any;
};

export type AdminMetadata = {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
};

export type ColorMode = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
};
export interface SiteSettingsDB {
  title: string;
  description: string;
  logo: string;
  heroImage: string;
  primaryColor: string;
  secondaryColor: string;
  borderRadius: string;
  logoSize: number;
  hours?: any;
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

// servicesIcons.ts

import {
  Car,
  Wrench,
  PaintBucket,
  Gauge,
  Zap,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

export type ServiceIcon = {
  name: string;
  friendlyName: string;
  Component: React.FC<React.ComponentPropsWithoutRef<"svg">>;
};

export const defaultIcons: ServiceIcon[] = [
  { name: "Car", friendlyName: "Véhicule", Component: Car },
  { name: "Wrench", friendlyName: "Reparation", Component: Wrench },
  { name: "PaintBucket", friendlyName: "Peinture", Component: PaintBucket },
  { name: "Gauge", friendlyName: "Indicateur", Component: Gauge },
  { name: "ShieldCheck", friendlyName: "Contrôle", Component: ShieldCheck },
  { name: "Zap", friendlyName: "Zap", Component: Zap },
  { name: "HelpCircle", friendlyName: "Assistance", Component: HelpCircle },
  // Ajoutez ici d'autres icônes pour atteindre environ 20 éléments.
];

export const additionalIcons: ServiceIcon[] = [
  // Exemple d'icônes supplémentaires
  // { name: "Settings", friendlyName: "Paramètres", Component: Settings },
  // { name: "Activity", friendlyName: "Performance", Component: Activity },
];

export const allIcons: ServiceIcon[] = [...defaultIcons, ...additionalIcons];

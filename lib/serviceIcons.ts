import {
  Car,
  Wrench,
  PaintBucket,
  Gauge,
  Zap,
  ShieldCheck,
  HelpCircle,
  Activity,
  Settings,
  Siren,
  Fuel,
  TrafficCone,
  Handshake,
  ShoppingCart,
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
  { name: "Siren", friendlyName: "Sirene", Component: Siren },
  { name: "Fuel", friendlyName: "Carburant", Component: Fuel },
];

export const additionalIcons: ServiceIcon[] = [
  { name: "Settings", friendlyName: "Paramètres", Component: Settings },
  { name: "Activity", friendlyName: "Performance", Component: Activity },
  { name: "Handshake", friendlyName: "Deal", Component: Handshake },
  { name: "ShoppingCart", friendlyName: "Shopping", Component: ShoppingCart },
  {
    name: "TrafficCone",
    friendlyName: "Signalisation",
    Component: TrafficCone,
  },
];

export const allIcons: ServiceIcon[] = [...defaultIcons, ...additionalIcons];

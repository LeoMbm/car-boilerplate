"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { OpeningHours } from "@/components/admin/OpeningHours";
import { getChangedFields } from "@/lib/utils";

export function ContactSettings() {
  const { siteSettings, updateSiteSettings } = useAppStore();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(siteSettings);

  useEffect(() => {
    setLocalSettings(JSON.parse(JSON.stringify(siteSettings)));
  }, [siteSettings]);

  const handleSiteSettingsChange = (key: string, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [key]: value,
      },
    }));
  };

  const saveSiteSettings = async () => {
    if (!siteSettings) {
      toast({
        title: "Erreur",
        description: "Les paramètres du site ne sont pas disponibles.",
        variant: "destructive",
      });
      return;
    }

    const changes = getChangedFields(siteSettings, localSettings);

    if (Object.keys(changes).length === 0) {
      toast({
        title: "Aucun changement",
        description: "Aucune modification détectée.",
      });
      return;
    }

    try {
      updateSiteSettings(changes);
      console.log("Local settings updated:", changes);

      toast({
        title: "Paramètres sauvegardés",
        description:
          "Les informations de contact ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "La mise à jour des paramètres a échoué.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de contact</CardTitle>
        <CardDescription>
          Mettez à jour les informations de contact de votre entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactAddress">Adresse</Label>
          <Input
            id="contactAddress"
            value={localSettings.contactInfo?.address || ""}
            onChange={(e) =>
              handleSiteSettingsChange("address", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Téléphone</Label>
          <Input
            id="contactPhone"
            value={localSettings.contactInfo?.phone || ""}
            onChange={(e) => handleSiteSettingsChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            value={localSettings.contactInfo?.email || ""}
            onChange={(e) => handleSiteSettingsChange("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Heures d'ouverture</Label>
          <OpeningHours
            value={localSettings.contactInfo?.hours || "{}"}
            onChange={(hours) => handleSiteSettingsChange("hours", hours)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveSiteSettings}>
          Enregistrer les informations de contact
        </Button>
      </CardFooter>
    </Card>
  );
}

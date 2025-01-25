"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Upload } from "lucide-react";
import { LivePreview } from "@/components/admin/LivePreview";
import Select from "react-select";
import { useToast } from "@/hooks/use-toast";
import { getChangedFields } from "@/lib/utils";

export function HomePageSettings() {
  const { siteSettings, updateSiteSettings, services, vehicles } =
    useAppStore();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState(siteSettings);
  const [errors, setErrors] = useState({
    featuredServices: "",
    featuredVehicles: "",
  });

  useEffect(() => {
    setLocalSettings(siteSettings);
  }, [siteSettings]);

  const handleSiteSettingsChange = (key: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const validateSettings = () => {
    let isValid = true;
    const newErrors = { featuredServices: "", featuredVehicles: "" };

    if (localSettings.featuredServices.length !== 3) {
      newErrors.featuredServices =
        "Vous devez sélectionner exactement 3 services.";
      isValid = false;
    }

    if (localSettings.featuredVehicles.length > 5) {
      newErrors.featuredVehicles =
        "Vous pouvez sélectionner au maximum 5 véhicules.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // const saveSiteSettings = () => {

  // };

  const saveSiteSettings = async () => {
    if (!siteSettings) {
      toast({
        title: "Erreur",
        description: "Les paramètres du site ne sont pas disponibles.",
        variant: "destructive",
      });
      return;
    }
    if (validateSettings()) {
      // updateSiteSettings(localSettings);
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
      toast({
        title: "Paramètres sauvegardés",
        description:
          "Les paramètres de la page d'accueil ont été mis à jour avec succès.",
      });
    } else {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs avant de sauvegarder.",
        variant: "destructive",
      });
    }
  };

  const serviceOptions = services.map((service) => ({
    value: service.id,
    label: service.title,
  }));
  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.id.toString(),
    label: vehicle.name,
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Page d'accueil</CardTitle>
          <CardDescription>
            Personnalisez la page d'accueil de votre site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroImage">Image de héros</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="heroImage"
                value={localSettings.heroImage}
                onChange={(e) =>
                  handleSiteSettingsChange("heroImage", e.target.value)
                }
                placeholder="URL de l'image de héros"
              />
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Services en vedette</Label>
            <Select
              isMulti
              options={serviceOptions}
              value={serviceOptions.filter((option) =>
                localSettings.featuredServices.includes(parseInt(option.value))
              )}
              onChange={(selectedOptions) => {
                const selectedServices = selectedOptions.map(
                  (option) => option.value
                );
                if (selectedServices.length <= 3) {
                  handleSiteSettingsChange(
                    "featuredServices",
                    selectedServices
                  );
                }
              }}
              placeholder="Sélectionnez exactement 3 services"
            />
            {errors.featuredServices && (
              <p className="text-red-500 text-sm">{errors.featuredServices}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Véhicules en vedette</Label>
            <Select
              isMulti
              options={vehicleOptions}
              value={vehicleOptions.filter((option) =>
                localSettings.featuredVehicles.includes(Number(option.value))
              )}
              onChange={(selectedOptions) => {
                const selectedVehicles = selectedOptions.map((option) =>
                  Number(option.value)
                );
                handleSiteSettingsChange("featuredVehicles", selectedVehicles);
              }}
              placeholder="Sélectionnez jusqu'à 4 véhicules"
            />
            {errors.featuredVehicles && (
              <p className="text-red-500 text-sm">{errors.featuredVehicles}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveSiteSettings}>Enregistrer les paramètres</Button>
        </CardFooter>
      </Card>
      <LivePreview title="Aperçu de l'image de héros">
        <img
          src={localSettings.heroImage || "/img/placeholder.svg"}
          alt="Hero"
          className="w-full h-48 object-cover rounded"
        />
      </LivePreview>
    </>
  );
}

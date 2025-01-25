"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/lib/store";
import { Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { ColorTemplateSelector } from "./ColorTemplateSelector";
import { getChangedFields } from "@/lib/utils";
import { SiteSettings } from "@/lib/db";
import Loading from "../LoaderComp";

export function GeneralSettings() {
  const { siteSettings, updateSiteSettings, generalLoading } = useAppStore();
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<Partial<SiteSettings>>(
    siteSettings as Partial<SiteSettings>
  );
  const [isLoading, setIsLoading] = useState(true);
  const [logoSize, setLogoSize] = useState(25);

  // useEffect(() => {
  //   // Simuler un chargement
  // }, []);

  const handleSiteSettingsChange = (key: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "logoSize") {
      setLogoSize(value);
    }
  };

  const handleLogoSizeChange = (value: number[]) => {
    setLogoSize(value[0]);
    handleSiteSettingsChange("logoSize", value[0]);
  };

  if (!siteSettings) {
    return <Loading />;
  }
  useEffect(() => {
    if (siteSettings && Object.keys(siteSettings).length > 1) {
      setLocalSettings(siteSettings);
      setLogoSize(siteSettings.logoSize || 25);
      setIsLoading(false);
    }
  }, [siteSettings]);

  // const saveSiteSettings = () => {
  //   updateSiteSettings(localSettings);
  //   toast({
  //     title: "Paramètres sauvegardés",
  //     description: "Les paramètres du site ont été mis à jour avec succès.",
  //   });
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

  // if (isLoading) {
  //   return <Loading />;
  // }
  console.log(siteSettings);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
        <CardDescription>
          Personnalisez les paramètres généraux de votre site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="siteTitle">Titre du site</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="siteTitle"
              value={localSettings.title}
              onChange={(e) =>
                handleSiteSettingsChange("title", e.target.value)
              }
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="siteDescription">Description du site</Label>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <Textarea
              id="siteDescription"
              value={localSettings.description}
              onChange={(e) =>
                handleSiteSettingsChange("description", e.target.value)
              }
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="siteLogo">Logo du site</Label>
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                id="siteLogo"
                value={localSettings.logo}
                onChange={(e) =>
                  handleSiteSettingsChange("logo", e.target.value)
                }
                placeholder="URL du logo"
              />
            )}
            <Button variant="outline" disabled={isLoading}>
              <Upload className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoSize">Taille du logo</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Slider
              id="logoSize"
              min={20}
              max={200}
              step={10}
              value={[logoSize]}
              onValueChange={handleLogoSizeChange}
            />
          )}
        </div>
        {isLoading ? (
          <Skeleton className="h-40 w-40" />
        ) : (
          localSettings.logo && (
            <div
              className="relative"
              style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
            >
              <Image
                priority={true}
                src={localSettings.logo || "/img/placeholder.svg"}
                alt="Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
          )
        )}
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <Skeleton className="h-5 w-5" />
          ) : (
            <Checkbox
              id="showLogo"
              checked={localSettings.showLogo}
              onCheckedChange={(checked) =>
                handleSiteSettingsChange("showLogo", checked)
              }
            />
          )}
          <Label htmlFor="showLogo">Afficher le logo</Label>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <Skeleton className="h-5 w-5" />
          ) : (
            <Checkbox
              id="showTitle"
              checked={localSettings.showTitle}
              onCheckedChange={(checked) =>
                handleSiteSettingsChange("showTitle", checked)
              }
            />
          )}
          <Label htmlFor="showTitle">Afficher le titre du site</Label>
        </div>
        <div className="space-y-2">
          <Label>Réseaux sociaux</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            Object.entries(localSettings.socialMedia).map(([platform, url]) => (
              <div key={platform} className="flex items-center space-x-2">
                <Label htmlFor={`social-${platform}`} className="w-24">
                  {platform.charAt(0).toUpperCase() + platform.substring(1)}
                </Label>
                <Input
                  id={`social-${platform}`}
                  value={url}
                  onChange={(e) =>
                    handleSiteSettingsChange("socialMedia", {
                      ...localSettings.socialMedia,
                      [platform]: e.target.value,
                    })
                  }
                  placeholder={`URL ${platform}`}
                />
              </div>
            ))
          )}
          {/* Maybe in V@ */}
          {/* <ColorTemplateSelector /> */}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveSiteSettings} disabled={isLoading}>
          {isLoading ? "Chargement..." : "Enregistrer les paramètres"}
        </Button>
      </CardFooter>
    </Card>
  );
}

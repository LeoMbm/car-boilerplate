"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getChangedFields } from "@/lib/utils";

export function MetadataSettings() {
  const { siteSettings, updateSiteSettings } = useAppStore();
  const { toast } = useToast();
  const [localMetadata, setLocalMetadata] = useState(siteSettings.metadata);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLocalMetadata(siteSettings.metadata);
    setIsLoading(false);
  }, [siteSettings.metadata]);

  const handleMetadataChange = (key: string, value: string) => {
    setLocalMetadata((prev) => ({ ...prev, [key]: value }));
  };

  // const saveMetadata = () => {
  //   updateSiteSettings({ metadata: localMetadata });
  //   toast({
  //     title: "Métadonnées sauvegardées",
  //     description: "Les métadonnées du site ont été mises à jour avec succès.",
  //   });
  // };

  const saveMetadata = async () => {
    if (!siteSettings) {
      toast({
        title: "Erreur",
        description: "Les paramètres du site ne sont pas disponibles.",
        variant: "destructive",
      });
      return;
    }

    const changes = getChangedFields(siteSettings.metadata, localMetadata);

    if (Object.keys(changes).length === 0) {
      toast({
        title: "Aucun changement",
        description: "Aucune modification détectée.",
      });
      return;
    }

    try {
      updateSiteSettings({ metadata: changes });

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
        <CardTitle>Métadonnées du site</CardTitle>
        <CardDescription>
          Gérez les métadonnées pour le référencement de votre site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Titre de la page (meta title)</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="metaTitle"
              value={localMetadata.title}
              onChange={(e) => handleMetadataChange("title", e.target.value)}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">
            Description (meta description)
          </Label>
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <Textarea
              id="metaDescription"
              value={localMetadata.description}
              onChange={(e) =>
                handleMetadataChange("description", e.target.value)
              }
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaKeywords">Mots-clés (meta keywords)</Label>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              id="metaKeywords"
              value={localMetadata.keywords}
              onChange={(e) => handleMetadataChange("keywords", e.target.value)}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="ogImage">Image Open Graph</Label>
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                id="ogImage"
                value={localMetadata.ogImage}
                onChange={(e) =>
                  handleMetadataChange("ogImage", e.target.value)
                }
                placeholder="URL de l'image Open Graph"
              />
            )}
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={saveMetadata} disabled={isLoading}>
          {isLoading ? "Chargement..." : "Enregistrer les métadonnées"}
        </Button>
      </CardFooter>
    </Card>
  );
}

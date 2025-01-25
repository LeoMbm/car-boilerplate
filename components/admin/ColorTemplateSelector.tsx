"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

type ColorTemplate = {
  name: string;
  light: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
  };
  dark: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
  };
};

const colorTemplates: ColorTemplate[] = [
  {
    name: "Default (Black & White)",
    light: {
      background: "#ffffff",
      foreground: "#000000",
      primary: "#0f172a",
      secondary: "#f1f5f9",
    },
    dark: {
      background: "#0f172a",
      foreground: "#ffffff",
      primary: "#e2e8f0",
      secondary: "#1e293b",
    },
  },
  {
    name: "Ocean Blue",
    light: {
      background: "#f0f9ff",
      foreground: "#0c4a6e",
      primary: "#0284c7",
      secondary: "#e0f2fe",
    },
    dark: {
      background: "#0c4a6e",
      foreground: "#e0f2fe",
      primary: "#38bdf8",
      secondary: "#0369a1",
    },
  },
  {
    name: "Forest Green",
    light: {
      background: "#f0fdf4",
      foreground: "#14532d",
      primary: "#16a34a",
      secondary: "#dcfce7",
    },
    dark: {
      background: "#14532d",
      foreground: "#dcfce7",
      primary: "#4ade80",
      secondary: "#166534",
    },
  },
  {
    name: "Sunset Orange",
    light: {
      background: "#fff7ed",
      foreground: "#7c2d12",
      primary: "#ea580c",
      secondary: "#fed7aa",
    },
    dark: {
      background: "#7c2d12",
      foreground: "#fed7aa",
      primary: "#fb923c",
      secondary: "#9a3412",
    },
  },
  {
    name: "Royal Purple",
    light: {
      background: "#faf5ff",
      foreground: "#4a1d96",
      primary: "#7e22ce",
      secondary: "#e9d5ff",
    },
    dark: {
      background: "#4a1d96",
      foreground: "#e9d5ff",
      primary: "#a855f7",
      secondary: "#6b21a8",
    },
  },
];

export function ColorTemplateSelector() {
  const { updateSiteSettings, siteSettings } = useAppStore();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] =
    useState<ColorTemplate | null>(null);

  const handleSelectTemplate = (template: ColorTemplate) => {
    setSelectedTemplate(template);
  };

  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      updateSiteSettings({
        colorTemplate: selectedTemplate.name,
        lightModeColors: selectedTemplate.light,
        darkModeColors: selectedTemplate.dark,
      });
      toast({
        title: "Template de couleurs appliqué",
        description: `Le template "${selectedTemplate.name}" a été appliqué avec succès.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélection du template de couleurs</CardTitle>
        <CardDescription>
          Choisissez un template de couleurs pour personnaliser l'apparence de
          votre site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorTemplates.map((template) => (
            <Button
              key={template.name}
              variant={
                selectedTemplate?.name === template.name ? "default" : "outline"
              }
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => handleSelectTemplate(template)}
            >
              <span className="font-bold">{template.name}</span>
              <div className="w-full flex space-x-2">
                <div
                  className="w-1/2 h-16 rounded"
                  style={{ backgroundColor: template.light.background }}
                >
                  <div
                    className="w-full h-1/2"
                    style={{ backgroundColor: template.light.primary }}
                  />
                  <div
                    className="w-full h-1/2"
                    style={{ backgroundColor: template.light.secondary }}
                  />
                </div>
                <div
                  className="w-1/2 h-16 rounded"
                  style={{ backgroundColor: template.dark.background }}
                >
                  <div
                    className="w-full h-1/2"
                    style={{ backgroundColor: template.dark.primary }}
                  />
                  <div
                    className="w-full h-1/2"
                    style={{ backgroundColor: template.dark.secondary }}
                  />
                </div>
              </div>
            </Button>
          ))}
        </div>
        <Button
          className="mt-4"
          onClick={handleApplyTemplate}
          disabled={!selectedTemplate}
        >
          Appliquer le template sélectionné
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Trash2 } from "lucide-react";
import { IconPicker } from "@/components/admin/IconPicker";
import { LivePreview } from "@/components/admin/LivePreview";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IconPickerCommandPalette } from "../CommandIcon";

export function ServicesSettings() {
  const { services, addService, updateService, removeService, isSending } =
    useAppStore();
  const { toast } = useToast();
  const [newService, setNewService] = useState({
    icon: "",
    title: "",
    description: "",
    details: [],
  });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: null as (() => void) | null,
    title: "",
    description: "",
  });

  const handleNewServiceChange = (key: string, value: string) => {
    setNewService((prev) => ({ ...prev, [key]: value }));
  };

  const addNewService = () => {
    addService(newService);
    toast({
      title: "Service ajouté",
      description: "Le nouveau service a été ajouté avec succès.",
    });
    setNewService({ icon: "", title: "", description: "", details: [] });
  };

  console.log(services);

  const removeServiceConfirm = (index: number) => {
    setConfirmDialog({
      isOpen: true,
      action: () => {
        removeService(index);
        setConfirmDialog({
          isOpen: false,
          action: null,
          title: "",
          description: "",
        });
      },
      title: "Supprimer le service",
      description:
        "Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>
            Gérez les services affichés sur votre site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service, index) => (
            <div key={service.id} className="space-y-2 border-b pb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Service {index + 1}</h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeServiceConfirm(service.id as number)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`serviceIcon${index}`}>Icône</Label>
                <IconPickerCommandPalette
                  onChange={(icon) =>
                    updateService(index, { ...service, icon })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`serviceTitle${index}`}>Titre</Label>
                <Input
                  id={`serviceTitle${index}`}
                  value={service.title}
                  onChange={(e) =>
                    updateService(index, { ...service, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`serviceDescription${index}`}>
                  Description
                </Label>
                <Textarea
                  id={`serviceDescription${index}`}
                  value={service.description}
                  onChange={(e) =>
                    updateService(index, {
                      ...service,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Ajouter un nouveau service
            </h3>
            <div className="space-y-2">
              <Label htmlFor="newServiceIcon">Icône</Label>
              <IconPickerCommandPalette
                onChange={(icon) => handleNewServiceChange("icon", icon)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newServiceTitle">Titre</Label>
              <Input
                id="newServiceTitle"
                value={newService.title}
                onChange={(e) =>
                  handleNewServiceChange("title", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newServiceDescription">Description</Label>
              <Textarea
                id="newServiceDescription"
                value={newService.description}
                onChange={(e) =>
                  handleNewServiceChange("description", e.target.value)
                }
              />
            </div>
            <Button onClick={addNewService} disabled={isSending}>
              Ajouter le service
            </Button>
          </div>
        </CardContent>
      </Card>
      <LivePreview title="Aperçu des services">
        <div className="grid gap-4 md:grid-cols-3">
          {services.map((service, index) => {
            const IconComponent =
              (LucideIcons[
                service.icon as keyof typeof LucideIcons
              ] as React.ComponentType<{ className?: string }>) ||
              LucideIcons.HelpCircle;
            return (
              <Card key={index}>
                <CardHeader>
                  <IconComponent className="w-10 h-10 mb-2" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </LivePreview>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() =>
          setConfirmDialog({
            isOpen: false,
            action: null,
            title: "",
            description: "",
          })
        }
        onConfirm={() => confirmDialog.action && confirmDialog.action()}
        title={confirmDialog.title}
        description={confirmDialog.description}
      />
    </>
  );
}

"use client";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Search, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ModifyVehicleModal } from "./modal/ModifyVehicleModal";
import { supabase } from "@/lib/supabaseClient";

const characteristicOptions = [
  { key: "mileage", label: "Kilométrage", type: "number", unit: "km" },
  {
    key: "transmission",
    label: "Transmission",
    type: "select",
    options: ["Manuelle", "Automatique"],
  },
  {
    key: "fuelType",
    label: "Carburant",
    type: "select",
    options: ["Essence", "Diesel", "Électrique", "Hybride"],
  },
  { key: "color", label: "Couleur", type: "text" },
  { key: "doors", label: "Nombre de portes", type: "number" },
  { key: "horsepower", label: "Puissance", type: "number", unit: "ch" },
  { key: "options", label: "Options", type: "text" },
];

export function VehiclesSettings() {
  const { vehicles, addVehicle, updateVehicle, removeVehicle, isSending } =
    useAppStore();
  const { toast } = useToast();
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    brand: "",
    price: "",
    year: "",
    description: "",
    mainImage: "",
    additionalImages: [] as string[],
    characteristics: {} as Record<string, string>,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: null,
    title: "",
    description: "",
  });
  const starButtonClass = "transition-colors duration-200";
  const starButtonSelectedClass =
    "bg-yellow-400 hover:bg-yellow-500 text-white";
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImagesFiles, setAdditionalImagesFiles] = useState<File[]>(
    []
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNewVehicleChange = (key: string, value: string | object) => {
    setNewVehicle((prev) => ({ ...prev, [key]: value }));
  };

  const handleCharacteristicChange = (key: string, value: string) => {
    setNewVehicle((prev) => {
      const updatedVehicle = {
        ...prev,
        characteristics: { ...prev.characteristics, [key]: value },
      };
      return updatedVehicle;
    });
  };

  const removeCharacteristic = (key: string) => {
    setNewVehicle((prev) => {
      const newCharacteristics = { ...prev.characteristics };
      delete newCharacteristics[key];
      return { ...prev, characteristics: newCharacteristics };
    });
  };

  const addNewVehicle = async () => {
    if (
      !newVehicle.name ||
      !newVehicle.brand ||
      !newVehicle.price ||
      !newVehicle.year ||
      !newVehicle.description
    ) {
      toast({
        title: "Véhicule non ajouté",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", newVehicle.name);
      formData.append("brand", newVehicle.brand);
      formData.append("price", newVehicle.price.toString());
      formData.append("year", newVehicle.year.toString());
      formData.append("description", newVehicle.description);
      formData.append(
        "characteristics",
        JSON.stringify(newVehicle.characteristics)
      );

      // Ajouter l'image principale si disponible
      if (selectedFiles[0]) {
        formData.append("mainImage", selectedFiles[0]);
      }

      // Ajouter les images additionnelles
      selectedFiles.slice(1).forEach((file) => {
        formData.append("additionalImages", file);
      });

      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await fetch("/api/vehicle/add", {
        // Assurez-vous que le chemin est correct
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du véhicule.");
      }

      const result = await response.json();

      toast({
        title: "Véhicule ajouté",
        description:
          "Le nouveau véhicule a été ajouté au catalogue avec succès.",
        duration: 5000,
      });

      // Réinitialiser le formulaire
      setNewVehicle({
        name: "",
        brand: "",
        price: "",
        year: "",
        description: "",
        mainImage: "",
        additionalImages: [],
        characteristics: {},
      });
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du véhicule:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter le véhicule.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteVehicle = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      action: () => {
        removeVehicle(id);
        toast({
          title: "Véhicule supprimé",
          description:
            "Le véhicule a bien été supprimé du catalogue. \n Rafraichissez la page pour voir les modifications.",
          duration: 5000,
        });
      },
      title: "Suppression de véhicule",
      description: "Etes-vous sur de vouloir supprimer ce véhicule ?",
    });
  };

  const setMainImage = (image: string) => {
    setNewVehicle((prev) => ({
      ...prev,
      mainImage: image,
    }));
  };

  const removeImage = (image: string) => {
    setNewVehicle((prev) => {
      const updatedImages = prev.additionalImages.filter(
        (img) => img !== image
      );
      return {
        ...prev,
        additionalImages: updatedImages,
        mainImage:
          prev.mainImage === image ? updatedImages[0] || "" : prev.mainImage,
      };
    });

    setSelectedFiles((prev) =>
      prev.filter((file) => {
        const url = URL.createObjectURL(file);
        return url !== image;
      })
    );
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateVehicle(editingVehicle.id, editingVehicle);
    toast({
      title: "Véhicule modifié",
      description: "Le véhicule a bien été modifié du catalogue.",
      duration: 3000,
    });
    setEditingVehicle(null); // Fermer le modal
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files) {
  //     const newImages = Array.from(files)
  //       .slice(0, 10)
  //       .map((file) => URL.createObjectURL(file));
  //     setNewVehicle((prev) => ({
  //       ...prev,
  //       additionalImages: [...prev.additionalImages, ...newImages].slice(0, 10),
  //       mainImage: prev.mainImage || newImages[0],
  //     }));
  //   }
  // };
  // const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log(files);

    if (files) {
      const fileArray = Array.from(files);
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      const validFiles = fileArray.filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "Type de fichier non autorisé",
            description: `Le fichier ${file.name} n'est pas une image valide.`,
            variant: "destructive",
            duration: 5000,
          });
          return false;
        }

        if (file.size > maxSize) {
          toast({
            title: "Fichier trop volumineux",
            description: `Le fichier ${file.name} dépasse la taille maximale de 5MB.`,
            variant: "destructive",
            duration: 5000,
          });
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        const newImages = validFiles.map((file) => URL.createObjectURL(file));

        setNewVehicle((prev) => {
          const updatedImages = [...prev.additionalImages, ...newImages];
          return {
            ...prev,
            mainImage: prev.mainImage || updatedImages[0],
            additionalImages: updatedImages.slice(0, 10),
          };
        });

        setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 10));
      }
    }
  };
  useEffect(() => {
    // No cleanup needed for Supabase URLs
  }, [newVehicle.additionalImages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des véhicules</CardTitle>
        <CardDescription>
          Ajoutez, modifiez ou supprimez des véhicules
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Ajouter un nouveau véhicule</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleBrand">Marque*</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  aria-autocomplete="none"
                  id="vehicleBrand"
                  value={newVehicle.brand}
                  onChange={(e) =>
                    handleNewVehicleChange("brand", e.target.value)
                  }
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Modéle*</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="name"
                  aria-autocomplete="none"
                  value={newVehicle.name}
                  onChange={(e) =>
                    handleNewVehicleChange("name", e.target.value)
                  }
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix*</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="price"
                  type="number"
                  aria-autocomplete="none"
                  value={newVehicle.price}
                  onChange={(e) =>
                    handleNewVehicleChange("price", e.target.value)
                  }
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Année*</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Input
                  id="year"
                  type="number"
                  aria-autocomplete="none"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={newVehicle.year}
                  onChange={(e) =>
                    handleNewVehicleChange("year", e.target.value)
                  }
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <Textarea
                id="description"
                value={newVehicle.description}
                onChange={(e) =>
                  handleNewVehicleChange("description", e.target.value)
                }
              />
            )}
          </div>
          {/* <div className="space-y-2">
            <Label>Images du véhicule</Label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageSelection}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Ajouter des images (max 10)
              </Button>
            </div> */}

          {/* Prévisualisation des images */}
          {/* {mainImageFile && (
              <div className="relative">
                <Image
                  src={URL.createObjectURL(mainImageFile)}
                  alt="Image principale"
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-0 right-0"
                  onClick={() => setMainImageFile(null)}
                >
                  ×
                </Button>
              </div>
            )} */}

          <div className="space-y-2">
            <Label htmlFor="vehicleImages">Images du véhicule</Label>

            <div className="flex items-center space-x-2">
              <input
                id="vehicleImages"
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageSelection}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Ajouter des images (max 10)
              </Button>
            </div>
            {newVehicle.mainImage && (
              <div className="relative mt-4">
                <Image
                  src={newVehicle.mainImage}
                  alt="Image principale"
                  width={200}
                  height={200}
                  className="object-cover rounded"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-0 right-0"
                  onClick={() =>
                    setNewVehicle((prev) => ({ ...prev, mainImage: "" }))
                  }
                >
                  ×
                </Button>
              </div>
            )}

            {/* Prévisualisation des Images Additionnelles */}
            {newVehicle.additionalImages.length > 0 ? (
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-5 gap-4">
                    {newVehicle.additionalImages.map((img, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Vehicle ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover rounded"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-0 right-0"
                          onClick={() => removeImage(img)}
                        >
                          ×
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            newVehicle.mainImage === img ? "default" : "outline"
                          }
                          className={cn(
                            "absolute bottom-0 right-0",
                            starButtonClass,
                            newVehicle.mainImage === img &&
                              starButtonSelectedClass
                          )}
                          onClick={() => setMainImage(img)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p>Pas de photo</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Caractéristiques</Label>
            {characteristicOptions.map((option) => (
              <div key={option.key} className="flex items-center space-x-2">
                <Label htmlFor={option.key} className="w-1/4">
                  {option.label}{" "}
                  {option.unit && (
                    <span className="text-sm text-gray-500">{`(${option.unit})`}</span>
                  )}
                </Label>
                {option.type === "select" ? (
                  <Select
                    value={newVehicle.characteristics[option.key] || ""}
                    onValueChange={(value) =>
                      handleCharacteristicChange(option.key, value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={`Sélectionner ${option.label.toLowerCase()}`}
                      />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {option.options?.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={option.key}
                    type={option.type}
                    value={newVehicle.characteristics[option.key] || ""}
                    onChange={(e) =>
                      handleCharacteristicChange(option.key, e.target.value)
                    }
                    placeholder={option.label}
                  />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCharacteristic(option.key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={addNewVehicle} disabled={isLoading || isSending}>
            {isLoading ? "Chargement..." : "Ajouter le véhicule"}
          </Button>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Véhicules existants</h3>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Rechercher un véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isLoading
            ? Array(3)
                .fill(null)
                .map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-1/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
            : filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id}>
                  <CardHeader>
                    <CardTitle>{vehicle.name}</CardTitle>
                    <CardDescription>
                      {vehicle.brand} - {vehicle.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Prix: {vehicle.price} €</p>
                    <p>{vehicle.description}</p>
                    <div className="mt-2">
                      <h4 className="font-semibold">Caractéristiques:</h4>
                      <ul className="list-disc list-inside">
                        {Object.entries(vehicle.characteristics).map(
                          ([key, value], index) => (
                            <li key={index}>
                              {characteristicOptions.find(
                                (opt) => opt.key === key
                              )?.label || key}
                              : {value}
                              {key === "horsepower" ? " Ch" : ""}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleDeleteVehicle(vehicle.id.toString())}
                      disabled={isSending}
                    >
                      Supprimer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>
      </CardContent>

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
        onConfirm={() => {
          if (confirmDialog.action) {
            confirmDialog.action();
          }
          setConfirmDialog({
            isOpen: false,
            action: null,
            title: "",
            description: "",
          });
        }}
        title={confirmDialog.title}
        description={confirmDialog.description}
      />
      <ModifyVehicleModal
        isOpen={!!editingVehicle}
        onClose={() => setEditingVehicle(null)}
        title="Modifier le véhicule"
      >
        {editingVehicle && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editVehicleName">Nom*</Label>
                <Input
                  id="editVehicleName"
                  className="w-full dark:bg-zinc-950"
                  value={editingVehicle.name}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editVehicleBrand">Marque*</Label>
                <Input
                  id="editVehicleBrand"
                  className="w-full dark:bg-zinc-950"
                  value={editingVehicle.brand}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      brand: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editVehiclePrice">Prix*</Label>
                <Input
                  id="editVehiclePrice"
                  type="number"
                  className="w-full dark:bg-zinc-950"
                  value={editingVehicle.price}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      price: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editVehicleYear">Année*</Label>
                <Input
                  id="editVehicleYear"
                  type="number"
                  className="w-full dark:bg-zinc-950"
                  value={editingVehicle.year}
                  onChange={(e) =>
                    setEditingVehicle({
                      ...editingVehicle,
                      year: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editVehicleDescription">Description*</Label>
              <Textarea
                id="editVehicleDescription"
                value={editingVehicle.description}
                className="w-full dark:bg-zinc-950"
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* Ajoutez d'autres champs de formulaire selon les besoins */}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingVehicle(null)}
              >
                Annuler
              </Button>
              <Button type="submit" variant="default">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        )}
      </ModifyVehicleModal>
    </Card>
  );
}

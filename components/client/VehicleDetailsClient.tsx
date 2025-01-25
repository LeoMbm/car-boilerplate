"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";
import Loading from "../LoaderComp";

// Add slider images

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

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

interface VehicleData {
  id: number;
  name: string;
  brand: string;
  model?: string;
  year: number;
  price: number;
  description?: string;
  mainImage?: string;
  additionalImages?: string[];
  characteristics: { name: string; value: string }[];
}

interface VehicleDetailsClientProps {
  id: string;
}

export default function VehicleDetailsClient({
  id,
}: VehicleDetailsClientProps) {
  const { toast } = useToast();
  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const { vehicles, generalLoading, setGeneralLoading } = useAppStore();
  const [vehicleData, setVehicleData] = useState<VehicleData>();

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demande envoyée",
      description:
        "Nous vous contacterons bientôt pour discuter de votre intérêt pour ce véhicule.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const [characteristicsArray, setCharacteristicsArray] = useState([{}]);
  useEffect(() => {
    const vehicle = vehicles.find((v) => v.id === parseInt(id));
    if (vehicle) {
      setVehicleData(vehicle);
      setCharacteristicsArray(
        Object.entries(vehicle.characteristics || {}).map(([key, value]) => ({
          name: key,
          value,
        }))
      );
    }

    return () => {};
  }, [id, vehicles]);

  if (!vehicleData) return <Loading />;

  const combinedImages = [
    vehicleData.mainImage,
    ...(vehicleData.additionalImages || []),
  ].filter(Boolean);

  return (
    <>
      <div className="container px-4 py-16 md:px-6">
        <motion.h1
          className="text-3xl font-bold tracking-tighter mb-8"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          {vehicleData.name}
        </motion.h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial="initial" animate="animate" variants={fadeIn}>
            <Card>
              <CardContent className="p-0">
                <Image
                  priority={true}
                  src={combinedImages[activeImage] || "/img/placeholder.svg"}
                  alt={vehicleData.name}
                  width={600}
                  height={400}
                  className="w-full object-cover rounded-t-lg"
                />
                <div className="flex justify-center mt-4 space-x-2 p-4">
                  {combinedImages.length > 1 &&
                    combinedImages.map((_, index) => (
                      <Button
                        key={index}
                        variant={index === activeImage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveImage(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Marque:</strong> {vehicleData.brand}
                  </p>
                  <p>
                    <strong>Modèle:</strong> {vehicleData.name}
                  </p>
                  <p>
                    <strong>Année:</strong> {vehicleData.year}
                  </p>
                  <p>
                    <strong>Prix:</strong> {vehicleData.price.toLocaleString()}{" "}
                    €
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{vehicleData.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {characteristicsArray.map((char, index) => {
                        const option = characteristicOptions.find(
                          (opt) => opt.key === char.name
                        );

                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {option?.label || char.name}
                            </TableCell>
                            <TableCell>
                              {char.value}
                              {option?.unit ? ` ${option.unit}` : ""}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <Card>
            <CardHeader>
              <CardTitle>Intéressé par ce véhicule ?</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous contacterons
                rapidement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-green-800 hover:bg-green-900 dark:bg-green-400 dark:hover:bg-green-500"
                >
                  Envoyer la demande
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
}

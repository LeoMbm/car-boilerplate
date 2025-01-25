"use client";

import { ImageSkeleton } from "@/components/client/ImageSkeleton";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function CatalogueClient() {
  const { vehicles, generalLoading } = useAppStore();
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const [filters, setFilters] = useState({
    brand: "",
    minPrice: 0,
    maxPrice: 100000,
    minYear: 1990,
    maxYear: 2025,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const filtered = vehicles.filter((vehicle) => {
      const searchTerm = filters.brand.toLowerCase().trim();
      const matchesBrand =
        !searchTerm || vehicle.brand.toLowerCase() === searchTerm;

      const matchesPrice =
        vehicle.price >= filters.minPrice && vehicle.price <= filters.maxPrice;

      const matchesYear =
        vehicle.year >= filters.minYear && vehicle.year <= filters.maxYear;

      return matchesBrand && matchesPrice && matchesYear;
    });

    setFilteredVehicles(filtered);
  };

  useEffect(() => {
    setFilteredVehicles(vehicles);
  }, [vehicles]);

  return (
    <motion.div
      className="container px-4 py-16 md:px-6"
      initial="initial"
      animate="animate"
      variants={{
        animate: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <motion.h1
        className="text-3xl font-bold tracking-tighter mb-8"
        variants={fadeIn}
      >
        Catalogue de véhicules
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8">
        <motion.div className="w-full md:w-1/4 space-y-6" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="brand">
                  Marque
                </label>
                <Input
                  id="brand"
                  placeholder="Rechercher une marque"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Prix</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange(
                        "minPrice",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxPrice",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Année</label>
                <Slider
                  min={1990}
                  max={2025}
                  step={1}
                  value={[filters.minYear, filters.maxYear]}
                  onValueChange={(value) => {
                    handleFilterChange("minYear", value[0]);
                    handleFilterChange("maxYear", value[1]);
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span>{filters.minYear}</span>
                  <span>{filters.maxYear}</span>
                </div>
              </div>
              <Button
                onClick={applyFilters}
                className="w-full bg-green-800 hover:bg-green-900 dark:bg-green-400 dark:hover:bg-green-500"
              >
                <Filter className="mr-2 h-4 w-4" />
                Appliquer les filtres
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="w-full md:w-3/4"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {generalLoading
              ? Array(6)
                  .fill(null)
                  .map((_, index) => (
                    <motion.div key={index} variants={fadeIn}>
                      <Card className="overflow-hidden">
                        <ImageSkeleton />
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-6 w-1/3" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-10 w-full" />
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
              : filteredVehicles.map((vehicle) => (
                  <motion.div key={vehicle.id} variants={fadeIn}>
                    <Card className="overflow-hidden">
                      <Image
                        priority={true}
                        src={vehicle.mainImage || "/img/placeholder.svg"}
                        alt={vehicle.name}
                        width={300}
                        height={200}
                        className="w-full object-cover h-48"
                      />
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{vehicle.name}</CardTitle>
                            <CardDescription>{vehicle.brand}</CardDescription>
                          </div>
                          <Badge>{vehicle.year}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          {vehicle.price.toLocaleString()} €
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          asChild
                          className="w-full bg-green-800 hover:bg-green-900 dark:bg-green-400 dark:hover:bg-green-500"
                        >
                          <Link href={`/catalogue/${vehicle.id}`}>
                            Voir les détails
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

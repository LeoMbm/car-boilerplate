"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import * as Icons from "lucide-react";
import { useState, useEffect } from "react";
import { ImageSkeleton } from "@/components/client/ImageSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function HomeClient() {
  const { siteSettings, services, vehicles, generalLoading } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();
  const { theme } = useTheme();
  const containerVariants = {
    initial: {}, // Définissez initial si nécessaire
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // useEffect(() => {
  //   // Simuler un chargement
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  const featuredServices = services.filter((service) =>
    siteSettings?.featuredServices?.includes(service.id)
  );
  const featuredVehicles = vehicles.filter((vehicle) =>
    siteSettings?.featuredVehicles?.includes(vehicle.id)
  );

  useEffect(() => {
    controls.start("animate");
  }, [theme, controls]);

  return (
    <div className="space-y-16 py-8 md:py-16">
      <motion.section
        key={theme}
        className="container px-4 md:px-6"
        initial="initial"
        animate="animate"
        variants={containerVariants}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            className="flex flex-col justify-center space-y-4"
            variants={fadeIn}
          >
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                variants={fadeIn}
              >
                {generalLoading ? (
                  <Skeleton className="h-12 w-3/4" />
                ) : (
                  siteSettings?.title
                )}
              </motion.h1>
              <motion.div
                className="max-w-[600px] text-muted-foreground md:text-xl"
                variants={fadeIn}
              >
                {generalLoading ? (
                  <Skeleton className="h-6 w-full" />
                ) : (
                  siteSettings?.description
                )}
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col gap-2 sm:flex-row"
              variants={fadeIn}
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-green-800 hover:bg-green-900 dark:bg-green-400 dark:hover:bg-green-500 "
              >
                <Link href="/catalogue">
                  Découvrir notre catalogue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/services">Nos services</Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div variants={fadeIn} className="mt-8 lg:mt-0">
            {generalLoading ? (
              <ImageSkeleton className="aspect-video" />
            ) : (
              <Image
                src={siteSettings?.heroImage || "/img/placeholder.svg"}
                priority={true}
                alt="Hero"
                width={600}
                height={400}
                className="aspect-video object-cover rounded-lg"
              />
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Services section */}
      <motion.section
        className="bg-secondary py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={{
          animate: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <div className="container px-4 md:px-6">
          <motion.h2
            className="text-3xl font-bold tracking-tighter mb-8 text-center text-secondary-foreground"
            variants={fadeIn}
          >
            Nos services
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {generalLoading
              ? Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <motion.div key={index} variants={fadeIn}>
                      <Card className="h-full">
                        <CardHeader>
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
              : featuredServices.map((service, index) => {
                  const Icon =
                    Icons[service.icon as keyof typeof Icons] ||
                    Icons.HelpCircle;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeIn}
                      className={`${
                        featuredServices.length % 2 !== 0 &&
                        index === featuredServices.length - 1
                          ? "sm:col-span-2 sm:w-1/2 sm:mx-auto lg:col-span-1 lg:w-full"
                          : ""
                      }`}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <Icon className="w-10 h-10 mb-2 text-primary" />
                          <CardTitle>{service.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{service.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </motion.section>

      {/* Vehicles section */}
      <motion.section
        className="container px-4 md:px-6"
        initial="initial"
        whileInView="animate"
        viewport={{ once: false }}
        variants={{
          animate: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.h2
          className="text-3xl font-bold tracking-tighter mb-8 text-center"
          variants={fadeIn}
        >
          Véhicules en vedette
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {generalLoading
            ? Array(3)
                .fill(null)
                .map((_, index) => (
                  <motion.div key={index} variants={fadeIn}>
                    <Card className="h-full flex flex-col">
                      <Skeleton className="h-48 w-full" />
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <div className="flex items-center mt-2">
                          {Array(5)
                            .fill(null)
                            .map((_, i) => (
                              <Skeleton key={i} className="w-4 h-4 mr-1" />
                            ))}
                          <Skeleton className="h-4 w-16 ml-2" />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-10 w-full" />
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
            : featuredVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.id}
                  variants={fadeIn}
                  className={`${
                    featuredVehicles.length % 2 !== 0 &&
                    index === featuredVehicles.length - 1
                      ? "sm:col-span-2 sm:w-1/2 sm:mx-auto lg:col-span-1 lg:w-full"
                      : ""
                  }`}
                >
                  <Card className="h-full flex flex-col">
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
                        <Badge> {vehicle.year}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
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
      </motion.section>

      <motion.section
        className="bg-secondary py-16"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-4 text-secondary-foreground">
            Prêt à trouver votre prochaine voiture ?
          </h2>
          <p className="mb-8 text-secondary-foreground/80 max-w-2xl mx-auto">
            Explorez notre catalogue complet et trouvez le véhicule de vos
            rêves.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-green-800 hover:bg-green-900 dark:bg-green-400 dark:hover:bg-green-500"
          >
            <Link href="/catalogue">
              Voir tout le catalogue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
}

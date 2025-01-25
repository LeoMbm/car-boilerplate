"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import * as Icons from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ServicesClient() {
  const { toast } = useToast();
  const { services } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  console.log("Services:", services);

  const handleContactFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", contactForm);
    toast({
      title: "Demande envoyée",
      description:
        "Nous vous contacterons bientôt pour discuter de vos besoins en matière de service.",
    });
    setContactForm({ name: "", email: "", service: "", message: "" });
  };

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
        Nos Services
      </motion.h1>

      {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">Tous les services</TabsTrigger>
          {services.map((service, index) => (
            <TabsTrigger key={index} value={service.title}>
              {service.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs> */}

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={{
          animate: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {services
          .filter(
            (service) => activeTab === "all" || activeTab === service.title
          )
          .map((service, index) => {
            const Icon =
              Icons[service.icon as keyof typeof Icons] || Icons.HelpCircle;
            return (
              <motion.div key={index} variants={fadeIn}>
                <Card>
                  <CardHeader>
                    <Icon className="w-10 h-10 mb-2 text-primary" />
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {service.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>{detail}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
      </motion.div>

      <motion.div className="mt-16" variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Demande de service</CardTitle>
            <CardDescription>
              Remplissez le formulaire ci-dessous pour nous contacter concernant
              nos services.
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
                    value={contactForm.name}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleContactFormChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Service demandé</Label>
                <select
                  id="service"
                  name="service"
                  value={contactForm.service}
                  onChange={handleContactFormChange}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Sélectionnez un service</option>
                  {services.map((service, index) => (
                    <option key={index} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  required
                />
              </div>
              <Button type="submit">Envoyer la demande</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

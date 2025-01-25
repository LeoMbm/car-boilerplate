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
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import dynamic from "next/dynamic";
import { formatOpeningHours } from "@/lib/utils";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>Chargement de la carte...</p>,
  ssr: false,
});

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function ContactClient() {
  const { toast } = useToast();
  const { siteSettings } = useAppStore();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleContactFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", contactForm);
    toast({
      title: "Message envoyé",
      description: "Nous vous contacterons bientôt.",
    });
    setContactForm({ name: "", email: "", subject: "", message: "" });
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
        Contactez-nous
      </motion.h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Envoyez-nous un message</CardTitle>
              <CardDescription>
                Remplissez le formulaire ci-dessous et nous vous répondrons dans
                les plus brefs délais.
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
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactFormChange}
                    required
                  />
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
                <Button type="submit">Envoyer le message</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="space-y-6" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Nos coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{siteSettings.contactInfo.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary" />
                <span>{siteSettings.contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary" />
                <span>{siteSettings.contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span className="whitespace-pre-line">
                  {formatOpeningHours(siteSettings.contactInfo.hours)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notre emplacement</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[300px] rounded-lg overflow-hidden">
                <Map />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { formatOpeningHours } from "@/lib/utils";
import { SiteSettings } from "@/lib/db";

export default function Footer() {
  const { siteSettings } = useAppStore();

  if (!siteSettings) {
    return (
      <footer className="bg-secondary text-secondary-foreground">
        <div className="container px-4 py-8 mx-auto text-center">
          <p>Chargement...</p>
        </div>
      </footer>
    );
  }

  // console.log(siteSettings.contactInfo);

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">À propos</h3>
            <p className="text-sm">{siteSettings.description}</p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue"
                  className="hover:text-primary transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>{siteSettings.contactInfo?.address}</li>
              <li>{siteSettings.contactInfo?.phone}</li>
              <li>{siteSettings.contactInfo?.email}</li>
              <li>
                {siteSettings.contactInfo?.hours
                  ? formatOpeningHours(siteSettings.contactInfo.hours)
                  : "Heures non disponibles"}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Suivez-nous</h3>
            <div className="flex space-x-4">
              {siteSettings.socialMedia?.facebook && (
                <a
                  href={siteSettings.socialMedia.facebook}
                  className="text-secondary-foreground hover:text-primary transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialMedia?.instagram && (
                <a
                  href={siteSettings.socialMedia.instagram}
                  className="text-secondary-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {siteSettings.socialMedia?.twitter && (
                <a
                  href={siteSettings.socialMedia.twitter}
                  className="text-secondary-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} {siteSettings.title}. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

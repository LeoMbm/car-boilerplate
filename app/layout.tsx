import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./theme-transition.css";
import { getInitialMetadata, getInitialState } from "@/lib/store";
import { ThemeProvider } from "@/components/ThemeProvider";
import HeaderClient from "@/components/client/HeaderClient";
import FooterClient from "@/components/client/FooterClient";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider, useSession } from "next-auth/react";
import { auth } from "@/auth";
import Providers from "@/providers/SessionCustomProvider";
import { Suspense } from "react";
import DynamicMetadataWrapper from "@/components/DynamicMetadata";
import SettingsWrapper from "@/components/SettingsWrapper";
import { getSiteSettings, getVehicles, getServices } from "@/lib/db";
import { DataLoader } from "@/components/DataLoader";
import Loading from "@/components/LoaderComp";
export const revalidate = 3600;

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const initialState = await getInitialMetadata();
  return {
    authors: {
      name: "Leonidas J",
      url: "https://leonidasj.dev",
    },
    robots: {
      index: true,
      follow: true,
      noimageindex: false,
      noarchive: false,
      nosnippet: false,
      notranslate: false,
      nocache: false,
    },
    description: initialState.siteSettings.metadata.description,
    keywords: initialState.siteSettings.metadata.keywords.split(","),
    openGraph: {
      images: [initialState.siteSettings.metadata.ogImage],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const [siteSettings, services, vehicles] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getVehicles(),
  ]);
  const vehiclesWithParsedCharacteristics = vehicles.map((vehicle: any) => ({
    ...vehicle,
    characteristics:
      typeof vehicle.characteristics === "string"
        ? JSON.parse(vehicle.characteristics)
        : vehicle.characteristics,
  }));

  return (
    <Providers session={session}>
      <html lang="fr">
        <body
          className={`${inter.className} bg-background text-foreground`}
          suppressHydrationWarning
        >
          <DynamicMetadataWrapper>
            <DataLoader
              siteSettings={siteSettings}
              services={services}
              vehicles={vehiclesWithParsedCharacteristics}
            >
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <div className="flex flex-col min-h-screen">
                  <HeaderClient />

                  <main className="flex-grow">{children}</main>
                  <FooterClient />
                </div>
                <Toaster />
              </ThemeProvider>
            </DataLoader>
          </DynamicMetadataWrapper>
        </body>
      </html>
    </Providers>
  );
}

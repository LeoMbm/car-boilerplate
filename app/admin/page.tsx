import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/admin/GeneralSettings";
import { MetadataSettings } from "@/components/admin/MetadataSettings";
import { HomePageSettings } from "@/components/admin/HomePageSettings";
import { ServicesSettings } from "@/components/admin/ServicesSettings";
import { VehiclesSettings } from "@/components/admin/VehiclesSettings";
import { ContactSettings } from "@/components/admin/ContactSettings";
import { AnalyticsSettings } from "@/components/admin/AnalyticsSettings";

export default function AdminDashboard() {
  return (
    <div className="container px-4 py-16 md:px-6">
      <h1 className="text-3xl font-bold tracking-tighter mb-8">
        Tableau de bord d'administration
      </h1>

      <Tabs defaultValue="general-settings">
        <TabsList className="mb-8 h-fit grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:flex lg:flex-row lg:flex-wrap lg:gap-4">
          <TabsTrigger value="general-settings">
            Paramètres généraux
          </TabsTrigger>
          <TabsTrigger value="metadata">Métadonnées</TabsTrigger>
          <TabsTrigger value="home-page">Page d'accueil</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general-settings">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="metadata">
          <MetadataSettings />
        </TabsContent>

        <TabsContent value="home-page">
          <HomePageSettings />
        </TabsContent>

        <TabsContent value="services">
          <ServicesSettings />
        </TabsContent>

        <TabsContent value="vehicles">
          <VehiclesSettings />
        </TabsContent>

        <TabsContent value="contact">
          <ContactSettings />
        </TabsContent>
        <TabsContent value="analytics">
          <AnalyticsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}

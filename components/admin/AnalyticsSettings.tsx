"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JSX, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  ArrowBigRightDash,
  Link,
  Mail,
  Search,
  Share,
  Terminal,
  Handshake,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";

interface AnalyticsData {
  pageViews: { month: string; views: number; [key: string]: any }[];
  countries: { name: string; code: string; value: number }[];
  devices: { name: string; value: number; [key: string]: any }[];
  sources: {
    name: string;
    icon: JSX.Element;
    value: number;
    [key: string]: any;
  }[];
  vehicleClicks: { name: string; clicks: number; [key: string]: any }[];
}

// Données factices avec des données par pays
const fakeData: AnalyticsData = {
  pageViews: [
    { month: "Jan", views: 1000, FR: 500, BE: 300, CH: 150, CA: 50 },
    { month: "Fév", views: 750, FR: 400, BE: 200, CH: 100, CA: 50 },
    { month: "Mar", views: 500, FR: 250, BE: 150, CH: 75, CA: 25 },
    { month: "Avr", views: 250, FR: 125, BE: 75, CH: 35, CA: 15 },
    { month: "Mai", views: 150, FR: 75, BE: 45, CH: 20, CA: 10 },
  ],
  countries: [
    { name: "France", code: "FR", value: 1500 },
    { name: "Belgique", code: "BE", value: 300 },
    { name: "Suisse", code: "CH", value: 200 },
    { name: "Canada", code: "CA", value: 100 },
  ],
  devices: [
    { name: "Desktop", value: 1200, FR: 600, BE: 360, CH: 180, CA: 60 },
    { name: "Mobile", value: 800, FR: 400, BE: 240, CH: 120, CA: 40 },
    { name: "Tablet", value: 200, FR: 100, BE: 60, CH: 30, CA: 10 },
  ],
  sources: [
    {
      name: "Recherche organique",
      icon: <Search />,
      value: 1000,
      FR: 500,
      BE: 300,
      CH: 150,
      CA: 50,
    },
    {
      name: "Direct",
      icon: <ArrowBigRightDash />,
      value: 500,
      FR: 250,
      BE: 150,
      CH: 75,
      CA: 25,
    },
    {
      name: "Réseaux sociaux",
      icon: <Share />,
      value: 300,
      FR: 150,
      BE: 90,
      CH: 45,
      CA: 15,
    },
    {
      name: "Référencement",
      icon: <Link />,
      value: 200,
      FR: 100,
      BE: 60,
      CH: 30,
      CA: 10,
    },
    {
      name: "Email",
      icon: <Mail />,
      value: 100,
      FR: 50,
      BE: 30,
      CH: 15,
      CA: 5,
    },
  ],
  vehicleClicks: [
    { name: "Peugeot 208", clicks: 300, FR: 150, BE: 90, CH: 45, CA: 15 },
    { name: "Renault Clio", clicks: 250, FR: 125, BE: 75, CH: 37, CA: 13 },
    { name: "Citroën C3", clicks: 200, FR: 100, BE: 60, CH: 30, CA: 10 },
    { name: "Volkswagen Golf", clicks: 150, FR: 75, BE: 45, CH: 22, CA: 8 },
    { name: "Ford Fiesta", clicks: 100, FR: 50, BE: 30, CH: 15, CA: 5 },
  ],
};

const chartConfig: ChartConfig = {
  views: {
    label: "Vues",
    color: "#2563eb",
  },
  clicks: {
    label: "Clics",
    color: "#60a5fa",
  },
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function AnalyticsSettings() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const filterDataByCountry = (data: any[], country: string | null) => {
    if (!country || country === "all") return data;
    return data.map((item) => ({
      ...item,
      value: item[country] || 0,
      views: item[country] || 0,
      clicks: item[country] || 0,
    }));
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Handshake className="h-4 w-4" />
        <AlertTitle>Fonctionnalité avancée !</AlertTitle>
        <AlertDescription>
          Cette fonctionnalité est implementée sur demande, en voici une démo.
        </AlertDescription>
      </Alert>
      <div className="flex justify-between items-center">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionnez une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">90 derniers jours</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedCountry || "all"}
          onValueChange={(value) =>
            setSelectedCountry(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par pays" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {fakeData.countries.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center">
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    style={{
                      width: "1em",
                      height: "1em",
                      marginRight: "0.5em",
                    }}
                  />
                  {country.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Vues par page</CardTitle>
            <CardDescription>
              Nombre de visites pour chaque page du site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-64">
              <BarChart
                data={filterDataByCountry(fakeData.pageViews, selectedCountry)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="var(--color-views)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visiteurs par pays</CardTitle>
            <CardDescription>
              Répartition géographique des visiteurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fakeData.countries.map((country, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded ${
                    selectedCountry === country.code ? "bg-blue-100" : ""
                  }`}
                  onClick={() => setSelectedCountry(country.code)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="flex items-center">
                    <ReactCountryFlag
                      countryCode={country.code}
                      svg
                      style={{
                        width: "1.5em",
                        height: "1.5em",
                        marginRight: "0.5em",
                      }}
                    />
                    <span>{country.name}</span>
                  </div>
                  <span>{country.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visiteurs par appareil</CardTitle>
            <CardDescription>
              Types d'appareils utilisés par les visiteurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-64">
              <PieChart>
                <Pie
                  data={filterDataByCountry(fakeData.devices, selectedCountry)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fakeData.devices.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sources de trafic</CardTitle>
            <CardDescription>D'où viennent les visiteurs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filterDataByCountry(fakeData.sources, selectedCountry).map(
                (source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {source.icon}
                      <span className="ml-2">{source.name}</span>
                    </div>
                    <span>{source.value}</span>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clics par véhicule</CardTitle>
            <CardDescription>
              Popularité des différents véhicules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-64">
              <BarChart
                data={filterDataByCountry(
                  fakeData.vehicleClicks,
                  selectedCountry
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="clicks" fill="var(--color-clicks)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

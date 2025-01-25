"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const daysOfWeek = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export function OpeningHours({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { toast } = useToast();
  const [hours, setHours] = useState(() => {
    const initialHours = daysOfWeek.reduce((acc, day) => {
      acc[day] = { isOpen: false, open: "09:00", close: "18:00" };
      return acc;
    }, {} as Record<string, { isOpen: boolean; open: string; close: string }>);

    if (value) {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        Object.entries(parsed).forEach(([day, data]) => {
          if (data && typeof data === "object") {
            initialHours[day] = data as {
              isOpen: boolean;
              open: string;
              close: string;
            };
          }
        });
      } catch (error) {
        console.error("Failed to parse hours JSON:", error);
      }
    }

    return initialHours;
  });

  const handleChange = (
    day: string,
    field: "isOpen" | "open" | "close",
    value: boolean | string
  ) => {
    setHours((prev) => {
      const newHours = { ...prev, [day]: { ...prev[day], [field]: value } };

      if (
        newHours[day].isOpen &&
        (newHours[day].open === "" || newHours[day].close === "")
      ) {
        toast({
          title: "Erreur",
          description: `Veuillez spécifier les heures d'ouverture et de fermeture pour ${day}.`,
          variant: "destructive",
        });
        return prev;
      }

      const formattedHours = JSON.stringify(newHours);
      onChange(formattedHours);
      return newHours;
    });
  };

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b">
          <th className="p-2 text-left w-[140px]">Jour</th>
          <th className="p-2 text-center">Ouvert ?</th>
          <th className="p-2 text-center">Ouverture</th>
          <th className="p-2 text-center">Fermeture</th>
        </tr>
      </thead>
      <tbody>
        {daysOfWeek.map((day) => {
          const dayData = hours[day];
          return (
            <tr key={day} className="border-b last:border-none">
              <td className="p-2">
                <Label className="font-semibold">{day}</Label>
              </td>
              {/* Switch */}
              <td className="p-2 text-center">
                <Switch
                  checked={dayData.isOpen}
                  onCheckedChange={(checked) =>
                    handleChange(day, "isOpen", checked)
                  }
                />
              </td>
              {/* Input "Ouverture" */}
              <td className="p-2 text-center">
                {dayData.isOpen ? (
                  <Input
                    type="time"
                    className="max-w-[100px] mx-auto"
                    value={dayData.open}
                    onChange={(e) => handleChange(day, "open", e.target.value)}
                  />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
              {/* Input "Fermeture" */}
              <td className="p-2 text-center">
                {dayData.isOpen ? (
                  <Input
                    type="time"
                    className="max-w-[100px] mx-auto"
                    value={dayData.close}
                    onChange={(e) => handleChange(day, "close", e.target.value)}
                  />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

"use client";

import * as LucideIcons from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

type Icons = {
  // the name of the component
  name: string;
  // a more human-friendly name
  friendly_name: string;
  Component: React.FC<React.ComponentPropsWithoutRef<"svg">>;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [allIcons, setAllIcons] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const iconNames = Object.keys(LucideIcons).filter(
      (key) =>
        key !== "default" &&
        typeof LucideIcons[key as keyof typeof LucideIcons] === "object"
    );
    setAllIcons(iconNames);
  }, []);

  if (!mounted) {
    return null;
  }

  // Appliquer le filtre de recherche
  const filteredIcons = search
    ? allIcons.filter((iconName) =>
        iconName.toLowerCase().includes(search.toLowerCase())
      )
    : allIcons;

  const IconComponent = value
    ? (LucideIcons[value as keyof typeof LucideIcons] as React.ComponentType<{
        className?: string;
      }>)
    : null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start">
          {IconComponent ? (
            <IconComponent className="mr-2 h-4 w-4" />
          ) : (
            "Pas d'icône"
          )}
          {value || "Select icon"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <div className="p-2">
          {/* Champ de recherche */}
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="grid grid-cols-3 gap-2">
            {filteredIcons.map((iconName) => {
              const Icon = LucideIcons[
                iconName as keyof typeof LucideIcons
              ] as React.ComponentType<{ className?: string }>;
              return (
                <Button
                  key={iconName}
                  variant="ghost"
                  className="h-10 w-10 p-0"
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                  }}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

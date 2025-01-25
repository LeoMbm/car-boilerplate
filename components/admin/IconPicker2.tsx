// IconPicker2.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ServiceIcon, allIcons } from "@/lib/serviceIcons";

//
// Hook : useIconPicker
// Retourne un champ de recherche et la liste des icônes filtrées
//
export const useIconPicker = (): {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  icons: ServiceIcon[];
} => {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    if (search.trim() === "") return allIcons;
    const lowerSearch = search.toLowerCase();
    return allIcons.filter(
      (icon) =>
        icon.name.toLowerCase().includes(lowerSearch) ||
        icon.friendlyName.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  return { search, setSearch, icons: filteredIcons };
};

//
// Composant : IconRenderer
// Rend l'icône à partir du nom donné
//
export const IconRenderer = ({
  icon,
  ...rest
}: { icon: string } & React.ComponentPropsWithoutRef<"svg">) => {
  // Recherche l'icône dans notre liste allIcons
  const iconItem = allIcons.find((item) => item.name === icon);
  if (!iconItem) {
    console.warn(`IconRenderer: l'icône "${icon}" n'a pas été trouvée.`);
    return null;
  }
  const { Component } = iconItem;
  return <Component data-slot="icon" {...rest} />;
};

//
// Composant : IconPicker (Palette simple)
// Affiche un Popover avec un champ de recherche et la liste des icônes
//
export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { search, setSearch, icons } = useIconPicker();
  const [isOpen, setIsOpen] = useState(false);

  const selectedIconItem = useMemo(
    () => allIcons.find((icon) => icon.name === value),
    [value]
  );

  useEffect(() => {
    console.log("IconPicker: filtered icons =", icons);
  }, [icons]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start">
          {selectedIconItem ? (
            <selectedIconItem.Component className="mr-2 h-4 w-4" />
          ) : (
            "Pas d'icône"
          )}
          {value || "Select icon"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <div className="p-2">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              console.log("IconPicker: recherche =", e.target.value);
            }}
            className="mb-2"
          />
          <div className="grid grid-cols-3 gap-2">
            {icons.map((iconItem) => {
              console.log("IconPicker: rendu de", iconItem.name);
              return (
                <Button
                  key={iconItem.name}
                  variant="ghost"
                  className="h-10 w-10 p-0"
                  onClick={() => {
                    console.log("IconPicker: sélection de", iconItem.name);
                    onChange(iconItem.name);
                    setIsOpen(false);
                  }}
                >
                  <iconItem.Component className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

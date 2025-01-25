"use client";

import React, { useState } from "react";
import { IconRenderer, useIconPicker } from "@/components/admin/IconPicker2";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon } from "@heroicons/react/20/solid";

export const IconPickerCommandPalette = ({
  onChange,
}: {
  onChange: (icon: string) => void;
}) => {
  // 'value' représente le nom de l'icône sélectionnée dans la palette
  const [value, setValue] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { icons } = useIconPicker();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-4 min-w-[150px]">
          {value ? (
            <>
              <IconRenderer icon={value} className="h-4 w-4 mr-2" />
            </>
          ) : (
            "Sélectionner"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-sm p-0">
        <Command className="w-full max-w-sm">
          <CommandInput placeholder="Tapez une commande ou recherchez..." />
          <CommandList>
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            <CommandGroup>
              {icons.map(({ name, Component, friendlyName }) => (
                <CommandItem
                  key={name}
                  value={friendlyName}
                  onSelect={() => {
                    // Si l'icône sélectionnée est déjà celle-ci, on la désélectionne ; sinon, on la sélectionne
                    const newValue = value === name ? null : name;
                    setValue(newValue);
                    onChange(newValue ?? "");
                    setOpen(false);
                  }}
                  className={`flex items-center gap-x-2 truncate capitalize ${
                    value === name ? "bg-blue-100" : ""
                  }`}
                >
                  <Component className="h-4 w-4" />
                  {friendlyName}
                  <CheckIcon
                    className={`ml-auto transition-opacity duration-200 ${
                      value === name ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

//
// Composant : CommandIcon
// Affiche le composant IconPickerCommandPalette et montre l'icône sélectionnée.
//
export const CommandIcon = () => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="text-lg font-bold">
        Sélectionnez votre icône pour le service
      </h2>
      <IconPickerCommandPalette onChange={setSelectedIcon} />
      {selectedIcon && (
        <div className="flex items-center gap-2">
          <span>Icône sélectionnée :</span>
          <IconRenderer icon={selectedIcon} className="h-6 w-6" />
        </div>
      )}
    </div>
  );
};

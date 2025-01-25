import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChangedFields(
  original: Record<string, any>,
  updated: Record<string, any>
): Record<string, any> {
  const changedFields: Record<string, any> = {};

  for (const key in updated) {
    if (!updated.hasOwnProperty(key)) continue;
    if (key === "featuredServices" || key === "featuredVehicles") {
      let updatedArray: number[];
      if (typeof updated[key] === "string") {
        updatedArray = updated[key]
          .split(",")
          .map((val: string) => parseInt(val, 10))
          .filter((val: number) => !isNaN(val));
      } else if (Array.isArray(updated[key])) {
        updatedArray = updated[key];
      } else {
        updatedArray = [];
      }
      const originalArray = Array.isArray(original[key]) ? original[key] : [];
      if (JSON.stringify(updatedArray) !== JSON.stringify(originalArray)) {
        changedFields[key] = updatedArray;
      }
    } else if (key === "contactInfo") {
      const originalObj = original[key] || {};
      const updatedObj = updated[key];

      const mergedObj = {
        ...originalObj,
        ...updatedObj,
      };

      if (JSON.stringify(originalObj) !== JSON.stringify(mergedObj)) {
        changedFields[key] = mergedObj;
      }
    } else if (typeof updated[key] === "object" && updated[key] !== null) {
      const nestedChanges = getChangedFields(original[key] || {}, updated[key]);
      if (Object.keys(nestedChanges).length > 0) {
        changedFields[key] = nestedChanges;
      }
    } else if (updated[key] !== original[key]) {
      changedFields[key] = updated[key];
    }
  }

  return changedFields;
}

type DayHours = {
  isOpen: boolean;
  open: string;
  close: string;
};

type WeekHours = Record<string, DayHours>;

export function formatOpeningHours(hours: WeekHours): string {
  // hours = JSON.parse(JSON.stringify(hours));

  if (!hours) {
    return "Heures non disponibles";
  }

  if (typeof hours === "string") {
    hours = JSON.parse(hours);
  }
  const daysOrder = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  const shortDays: Record<string, string> = {
    Lundi: "Lun",
    Mardi: "Mar",
    Mercredi: "Mer",
    Jeudi: "Jeu",
    Vendredi: "Ven",
    Samedi: "Sam",
    Dimanche: "Dim",
  };

  const formattedHours: string[] = [];
  let currentGroup: { days: string[]; hours: string } | null = null;

  daysOrder.forEach((day) => {
    const dayHours = hours[day];
    if (dayHours && dayHours.isOpen) {
      const dayHoursFormatted = `${dayHours.open.slice(
        0,
        5
      )}-${dayHours.close.slice(0, 5)}`;

      if (currentGroup && currentGroup.hours === dayHoursFormatted) {
        currentGroup.days.push(shortDays[day]);
      } else {
        if (currentGroup) {
          formattedHours.push(formatGroup(currentGroup));
        }
        currentGroup = { days: [shortDays[day]], hours: dayHoursFormatted };
      }
    }
  });

  if (currentGroup) {
    formattedHours.push(formatGroup(currentGroup));
  }

  return formattedHours.join(" / ");
}

function formatGroup(group: { days: string[]; hours: string }): string {
  const { days, hours } = group;
  if (days.length === 1) {
    return `${days[0]} ${hours}`;
  } else {
    return `${days[0]}-${days[days.length - 1]} ${hours}`;
  }
}

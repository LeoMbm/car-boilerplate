"use client";

import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
import dynamic from "next/dynamic";

const NextThemesProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  }
);

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// "use client";

// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";
// import type { ThemeProviderProps } from "next-themes";
// import { useAppStore } from "@/lib/store";

// export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
//   const { siteSettings } = useAppStore();

//   React.useEffect(() => {
//     const root = document.documentElement;
//     const updateTheme = (theme: "light" | "dark") => {
//       const colors =
//         theme === "dark"
//           ? siteSettings.lightModeColors
//           : siteSettings.darkModeColors;
//       root.style.setProperty("--background", `hsl(${colors.background})`);
//       root.style.setProperty("--foreground", `hsl(${colors.foreground})`);
//       root.style.setProperty("--primary", `hsl(${colors.primary})`);
//       root.style.setProperty("--secondary", `hsl(${colors.secondary})`);
//     };

//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (mutation.attributeName === "class") {
//           const theme = root.classList.contains("dark") ? "dark" : "light";
//           updateTheme(theme);
//         }
//       });
//     });

//     observer.observe(root, { attributes: true });
//     updateTheme(root.classList.contains("dark") ? "dark" : "light");

//     return () => observer.disconnect();
//   }, [siteSettings.lightModeColors, siteSettings.darkModeColors]);

//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
// }

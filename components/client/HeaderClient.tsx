"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowBigRight, ArrowRight, Icon, Menu } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { signOut, useSession } from "next-auth/react";
import { Separator } from "../ui/separator";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function HeaderClient() {
  const { siteSettings } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const handleRedirectPanel = () => {
    router.push("/admin");
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex min-w-[200px]">
          <Link
            href="/"
            className={`mr-6 flex items-center space-x-2 ${
              !siteSettings.showLogo ? "pl-2" : "pl-2"
            }`}
          >
            {siteSettings.showLogo && siteSettings.logo && (
              <img
                src={siteSettings.logo || "/img/placeholder.svg"}
                alt={siteSettings.title}
                className="h-auto"
                // width={ width: `${siteSettings.logoSize || 25}px` }
                style={{
                  width: `${siteSettings.logoSize || 25}px`,
                  objectFit: "contain",
                }}
              />
            )}
            {(siteSettings.showTitle || !siteSettings.showLogo) && (
              <span className="hidden font-bold sm:inline-block">
                {siteSettings.title}
              </span>
            )}
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTitle hidden></SheetTitle>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" aria-describedby="sidebar">
            <MobileNav closeSidebar={closeSidebar} />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center space-x-4">
            <ThemeSwitcher />
            <div className="hidden md:flex">
              {session && pathname == "/admin" ? (
                <Button
                  variant="ghost"
                  className="transition-colors hover:text-foreground/80"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Se déconnecter
                </Button>
              ) : null}

              {session && pathname !== "/admin" ? (
                <Button
                  variant="ghost"
                  className="transition-colors hover:text-foreground/80"
                  onClick={handleRedirectPanel}
                >
                  Panel d'administration
                  {/* // Icon  */}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function MobileNav({ closeSidebar }: { closeSidebar: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const handleRedirectPanelMobile = () => {
    closeSidebar();
    router.push("/admin");
  };
  return (
    <div className="flex flex-col space-y-3">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`transition-colors hover:text-foreground/80 ${
            pathname === item.href ? "text-foreground" : "text-foreground/60"
          }`}
          onClick={closeSidebar}
        >
          {item.label}
        </Link>
      ))}

      <Separator />
      {/* <div className="w-full"> */}
      {session && pathname == "/admin" ? (
        <Button
          variant="ghost"
          className="transition-colors hover:text-foreground/80"
          onClick={() => {
            signOut();
          }}
        >
          Se déconnecter
        </Button>
      ) : null}

      {session && pathname !== "/admin" ? (
        <Button
          variant="ghost"
          className="transition-colors hover:text-foreground/80"
          onClick={handleRedirectPanelMobile}
        >
          Panel d'administration
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

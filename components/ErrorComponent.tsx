"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { log } from "@/lib/logger";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    log(`Error occurred: ${error.message}`, "error");
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            500 - Erreur interne du serveur
          </CardTitle>
          <CardDescription>
            Oups ! Quelque chose s&apos;est mal passé.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>
            Vous serez redirigé vers la page d&apos;accueil dans {countdown}{" "}
            secondes...
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/")}>
            Aller à l&apos;accueil maintenant
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

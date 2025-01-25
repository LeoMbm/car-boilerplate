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

export default function NotFoundComponent() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            404 - Page Non Trouvée
          </CardTitle>
          <CardDescription>
            Oups ! La page que vous recherchez n'existe pas.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>
            Vous serez redirigé vers la page d'accueil dans {countdown}{" "}
            secondes...
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/")}>
            Aller à l'accueil maintenant
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

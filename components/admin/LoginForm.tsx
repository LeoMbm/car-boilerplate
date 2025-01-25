"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/lib/store";

const fadeIn = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { siteSettings } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue dans l'interface d'administration.",
      });
      router.push("/admin");
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Administration</CardTitle>
        <CardDescription className="text-center">
          Connectez-vous pour accéder au panneau d'administration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <motion.form
          onSubmit={handleSubmit}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-4" variants={formVariants}>
            <motion.div variants={fadeIn}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>
            <motion.div variants={fadeIn}>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="mt-6"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </motion.div>
        </motion.form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-muted-foreground"
        >
          © {new Date().getFullYear()} {siteSettings.title}. Tous droits
          réservés.
        </motion.p>
      </CardFooter>
    </Card>
  );
}

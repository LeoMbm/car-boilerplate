// pages/api/vehicles.ts (ou /app/api/vehicles/route.ts selon votre configuration)

import { NextRequest, NextResponse } from "next/server";
import { createVehicle } from "@/lib/db"; // Assurez-vous que cette fonction est correctement définie
import { auth } from "@/auth"; // Assurez-vous que votre fonction d'authentification est correcte
import fs from "fs";
import { promisify } from "util";
import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export const config = {
  api: {
    bodyParser: false, // Important pour permettre le parsing personnalisé
  },
};

// Promisifier fs.rename si nécessaire (actuellement non utilisé)
const rename = promisify(fs.rename);

// Fonction pour parser le form avec formidable
const parseForm = (req: NextRequest) =>
  new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      const form = formidable({
        multiples: true, // Permet le téléchargement multiple
        keepExtensions: true, // Garde les extensions des fichiers
      });

      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );

type CleanedVehicle = {
  name: string;
  brand: string;
  price: number;
  year: number;
  description: string;
  mainImage?: string;
  additionalImages?: string[];
  characteristics?: { [key: string]: string };
};

// Fonction pour uploader un fichier sur Supabase et récupérer l'URL publique
const uploadFileToSupabase = async (file: File, prefix: string) => {
  const fileExt = file.name?.split(".").pop() || "jpg";
  const uniqueName = `${prefix}-${Date.now()}-${file.name}`;
  const path = `public/${uniqueName}`;
  console.log("[DEBUG uploadFileToSupabase fileExt]", fileExt);
  console.log("[DEBUG uploadFileToSupabase uniqueName]", uniqueName);
  console.log("[DEBUG uploadFileToSupabase path]", path);
  // return "http://localhost:3000/" + path;

  const { data, error } = await supabase.storage
    .from("assets") // Remplacez par le nom de votre bucket
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false, // Changez selon vos besoins
    });

  if (error) {
    throw error;
  }

  // Récupérer l'URL publique
  const { data: publicURL } = supabase.storage
    .from("assets")
    .getPublicUrl(path);

  if (!publicURL) {
    throw new Error("Impossible de récupérer l'URL publique");
  }

  return publicURL.publicUrl;
};

export async function POST(request: NextRequest) {
  try {
    // Authentification
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    // Parsing du formulaire
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const price = Number.parseFloat(formData.get("price") as string);
    const year = Number.parseInt(formData.get("year") as string, 10);
    const description = formData.get("description") as string;
    const characteristics = JSON.parse(
      (formData.get("characteristics") as string) || "{}"
    );
    // Validation des champs requis
    const requiredFields = ["name", "brand", "price", "year", "description"];
    const missingFields = requiredFields.filter(
      (field) => !formData.get(field)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Champs obligatoires manquants",
          fields: missingFields,
        },
        { status: 400 }
      );
    }

    // Nettoyer et convertir les champs
    const cleanedVehicle: CleanedVehicle = {
      name,
      brand,
      price,
      year,
      description,
      characteristics,
    };

    // Valider les champs numériques
    if (isNaN(cleanedVehicle.price) || cleanedVehicle.price < 0) {
      return NextResponse.json({ message: "Prix invalide" }, { status: 400 });
    }

    if (isNaN(cleanedVehicle.year) || cleanedVehicle.year < 1900) {
      return NextResponse.json({ message: "Année invalide" }, { status: 400 });
    }

    // Gérer les fichiers uploadés
    const mainImage = formData.get("mainImage") as File | null;
    const additionalImages = formData.getAll("additionalImages") as unknown[];

    if (mainImage) {
      cleanedVehicle.mainImage = await uploadFileToSupabase(mainImage, "main");
    }

    if (additionalImages.length > 0) {
      cleanedVehicle.additionalImages = await Promise.all(
        additionalImages.map((img: any) =>
          uploadFileToSupabase(img, "additional")
        )
      );
    }

    console.log("Cleaned vehicle:", cleanedVehicle);

    // Enregistrer le véhicule dans la base de données
    const vehicle = await createVehicle(cleanedVehicle);

    // Optionnel : Revalider les chemins si nécessaire
    revalidatePath("/"); // ou d'autres chemins pertinents

    return NextResponse.json({
      success: true,
      message: "Véhicule ajouté avec succès",
      data: "vehicle",
    });
  } catch (error: any) {
    console.error("Erreur lors de la création du véhicule:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

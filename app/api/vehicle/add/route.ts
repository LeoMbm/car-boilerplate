import { NextRequest, NextResponse } from "next/server";
import { createVehicle } from "@/lib/db";
import { auth } from "@/auth";
import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { JsonValue } from "@prisma/client/runtime/library";

export const config = {
  api: {
    bodyParser: false,
  },
};

type CleanedVehicle = {
  name: string;
  brand: string;
  price: number;
  year: number;
  description: string;
  mainImage?: string;
  additionalImages?: string[];
  characteristics?: Record<string, string>;
};

// Fonction pour uploader un fichier sur Supabase et récupérer l'URL publique
const uploadFileToSupabase = async (file: File, prefix: string) => {
  const fileExt = file.name?.split(".").pop() || "jpg";
  const uniqueName = `${prefix}-${Date.now()}-${file.name}`;
  const path = `public/${uniqueName}`;
  const { data, error } = await supabase.storage
    .from("assets")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

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
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const brand = formData.get("brand") as string;
    const price = Number.parseFloat(formData.get("price") as string);
    const year = Number.parseInt(formData.get("year") as string, 10);
    const description = formData.get("description") as string;
    const characteristicsRaw = formData.get("characteristics") as string;
    let characteristicsParsed = characteristicsRaw
      ? JSON.parse(characteristicsRaw)
      : {};

    if (characteristicsRaw === "{}") {
      characteristicsParsed = {
        mileage: "0",
        transmission: "N/A",
        fuelType: "N/A",
        color: "N/A",
        doors: "0",
        horsepower: "0",
        options: "N/A",
      };
    }

    const cleanedCharacteristics =
      typeof characteristicsParsed === "object" &&
      !Array.isArray(characteristicsParsed)
        ? characteristicsParsed
        : {};

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

    const cleanedVehicle: CleanedVehicle = {
      name,
      brand,
      price,
      year,
      description,
      characteristics: cleanedCharacteristics,
    };

    if (isNaN(cleanedVehicle.price) || cleanedVehicle.price < 0) {
      return NextResponse.json({ message: "Prix invalide" }, { status: 400 });
    }

    if (isNaN(cleanedVehicle.year) || cleanedVehicle.year < 1900) {
      return NextResponse.json({ message: "Année invalide" }, { status: 400 });
    }

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

    // console.log("Cleaned vehicle:", cleanedVehicle);

    const vehicle = await createVehicle(cleanedVehicle);

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Véhicule ajouté avec succès",
      data: vehicle,
    });
  } catch (error: any) {
    console.error("Erreur lors de la création du véhicule:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

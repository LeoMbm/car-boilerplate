import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { auth } from "@/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadFileToSupabase = async (file: File) => {
  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `logo-${Date.now()}.${fileExt}`;
  const path = `public/${fileName}`;

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
    const logo = formData.get("logo") as File;

    if (!logo) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    const logoUrl = await uploadFileToSupabase(logo);

    return NextResponse.json({ success: true, logoUrl });
  } catch (error: any) {
    console.error("Error uploading logo:", error);
    return NextResponse.json(
      { message: "Error uploading logo" },
      { status: 500 }
    );
  }
}

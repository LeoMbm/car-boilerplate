import { auth } from "@/auth";
import { supabase } from "@/lib/supabaseClient";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  if (!body.action) {
    return NextResponse.json(
      { message: "No action provided" },
      { status: 400 }
    );
  }

  if (body.action !== "delete") {
    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  }

  if (!body.imageUrl) {
    return NextResponse.json(
      { message: "No image URL provided" },
      { status: 400 }
    );
  }

  const imageUrl = body.imageUrl;
  try {
    // Extraire le chemin du fichier depuis l'URL publique
    const { data: bucketInfo } = await supabase.storage.getBucket("assets");

    if (!bucketInfo) {
      return NextResponse.json(
        { message: "Bucket not found" },
        { status: 404 }
      );
    }
    const filePath = imageUrl.replace(
      `${process.env.SUPABASE_URL}/storage/v1/object/public/assets/`,
      ""
    );

    const { error } = await supabase.storage
      .from("assets")
      .remove([`public/${filePath}`]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("[DATABASE] Error deleting image:", error);
    return NextResponse.json(
      { message: "Error deleting image" },
      { status: 500 }
    );
  }
}

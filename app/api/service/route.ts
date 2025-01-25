import { NextRequest, NextResponse } from "next/server";
import {
  deleteService,
  deleteVehicle,
  updateService,
  updateVehicle,
} from "@/lib/db";
// import { updateSettingsInKV } from "@/lib/kv";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

type CleanedVehicle = {
  name: string;
  brand: string;
  price: number;
  year: number;
  description: string;
  mainImage?: string;
  additionalImages?: string[];
  characteristics?: { name: string; value: string }[];
};
export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const searcParams = request.nextUrl.searchParams;
  const id = parseInt(searcParams.get("id") as string);

  if (!id) {
    return NextResponse.json({ message: "No id provided" }, { status: 400 });
  }

  try {
    await deleteService(id);
  } catch (error) {
    console.error("Error deleting Service:", error);
    return NextResponse.json(
      { message: "Error deleting Service" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Car deleted",
  });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const searcParams = request.nextUrl.searchParams;
  const id = parseInt(searcParams.get("id") as string);

  if (!id) {
    return NextResponse.json({ message: "No id provided" }, { status: 400 });
  }

  const data = await request.json();

  try {
    await updateService(data.id, data);
    return NextResponse.json({
      success: true,
      message: "Car deleted",
    });
  } catch (error) {
    console.error("Error deleting Service:", error);
    return NextResponse.json(
      { message: "Error deleting Service" },
      { status: 500 }
    );
  }
}

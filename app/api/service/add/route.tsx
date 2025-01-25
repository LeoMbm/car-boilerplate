import { NextResponse } from "next/server";
import { createService } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const data = await request.json();

  if (!data) {
    return NextResponse.json({ message: "No data provided" }, { status: 400 });
  }

  if (!data.title || !data.icon || !data.description) {
    return NextResponse.json(
      {
        message: "Missing required fields",
        requiredFields: ["title", "icon", "description"],
      },
      { status: 400 }
    );
  }

  if (data.id) {
    delete data.id;
  }

  // console.log(data);

  try {
    const result = await createService(data);

    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Services added",
      data: result,
    });
  } catch (error) {
    console.error("Error adding service:", error);
    return NextResponse.json(
      { message: "Error adding service" },
      { status: 500 }
    );
  }
}

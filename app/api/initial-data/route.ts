import { NextResponse } from "next/server";

export async function GET() {
  try {
    const hours = new Date().toLocaleTimeString("fr-FR", { hour: "numeric" });
    const date = new Date().toLocaleDateString("fr-FR", { day: "numeric" });

    return NextResponse.json({ message: "OK", hours, date });
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

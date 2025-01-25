import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = auth();

  if (!session) {
    return NextResponse.json({ message: "Cannot revalidate" }, { status: 401 });
  }

  revalidatePath("/");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}

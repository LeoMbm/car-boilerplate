import { NextResponse } from "next/server";
import { updateSiteSettingsDB } from "@/lib/db";
// import { updateSettingsInKV } from "@/lib/kv";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const newSettings = await request.json();

  // console.log("New settings:", newSettings);

  await updateSiteSettingsDB(newSettings);
  revalidatePath("/");

  return NextResponse.json({
    success: true,
    message: "Settings updated",
    data: newSettings,
  });
}

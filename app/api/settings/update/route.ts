import { NextResponse } from "next/server";
import { updateSiteSettingsDB } from "@/lib/db";
// import { updateSettingsInKV } from "@/lib/kv";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const newSettings = await request.json();

  console.log("New settings:", newSettings);

  // Update in database
  await updateSiteSettingsDB(newSettings);

  // Update in Vercel KV
  // await updateSettingsInKV(newSettings);

  // Trigger revalidation
  revalidatePath("/");

  return NextResponse.json({
    success: true,
    message: "Settings updated",
    data: newSettings,
  });
}

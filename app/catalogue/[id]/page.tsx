import VehicleDetailsClient from "@/components/client/VehicleDetailsClient";
import { useAppStore } from "@/lib/store";
export const revalidate = 3600;

export default async function VehicleDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  console.log("Params:", id);

  return <VehicleDetailsClient id={id} />;
}

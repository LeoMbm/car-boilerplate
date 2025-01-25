import VehicleDetailsClient from "@/components/client/VehicleDetailsClient";
import { useAppStore } from "@/lib/store";
export const revalidate = 3600;

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const id = params.id;
  const query = searchParams.query;
}

export default async function VehicleDetails(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const id = params.id;

  return <VehicleDetailsClient id={id} />;
}

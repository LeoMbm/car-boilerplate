import CatalogueClient from "@/components/client/CatalogueClient";
export const revalidate = 3600;

export default function Catalogue() {
  return <CatalogueClient />;
}

import HomeClient from "@/components/client/HomeClient";
export const revalidate = 3600;
export default function Home() {
  return <HomeClient />;
}

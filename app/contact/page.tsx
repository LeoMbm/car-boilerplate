import ContactClient from "@/components/client/ContactClient";
export const revalidate = 3600;

export default function Contact() {
  return <ContactClient />;
}

"use client";

import { SiteSettings } from "@/lib/db";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export default function DynamicMetadataWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteSettings } = useAppStore();

  useEffect(() => {
    if (siteSettings) {
      updateMetadata(siteSettings as Partial<SiteSettings>);
    }
  }, [siteSettings]);

  return <>{children}</>;
}

function updateMetadata(settings: Partial<SiteSettings>) {
  const { metadata } = settings;

  if (!metadata) return;

  document.title = metadata.title;

  const updateMetaTag = (name: string, content: string) => {
    const metaTag =
      document.querySelector(`meta[name="${name}"]`) ||
      document.querySelector(`meta[property="${name}"]`);
    if (metaTag) {
      metaTag.setAttribute("content", content);
    }
  };

  updateMetaTag("description", metadata.description);
  updateMetaTag("keywords", metadata.keywords);
  updateMetaTag("og:title", metadata.title);
  updateMetaTag("og:description", metadata.description);
  updateMetaTag("og:image", metadata.ogImage);
  updateMetaTag("author", "Leonidas J");
}

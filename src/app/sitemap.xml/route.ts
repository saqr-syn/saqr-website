// /src/app/sitemap.xml/route.ts
import { getAllProjects } from "@/utils/admin/ViewProjects"; 
import { MetadataRoute } from "next";
import { languages } from '@/i18n/settings'; // استيراد اللغات من ملف الإعدادات

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjects();
  const baseUrl = "https://saqr-syn.vercel.app";
  const projectUrls = projects.flatMap((p) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/projects/${p.slug}`,
      lastModified: p.updatedAt?.toDate() || new Date(),
    }))
  );

  return [
    ...languages.map((lang) => ({
      url: `${baseUrl}/${lang}`,
      lastModified: new Date(),
    })),
    ...languages.map((lang) => ({
      url: `${baseUrl}/${lang}/projects`,
      lastModified: new Date(),
    })),
    ...languages.map((lang) => ({
      url: `${baseUrl}/${lang}/about`,
      lastModified: new Date(),
    })),
    ...languages.map((lang) => ({
      url: `${baseUrl}/${lang}/contact`,
      lastModified: new Date(),
    })),
    ...projectUrls,
  ];
}
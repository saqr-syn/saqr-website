// src/app/page.tsx
import { redirect } from "next/navigation";

export default function RootRedirectPage() {
  // إعادة التوجيه مباشرة إلى /en
  redirect("/en");

  return null; // الصفحة نفسها لا تعرض أي محتوى
}

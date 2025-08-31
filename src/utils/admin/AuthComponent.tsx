// src/app/utils/AuthComponent.tsx
"use client";

import { ReactNode } from "react";
import AdminAuthGuard from "./AdminAuthGuard";

interface AuthComponentProps {
  lang: string;
  children: ReactNode;
}

const AuthComponent = ({ lang, children }: AuthComponentProps) => {
  return <AdminAuthGuard lang={lang}>{children}</AdminAuthGuard>;
};

export default AuthComponent;

"use client";

import { MainLayout } from "@/shared/components/MainLayout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}

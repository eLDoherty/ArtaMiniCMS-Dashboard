"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AppLoader from "@/components/globals/AppLoader";
import "@/styles/globals.scss";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLoader>
      <DashboardLayout>{children}</DashboardLayout>
    </AppLoader>
  );
}

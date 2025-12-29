import DashboardLayout from "@/components/layout/DashboardLayout";
import "@/styles/globals.scss";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

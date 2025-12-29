"use client";

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  ReadOutlined,
  UserOutlined,
  SettingOutlined,
  FileOutlined
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

export default function DashboardSidebar({
  collapsed,
}: {
  collapsed: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const selectedKey =
    pathname === "/dashboard" ? "dashboard" : pathname.split("/")[2];

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div
        style={{
          height: 32,
          margin: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
          justifyContent: collapsed ? "center" : "flex-start",
          cursor: "pointer",
        }}
        onClick={() => router.push("/dashboard")}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <rect width="32" height="32" rx="6" fill="#1677ff" />
          <path
            d="M10 22V10H13L16 15L19 10H22V22H19V16L16 20L13 16V22H10Z"
            fill="white"
          />
        </svg>

        {!collapsed && (
          <span
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            ArtaMiniCMS
          </span>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(e) =>
          e.key === "dashboard"
            ? router.push("/dashboard")
            : router.push(`/dashboard/${e.key}`)
        }
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
          {
            key: "pages",
            icon: <FileTextOutlined />,
            label: "Pages",
          },
          {
            key: "articles",
            icon: <ReadOutlined />,
            label: "Articles",
          },
          {
            key: "users",
            icon: <UserOutlined />,
            label: "Users",
          },
          {
            key: "media",
            icon: <FileOutlined />,
            label: "Media",
          },
          {
            key: "settings",
            icon: <SettingOutlined />,
            label: "Settings",
          },
        ]}
      />
    </Sider>
  );
}

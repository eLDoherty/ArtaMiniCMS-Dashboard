"use client";

import { Button, Layout } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function DashboardHeader({
  collapsed,
  setCollapsed,
  colorBgContainer,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  colorBgContainer: string;
}) {
  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: 16,
          width: 64,
          height: 64,
        }}
      />
    </Header>
  );
}

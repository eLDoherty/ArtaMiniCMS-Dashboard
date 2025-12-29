"use client";

import { Row, Col, Card, Statistic } from "antd";
import {
  FileTextOutlined,
  ReadOutlined,
  UserOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import VisitorStats from "@/components/dashboard/VisitorStats";

export default function DashboardPage() {
  const stats = [
    {
      title: "Articles",
      value: 128,
      icon: <ReadOutlined />,
    },
    {
      title: "Pages",
      value: 24,
      icon: <FileTextOutlined />,
    },
    {
      title: "Users",
      value: 8,
      icon: <UserOutlined />,
    },
    {
      title: "Media",
      value: 342,
      icon: <PictureOutlined />,
    },
  ];

  return (
    <>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Row gutter={[16, 16]}>
        {stats.map((item) => (
          <Col key={item.title} xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>
      <VisitorStats />
    </>
  );
}

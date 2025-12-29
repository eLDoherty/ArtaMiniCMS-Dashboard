"use client";

import { Card, Statistic, Row, Col } from "antd";
import { RiseOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";

export default function VisitorStats() {
  const data = {
    totalVisitors: 12450,
    todayVisitors: 342,
    activeUsers: 57,
    growth: 12.4,
  };

  return (
    <Card
      title="Visitor Analytics"
      extra={<EyeOutlined />}
      style={{ marginTop: 24 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Total Visitors"
            value={data.totalVisitors}
            prefix={<UserOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Today"
            value={data.todayVisitors}
            prefix={<EyeOutlined />}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic title="Active Users" value={data.activeUsers} />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title="Growth"
            value={data.growth}
            precision={1}
            suffix="%"
            prefix={<RiseOutlined />}
            styles={{
              content: {
                color: "#3f8600",
              },
            }}
          />
        </Col>
      </Row>
    </Card>
  );
}

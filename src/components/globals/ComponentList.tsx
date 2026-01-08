"use client";

import { useEffect, useState } from "react";
import { Card, Button, Typography, Spin, Row, Col, Empty } from "antd";
import api from "@/lib/api";

const { Text } = Typography;

export interface ComponentItem {
  id: number;
  name: string;
  type: string;
  componentSchema: Record<string, any>;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ComponentsListProps {
  onSelect: (component: ComponentItem) => void;
}

export default function ComponentList({ onSelect }: ComponentsListProps) {
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const res = await api.get<ComponentItem[]>("/components");
        setComponents(res.data.filter((c) => c.isActive && !c.isDeleted));
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  return (
    <Card title="Available Components" style={{ maxWidth: 400 }}>
      <Spin spinning={loading}>
        {components.length === 0 ? (
          <Empty
            description="No components available"
            style={{ marginTop: 32 }}
          />
        ) : (
          <Row gutter={[8, 8]}>
            {components.map((item) => (
              <Col span={24} key={item.id}>
                <Button
                  block
                  onClick={() => onSelect(item)}
                  style={{ textAlign: "left" }}
                >
                  <Text strong>{item.name}</Text>{" "}
                  <Text type="secondary">({item.type})</Text>
                </Button>
              </Col>
            ))}
          </Row>
        )}
      </Spin>
    </Card>
  );
}

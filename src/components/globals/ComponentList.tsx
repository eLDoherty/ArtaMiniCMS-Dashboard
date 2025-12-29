'use client';

import { useEffect, useState } from 'react';
import { Card, List, Button, Typography, Spin, Alert } from 'antd';
import api from '@/lib/api';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const res = await api.get<ComponentItem[]>('/components');
        setComponents(res.data.filter(c => c.isActive && !c.isDeleted));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch components');
      } finally {
        setLoading(false);
      }
    };
    fetchComponents();
  }, []);

  if (loading) return <Spin tip="Loading components..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <Card title="Available Components" style={{ maxWidth: 400 }}>
      <List
        dataSource={components}
        renderItem={item => (
          <List.Item>
            <Button block onClick={() => onSelect(item)}>
              <Text strong>{item.name}</Text> <Text type="secondary">({item.type})</Text>
            </Button>
          </List.Item>
        )}
      />
    </Card>
  );
}

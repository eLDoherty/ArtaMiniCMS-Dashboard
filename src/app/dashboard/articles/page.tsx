'use client';

import { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Card, Alert, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import api from '@/lib/api';

interface ArticleItem {
  id: number;
  title: string;
  content: string;
  category_id: number;
  category_name?: string | null;
  thumbnail?: string | null;
  created_at: string;
  updated_at: string;
}

export default function ArticlesPage() {
  const [data, setData] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get<ArticleItem[]>('/articles');
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const columns: ColumnsType<ArticleItem> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Category', dataIndex: 'category_name', key: 'category_name', render: (text) => text || '-' },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumb) =>
        thumb ? <Image src={`http://localhost:3000${thumb}`} alt="thumbnail" width={80} height={50} /> : '-',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link">Edit</Button>
          <Button type="link" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Articles"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          Add Article
        </Button>
      }
    >
      {error && (
        <Alert
          type="error"
          title={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </Card>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Table, Tag, Space, Button, Card, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "@/lib/api";

interface PageItem {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  updatedAt: string;
}

export default function PagesPage() {
  const [data, setData] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await api.get<PageItem[]>("/pages");
        setData(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch pages");
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  const columns: ColumnsType<PageItem> = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Slug", dataIndex: "slug", key: "slug" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "published" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    { title: "Last Updated", dataIndex: "updatedAt", key: "updatedAt" },
    {
      title: "Action",
      key: "action",
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

  const router = useRouter();

  return (
    <Card
      title="Pages"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/dashboard/pages/add")}
        >
          Add Page
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

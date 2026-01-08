"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  Space,
  Button,
  Card,
  Alert,
  Image,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import api from "@/lib/api";

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
  const router = useRouter();

  const [data, setData] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get<ArticleItem[]>("/articles");
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    try {
      await api.delete(`/articles/${id}`);
      message.success(`Article "${title}" deleted`);
      fetchArticles();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Delete failed");
    }
  };

  const columns: ColumnsType<ArticleItem> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 70,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Category",
      dataIndex: "category_name",
      render: (text) => text || "-",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (thumb) =>
        thumb ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE}${thumb}`}
            alt="thumbnail"
            width={80}
            height={50}
            style={{ objectFit: "cover" }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Updated",
      dataIndex: "updated_at",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      width: 140,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => router.push(`/dashboard/articles/edit/${record.id}`)}
          >
            Edit
          </Button>

          <Popconfirm
            title={`Delete "${record.title}"?`}
            onConfirm={() => handleDelete(record.id, record.title)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Articles"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/dashboard/articles/add")}
        >
          Add Article
        </Button>
      }
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
      />
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  message,
  Upload,
  Space,
  Radio,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "@/lib/api";

import RichTextEditor from "@/components/editor/RichTextEditor";

const { TextArea } = Input;

interface Category {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  category_id: number | null;
  status: "draft" | "published";
  thumbnail?: string;
}

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const articleId = params?.id;

  useEffect(() => {
    if (!articleId) return;

    const fetchData = async () => {
      try {
        const catRes = await api.get<Category[]>("/articles/categories");
        setCategories(catRes.data);

        const res = await api.get<Article>(`/articles/${articleId}`);
        const article = res.data;

        console.log(article);

        setTitle(article.title);
        setSlug(article.slug);
        setContent(article.content);
        setMetaDescription(article.meta_description);
        setCategory(article.category_id);
        setStatus(article.status);

        if (article.thumbnail) {
          const absoluteUrl = article.thumbnail.startsWith("http")
            ? article.thumbnail
            : `${process.env.NEXT_PUBLIC_API_BASE}${article.thumbnail}`;
          setThumbnailPreview(absoluteUrl);
        }
      } catch (err: any) {
        message.error(err.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  const handleThumbnailChange = (file: File) => {
    const isValidType = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ].includes(file.type);
    if (!isValidType) {
      message.error("Only JPG, JPEG, PNG, or WEBP files are allowed");
      return Upload.LIST_IGNORE;
    }

    setThumbnail(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setThumbnailPreview(e.target.result as string);
    };
    reader.readAsDataURL(file);

    return false;
  };

  const handleSave = async () => {
    if (!title || !content) {
      message.warning("Title and content are required");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("slug", slug);
    form.append("content", content);
    form.append("meta_description", metaDescription);
    form.append("status", status);
    if (category) form.append("category_id", String(category));
    if (thumbnail) form.append("thumbnail", thumbnail);

    try {
      setSaving(true);
      await api.put(`/articles/${articleId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Article updated");
      router.push('/dashboard/articles');
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to update article");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Card title="Edit Article">
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Slug (optional)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <RichTextEditor
              value={content}
              onChange={setContent}
              minHeight={400}
            />

            <TextArea
              placeholder="Meta description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              maxLength={255}
            />
          </Space>
        </Col>

        <Col xs={24} md={8}>
          <Space orientation="vertical" style={{ width: "100%" }} size="middle">
            <Upload
              beforeUpload={handleThumbnailChange}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Change Thumbnail</Button>
            </Upload>

            {thumbnailPreview && (
              <div style={{ marginTop: 10 }}>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    border: "1px solid #eee",
                    borderRadius: 4,
                  }}
                />
              </div>
            )}

            <Select
              placeholder="Select category"
              value={category}
              onChange={setCategory}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              style={{ width: "100%" }}
            />

            <Radio.Group
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <Radio value="draft">Draft</Radio>
              <Radio value="published">Published</Radio>
            </Radio.Group>

            <Button
              type="primary"
              onClick={handleSave}
              loading={saving}
              style={{ width: "100%" }}
            >
              Update Article
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}

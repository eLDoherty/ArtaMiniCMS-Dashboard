"use client";

import { useState, useEffect } from "react";
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

export default function AddArticlePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [category, setCategory] = useState<number | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get<Category[]>("/articles/categories");
        setCategories(res.data);
      } catch (err: any) {
        message.error(err.message || "Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

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
      await api.post("/articles", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Article created");
      setTitle("");
      setSlug("");
      setContent("");
      setMetaDescription("");
      setThumbnail(null);
      setCategory(null);
      setStatus("draft");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to create article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card title="Add New Article">
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
              beforeUpload={(file) => {
                const isValidType = [
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/webp",
                ].includes(file.type);
                if (!isValidType) {
                  message.error(
                    "Only JPG, JPEG, PNG, or WEBP files are allowed"
                  );
                  return Upload.LIST_IGNORE;
                }

                setThumbnail(file);

                const reader = new FileReader();
                reader.onload = (e) => {
                  if (e.target?.result)
                    setThumbnailPreview(e.target.result as string);
                };
                reader.readAsDataURL(file);

                return false;
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Thumbnail</Button>
            </Upload>

            {thumbnail && (
              <div style={{ marginTop: 10 }}>
                <img
                  id="thumbnail-preview"
                  src={thumbnailPreview || undefined}
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
              Save Article
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
}

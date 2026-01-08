"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  Spin,
} from "antd";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import ComponentList, {
  ComponentItem,
} from "@/components/globals/ComponentList";
import { DropResult } from "@hello-pangea/dnd";
import PageBuilder from "@/components/builder/PageBuilder";

interface Block {
  id: string;
  name: string;
  type: string;
  fields: Record<string, string>;
}

export default function AddPage() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Block[]>([]);
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const pageRes = await api.post("/pages", values);
      const pageId = pageRes.data?.id;

      if (!pageId) {
        throw new Error("Page ID not returned from API");
      }

      if (content.length > 0) {
        await Promise.all(
          content.map((block, index) =>
            api.post("/blocks", {
              pageId,
              componentType: block.type,
              blockOrder: index,
              data: JSON.stringify(block.fields),
            })
          )
        );
      }

      message.success("Page created successfully");
      router.push("/dashboard/pages");
    } catch (err: any) {
      message.error(err.message || "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectComponent = (component: ComponentItem) => {
    const newBlock: Block = {
      id: `${Date.now()}`,
      name: component.name,
      type: component.type,
      fields: component.componentSchema.fields.reduce(
        (acc: Record<string, string>, field: any) => {
          acc[field.key] = "";
          return acc;
        },
        {}
      ),
    };

    setContent((prev) => [...prev, newBlock]);
  };

  const handleRemoveBlock = (blockId: string) => {
    setContent((prev) => prev.filter((b) => b.id !== blockId));
  };

  const handleFieldChange = (
    blockId: string,
    key: string,
    value: string
  ) => {
    setContent((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? { ...b, fields: { ...b.fields, [key]: value } }
          : b
      )
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(content);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setContent(items);
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="Add New Page"
            style={{ maxWidth: 800, margin: "20px auto" }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ status: "draft" }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Title is required" }]}
                  >
                    <Input placeholder="Page title" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Slug"
                    name="slug"
                    rules={[{ required: true, message: "Slug is required" }]}
                  >
                    <Input placeholder="page-slug" />
                  </Form.Item>
                </Col>
              </Row>

              <PageBuilder
                content={content}
                onDragEnd={onDragEnd}
                onRemoveBlock={handleRemoveBlock}
                onFieldChange={handleFieldChange}
              />

              <Form.Item label="Status" name="status">
                <Select>
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="published">Published</Select.Option>
                </Select>
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading}>
                Create Page
              </Button>
            </Form>
          </Card>
        </Col>

        <Col span={8} style={{ marginTop: 20 }}>
          <ComponentList onSelect={handleSelectComponent} />
        </Col>
      </Row>
    </Spin>
  );
}

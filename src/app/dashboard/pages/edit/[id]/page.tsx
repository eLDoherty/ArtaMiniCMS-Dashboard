"use client";

import { useEffect, useState } from "react";
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
  Modal,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { DropResult } from "@hello-pangea/dnd";

import api from "@/lib/api";
import ComponentList, {
  ComponentItem,
} from "@/components/globals/ComponentList";
import PageBuilder from "@/components/builder/PageBuilder";

interface Block {
  id: string;
  name: string;
  type: string;
  fields: Record<string, string>;
}

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [content, setContent] = useState<Block[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setInitialLoading(true);

        const [pageRes, blocksRes] = await Promise.all([
          api.get(`/pages/id/${id}`),
          api.get(`/blocks/page/${id}`),
        ]);

        const page = pageRes.data;
        const blocks = blocksRes.data || [];

        form.setFieldsValue({
          title: page.title,
          slug: page.slug,
          status: page.status,
        });

        setContent(
          blocks.map((b: any) => {
            let fields: Record<string, string> = {};

            try {
              fields = b.data ? JSON.parse(b.data) : {};
            } catch {
              fields = {};
            }

            return {
              id: String(b.id),
              name: b.componentType,
              type: b.componentType,
              fields,
            };
          })
        );
      } catch (err) {
        message.error("Failed to load page data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      await api.put(`/pages/${id}`, values);

      for (let i = 0; i < content.length; i++) {
        const block = content[i];

        await api.put(`/blocks/${block.id}`, {
          componentType: block.type,
          blockOrder: i,
          data: JSON.stringify(block.fields),
        });
      }

      message.success("Page updated successfully");
      router.push("/dashboard/pages");
    } catch (err: any) {
      message.error(err.message || "Failed to update page");
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
        (acc: Record<string, string>, f: any) => {
          acc[f.key] = "";
          return acc;
        },
        {}
      ),
    };

    setContent((prev) => [...prev, newBlock]);
  };

  const handleRemoveBlock = (blockId: string) => {
    Modal.confirm({
      title: "Delete block?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk() {
        setContent((prev) => prev.filter((b) => b.id !== blockId));
      },
    });
  };

  const handleFieldChange = (blockId: string, key: string, value: string) => {
    setContent((prev) =>
      prev.map((b) =>
        b.id === blockId ? { ...b, fields: { ...b.fields, [key]: value } } : b
      )
    );
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(content);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setContent(items);

    try {
      await Promise.all(
        items.map((block, index) =>
          api.put(`/blocks/order/${block.id}`, {
            blockOrder: index,
          })
        )
      );
    } catch (err) {
      message.error("Failed to update block order");
    }
  };

  return (
    <Spin spinning={initialLoading || loading}>
      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="Edit Page"
            style={{ maxWidth: 900, margin: "20px auto" }}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Slug"
                    name="slug"
                    rules={[{ required: true }]}
                  >
                    <Input />
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
                Update Page
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

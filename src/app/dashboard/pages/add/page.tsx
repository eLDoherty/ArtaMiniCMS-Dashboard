"use client";

import { useState } from "react";
import { Card, Form, Input, Select, Button, message, Row, Col } from "antd";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import ComponentList from "@/components/globals/ComponentList";

export default function AddPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await api.post("/pages", values);
      message.success("Page berhasil dibuat");
      router.push("/dashboard/pages");
    } catch (err: any) {
      message.error(err.message || "Gagal membuat page");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectComponent = () => {
    console.log("Testing");
  };

  return (
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
                  rules={[{ required: true, message: "Please input title" }]}
                >
                  <Input placeholder="Page title" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Slug"
                  name="slug"
                  rules={[{ required: true, message: "Please input slug" }]}
                >
                  <Input placeholder="page-slug" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Content"
                  name="content"
                  rules={[{ required: true, message: "Please input content" }]}
                >
                  <Input.TextArea rows={6} placeholder="Page content..." />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Status" name="status">
                  <Select>
                    <Select.Option value="draft">Draft</Select.Option>
                    <Select.Option value="published">Published</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12} style={{ display: "flex", alignItems: "end" }}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Create Page
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
      <Col style={{ margin: "20px auto" }} span={8}>
        <ComponentList  onSelect={handleSelectComponent}  />
      </Col>
    </Row>
  );
}

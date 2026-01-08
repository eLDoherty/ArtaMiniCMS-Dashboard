"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  Row,
  Col,
  Card,
  Image,
  Typography,
  Button,
  Space,
  Upload,
  Input,
  Select,
  message,
  Spin,
  Pagination,
} from "antd";
import {
  FilePdfOutlined,
  FileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import api from "@/lib/api";

const { Text } = Typography;

export type Media = {
  id: number;
  filename: string;
  original_name: string;
  type: string;
  size: number;
  url: string;
  alt?: string;
  category_id?: number;
  category_name?: string;
};

export type MediaCategory = {
  id: number;
  name: string;
};

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
}

export default function MediaModal({
  open,
  onClose,
  onSelect,
}: MediaModalProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [fetching, setFetching] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCategory, setUploadCategory] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  // fetch media
  const fetchMedia = async () => {
    try {
      const res = await api.get("/media");
      setMedia(res.data);
    } catch {
      message.error("Failed to fetch media");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/media/categories");
      setCategories(res.data);
    } catch {}
  };

  useEffect(() => {
    if (open) {
      setFetching(true);
      Promise.all([fetchMedia(), fetchCategories()]).finally(() =>
        setFetching(false)
      );
    }
  }, [open]);

  const submitUpload = async () => {
    if (!uploadFile) {
      message.warning("Select a file");
      return;
    }

    const form = new FormData();
    form.append("file", uploadFile);
    form.append("alt", uploadAlt);
    if (uploadCategory !== null)
      form.append("category_id", String(uploadCategory));

    try {
      setUploading(true);
      const res = await api.post("/media", form);
      message.success("Upload success");
      setMedia((prev) => [res.data, ...prev]);
      // reset form
      setUploadFile(null);
      setUploadAlt("");
      setUploadCategory(null);
      setUploadModalOpen(false); // tutup modal upload
    } catch (err: any) {
      message.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const pagedMedia = media.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      {/* Modal Media Library */}
      <Modal
        title="Media Library"
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <Button
          type="dashed"
          style={{ marginBottom: 16 }}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload New
        </Button>

        {fetching ? (
          <Spin />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {pagedMedia.map((item) => (
                <Col key={item.id} xs={12} sm={8} md={6}>
                  <Card
                    hoverable
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    style={{ textAlign: "center", padding: 8 }}
                  >
                    {item.type === "image" ? (
                      <Image
                        src={process.env.NEXT_PUBLIC_API_BASE + item.url}
                        alt={item.alt}
                        height={120}
                        preview={false}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          height: 120,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.original_name.endsWith(".pdf") ? (
                          <FilePdfOutlined style={{ fontSize: 48 }} />
                        ) : (
                          <FileOutlined style={{ fontSize: 48 }} />
                        )}
                      </div>
                    )}
                    <Text ellipsis style={{ fontSize: 12 }}>
                      {item.original_name}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>

            <Space
              style={{ marginTop: 16, justifyContent: "center", width: "100%" }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={media.length}
                showSizeChanger
                pageSizeOptions={[12, 20, 40, 80]}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }}
              />
            </Space>
          </>
        )}
      </Modal>

      {/* Modal Upload New */}
      <Modal
        title="Upload New Media"
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        footer={null}
        width={400}
      >
        {/* Upload Button */}
        <Button
          icon={<UploadOutlined />}
          onClick={() => document.getElementById("fileInput")?.click()}
          style={{ width: "100%", marginBottom: 16 }}
        >
          Select File
        </Button>

        {/* Hidden Upload Input */}
        <Upload
          id="fileInput"
          beforeUpload={(file) => {
            setUploadFile(file);
            return false;
          }}
          maxCount={1}
          showUploadList={false}
        >
          <input type="file" style={{ display: "none" }} />
        </Upload>

        {/* Preview File */}
        {uploadFile && (
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            {uploadFile.type.startsWith("image") ? (
              <Image
                src={URL.createObjectURL(uploadFile)}
                alt={uploadAlt || uploadFile.name}
                height={150}
                preview={false}
                style={{ objectFit: "cover", marginBottom: 8 }}
              />
            ) : (
              <FileOutlined style={{ fontSize: 64, marginBottom: 8 }} />
            )}
            <Text ellipsis style={{ display: "block", fontSize: 12 }}>
              {uploadFile.name}
            </Text>
          </div>
        )}

        {/* Field lainnya */}
        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
          <Input
            placeholder="Alt text"
            value={uploadAlt}
            onChange={(e) => setUploadAlt(e.target.value)}
          />

          <Select
            placeholder="Category"
            value={uploadCategory}
            onChange={setUploadCategory}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            style={{ width: "100%" }}
          />

          <Button type="primary" onClick={submitUpload} loading={uploading}>
            Upload
          </Button>
        </Space>
      </Modal>
    </>
  );
}

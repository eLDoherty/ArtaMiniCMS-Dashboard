'use client'

import { useEffect, useState } from 'react'
import {
  Row,
  Col,
  Card,
  Image,
  Typography,
  Button,
  Drawer,
  Space,
  Input,
  Popconfirm,
  message,
  Modal,
  Upload,
  Spin,
  Select,
  Pagination
} from 'antd'
import {
  FilePdfOutlined,
  FileOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  UploadOutlined
} from '@ant-design/icons'
import api from '@/lib/api'

const { Text } = Typography

type Media = {
  id: number
  filename: string
  original_name: string
  type: string
  size: number
  url: string
  alt?: string
  category_id?: number
  category_name?: string
}

type MediaCategory = {
  id: number
  name: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [categories, setCategories] = useState<MediaCategory[]>([])
  const [selected, setSelected] = useState<Media | null>(null)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [alt, setAlt] = useState('')
  const [originalName, setOriginalName] = useState('')

  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadAlt, setUploadAlt] = useState('')
  const [uploadCategory, setUploadCategory] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const fetchMedia = async () => {
    const res = await api.get('/media')
    setMedia(res.data)
  }

  const fetchCategories = async () => {
    const res = await api.get('/media/categories')
    setCategories(res.data)
  }

  useEffect(() => {
    Promise.all([fetchMedia(), fetchCategories()])
      .catch(() => message.error('Failed to load media'))
      .finally(() => setFetching(false))
  }, [])

  const openDrawer = async (item: Media) => {
    try {
      const res = await api.get(`/media/${item.id}`)
      setSelected(res.data)
      setAlt(res.data.alt || '')
      setOriginalName(res.data.original_name || '')
      setDrawerOpen(true)
    } catch {
      message.error('Failed to load media detail')
    }
  }

  const saveMediaMeta = async () => {
    if (!selected) return

    await api.put(`/media/${selected.id}`, {
      alt,
      original_name: originalName
    })

    message.success('Media updated')
    fetchMedia()
    setDrawerOpen(false)
  }

  const deleteMedia = async () => {
    if (!selected) return

    await api.delete(`/media/${selected.id}`)
    message.success('Media deleted')
    setDrawerOpen(false)
    setCurrentPage(1)
    fetchMedia()
  }

  const submitUpload = async () => {
    if (!uploadFile) {
      message.warning('Select a file')
      return
    }

    const form = new FormData()
    form.append('file', uploadFile)
    form.append('alt', uploadAlt)

    if (uploadCategory !== null) {
      form.append('category_id', String(uploadCategory))
    }

    try {
      setUploading(true)
      await api.post('/media', form)
      message.success('Upload success')
      setUploadOpen(false)
      setUploadFile(null)
      setUploadAlt('')
      setUploadCategory(null)
      setCurrentPage(1)
      fetchMedia()
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const isDirty =
    alt !== selected?.alt ||
    originalName !== selected?.original_name

  const pagedMedia = media.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 18 }}>
          Media Library
        </Text>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setUploadOpen(true)}
        >
          Add Media
        </Button>
      </Space>

      {fetching ? (
        <Spin />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {pagedMedia.map(item => (
              <Col key={item.id} xs={12} sm={8} md={6} lg={4}>
                <Card
                  hoverable
                  styles={{ body: { padding: 8 } }}
                  onClick={() => openDrawer(item)}
                >
                  {item.type === 'image' ? (
                    <Image
                      src={process.env.NEXT_PUBLIC_API_BASE + item.url}
                      alt={item.alt}
                      height={120}
                      preview={false}
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 120,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.original_name.endsWith('.pdf') ? (
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
            style={{
              marginTop: 24,
              justifyContent: 'center',
              width: '100%'
            }}
          >
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={media.length}
              showSizeChanger
              pageSizeOptions={[12, 20, 40, 80]}
              onChange={(page, size) => {
                setCurrentPage(page)
                setPageSize(size)
              }}
            />
          </Space>
        </>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Media Details"
      >
        {selected && (
          <Space orientation="vertical" style={{ width: '100%' }}>
            {selected.type === 'image' ? (
              <Image
                src={process.env.NEXT_PUBLIC_API_BASE + selected.url}
                style={{ objectFit: 'contain', height: 300 }}
              />
            ) : (
              <FileOutlined style={{ fontSize: 64 }} />
            )}

            <Text strong>File name</Text>
            <Input
              value={originalName}
              onChange={e => setOriginalName(e.target.value)}
            />

            <Text strong>Alt text</Text>
            <Input
              value={alt}
              onChange={e => setAlt(e.target.value)}
            />

            <Text type="secondary">
              {(selected.size / 1024).toFixed(1)} KB
            </Text>

            <Text>
              Category: {selected.category_name || '-'}
            </Text>

            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={saveMediaMeta}
                disabled={!isDirty}
              >
                Save
              </Button>

              <Popconfirm
                title="Delete media?"
                onConfirm={deleteMedia}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        )}
      </Drawer>

      <Modal
        title="Add Media"
        open={uploadOpen}
        onCancel={() => setUploadOpen(false)}
        onOk={submitUpload}
        confirmLoading={uploading}
        okText="Upload"
      >
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Upload
            beforeUpload={file => {
              setUploadFile(file)
              return false
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>
              Select File
            </Button>
          </Upload>

          <Input
            placeholder="Alt text"
            value={uploadAlt}
            onChange={e => setUploadAlt(e.target.value)}
          />

          <Select
            placeholder="Select category"
            value={uploadCategory}
            onChange={setUploadCategory}
            options={categories.map(c => ({
              value: c.id,
              label: c.name
            }))}
          />
        </Space>
      </Modal>
    </>
  )
}

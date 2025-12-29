'use client'

import { Layout, Menu } from 'antd'
import {
  FileTextOutlined,
  ReadOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const { Sider } = Layout

export default function Sidebar() {
  const router = useRouter()

  return (
    <Sider theme="dark">
      <Menu
        mode="inline"
        onClick={(e) => router.push(`/dashboard/${e.key}`)}
        items={[
          { key: 'pages', icon: <FileTextOutlined />, label: 'Pages' },
          { key: 'articles', icon: <ReadOutlined />, label: 'Articles' },
          { key: 'users', icon: <UserOutlined />, label: 'Users' },
          { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
        ]}
      />
    </Sider>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    Cookies.remove('token')
    localStorage.removeItem('user')
    router.replace('/login')
  }, [router])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <h2>Logging out...</h2>
    </div>
  )
}

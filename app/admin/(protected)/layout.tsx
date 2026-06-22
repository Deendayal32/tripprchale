import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminNavbar from '@/components/AdminNavbar'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const jar   = await cookies()
  const token = jar.get('admin_token')?.value

  if (!token) {
    redirect('/admin/login')
  }

  return (
    <div style={{ background: '#f4f6f9', minHeight: '100vh' }}>
      <AdminNavbar />
      <div style={{ paddingTop: '3.5rem' }}>
        {children}
      </div>
    </div>
  )
}

import { useContext, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { AppContext } from 'src/contexts/app.context'
import { Loader2 } from 'lucide-react'
import path from 'src/constants/path'
import { toast } from 'react-toastify'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, profile } = useContext(AppContext)
  const location = useLocation()

  useEffect(() => {
    // Kiểm tra và hiển thị thông báo nếu không có quyền
    if (profile && !profile.roles?.includes('Admin')) {
      toast.error('Bạn không có quyền truy cập trang quản trị')
    }
  }, [profile])

  // Debug logs
  // useEffect(() => {
  //   console.log('=== AdminGuard Debug ===')
  //   console.log('Current path:', location.pathname)
  //   console.log('isAuthenticated:', isAuthenticated)
  //   console.log('profile:', JSON.stringify(profile, null, 2))
  //   console.log('profile?.roles:', JSON.stringify(profile?.roles, null, 2))
  //   console.log('========================')
  // }, [isAuthenticated, profile, location.pathname])

  // Nếu chưa authenticated thì redirect về login
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login')
    return <Navigate to={path.login} state={{ from: location }} replace />
  }

  // Nếu chưa có profile (đang load) thì hiển thị loading
  if (!profile) {
    console.log('⏳ Profile loading...')
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
        <Loader2 className='h-8 w-8 animate-spin text-main-500' />
      </div>
    )
  }

  // Kiểm tra quyền Admin
  if (!profile.roles?.includes('Admin')) {
    console.log('❌ Not admin, redirecting to home')
    console.log('Available roles:', profile.roles)
    return <Navigate to={path.home} replace />
  }

  // Kiểm tra các quyền đặc biệt cho từng route

  console.log('✅ Access granted (bypass mode)')
  return <>{children}</>
}

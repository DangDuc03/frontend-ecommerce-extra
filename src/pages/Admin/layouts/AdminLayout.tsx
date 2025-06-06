import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import path from 'src/constants/path'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  BarChart3,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  User,
  ClipboardList
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: path.admin.dashboard },
  { id: 'products', label: 'Quản Lý Sản Phẩm', icon: Package, path: path.admin.products },
  { id: 'categories', label: 'Quản Lý Danh Mục', icon: FolderTree, path: path.admin.categories },
  { id: 'orders', label: 'Quản Lý Đơn Hàng', icon: ClipboardList, path: path.admin.orders },
  { id: 'users', label: 'Quản Lý Người Dùng', icon: Users, path: path.admin.users },
  { id: 'reports', label: 'Báo Cáo & Thống Kê', icon: BarChart3, path: path.admin.reports }
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} fixed left-0 top-0 h-full z-40`}
      >
        {/* Logo */}
        <div className='h-16 flex items-center justify-between px-4 border-b'>
          {sidebarOpen && (
            <div className='flex items-center space-x-2'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-button'>
                  <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M5 16L3 14l5.5-5.5L10 10l1.5-1.5L18 15l-2 2-5.5-5.5L9 13l-1.5 1.5L5 16z' />
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold bg-button bg-clip-text text-transparent'>Prime</h3>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className='mt-6 px-3'>
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg mb-2 transition-colors ${
                  location.pathname === item.path ? 'bg-button' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className='font-medium'>{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Header */}
        <header className='bg-white shadow-sm border-b h-16 flex items-center justify-between px-6'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-2xl font-semibold text-gray-800'>
              {menuItems.find((item) => location.pathname === item.path)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className='flex items-center space-x-4'>
            {/* Notifications */}
            <button className='relative p-2 text-gray-400 hover:text-gray-600 transition-colors'>
              <Bell size={20} />
              <span className='absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>

            {/* Settings */}
            <button className='p-2 text-gray-400 hover:text-gray-600 transition-colors'>
              <Settings size={20} />
            </button>

            {/* User Menu */}
            <div className='relative'>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className='flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <div className='w-8 h-8 bg-button rounded-full flex items-center justify-center'>
                  <User size={16} className='text-white' />
                </div>
                <span className='text-sm font-medium text-gray-700'>Admin User</span>
                <ChevronDown size={16} className='text-gray-400' />
              </button>

              {dropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50'>
                  <button className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2'>
                    <User size={16} />
                    <span>Thông tin cá nhân</span>
                  </button>
                  <button className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2'>
                    <Settings size={16} />
                    <span>Cài đặt</span>
                  </button>
                  <hr className='my-1' />
                  <button className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2'>
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className='p-6'>
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden' onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

import { useState, useContext } from 'react'
import useAdminUsers from 'src/hooks/useAdminUsers'
import { User, CreateUserDto } from 'src/types/user.type'
import { Edit, Trash2, Plus, Search, Loader2 } from 'lucide-react'

import { formatDate } from 'src/utils/utils'
import UserForm from './UserForm'
import ConfirmModal from 'src/components/ConfirmModal'
import { ADMIN_DELETE_VERIFICATION_CODE, AUTH_MESSAGES } from 'src/constants/auth.constants'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import useOnlineStatus from 'src/hooks/useOnlineStatus'

export default function Users() {
  const { usersQuery, deleteUserMutation, createUserMutation, updateUserMutation } = useAdminUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const { profile } = useContext(AppContext)

  

  // Log để kiểm tra cấu trúc response
  console.log('Users Response:', usersQuery.data)

  const handleDeleteClick = (user: User) => {
    // Kiểm tra nếu user đang xóa chính mình
    if (user._id === profile?._id) {
      toast.error('Không thể xóa tài khoản của chính mình')
      return
    }

    setUserToDelete(user)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete._id)
      setShowDeleteConfirm(false)
      setUserToDelete(null)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleSubmit = (data: CreateUserDto) => {
    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser._id,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          roles: data.roles
        }
      })
    } else {
      createUserMutation.mutate(data)
    }
    setShowForm(false)
    setEditingUser(null)
  }

  // Xử lý data an toàn hơn
  const users = usersQuery.data?.data.data || []
  const filteredUsers = searchTerm
    ? users.filter((user: User) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users

  // Loading state
  if (usersQuery.isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-orange-500' />
      </div>
    )
  }

  // Error state
  if (usersQuery.isError) {
    return (
      <div className='flex flex-col items-center justify-center h-screen text-gray-500'>
        <p>Có lỗi xảy ra khi tải dữ liệu</p>
        <button
          onClick={() => usersQuery.refetch()}
          className='mt-4 text-orange-500 hover:text-orange-600'
        >
          Thử lại
        </button>
      </div>
    )
  }

  const getStatusColor = (user: User) => {
    if (user.isOnline) {
      return 'bg-green-500'
    }
    // Kiểm tra xem user có hoạt động trong 5 phút gần đây không
    const lastActive = user.lastActive ? new Date(user.lastActive) : null
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    if (lastActive && lastActive > fiveMinutesAgo) {
      return 'bg-yellow-500' // Away
    }
    return 'bg-gray-500' // Offline
  }

  const getStatusText = (user: User) => {
    if (user.isOnline) {
      return 'Online'
    }
    if (user.lastActive) {
      const lastActive = new Date(user.lastActive)
      const now = new Date()
      const diffMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60))
      
      if (diffMinutes < 1) {
        return 'Vừa truy cập'
      }
      if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`
      }
      const diffHours = Math.floor(diffMinutes / 60)
      if (diffHours < 24) {
        return `${diffHours} giờ trước`
      }
      return formatDate(user.lastActive)
    }
    return 'Offline'
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold'>Quản Lý Người Dùng</h2>
          <button
            onClick={() => setShowForm(true)}
            className='bg-orange text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors'
          >
            <Plus size={20} />
            Thêm Người Dùng
          </button>
        </div>

        {/* Search */}
        <div className='relative'>
          <input
            type='text'
            placeholder='Tìm kiếm theo email hoặc tên...'
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-orange'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={20} />
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Thông tin
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Trạng thái
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Số điện thoại
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Ngày tạo
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Vai trò
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Thao tác</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredUsers.map((user: User) => (
                <tr key={user._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center'>
                      <div className='ml-4'>
                        <div className={`text-sm font-semibold text-gray-900`}>{user.name}</div>
                        <div className={`text-sm text-gray-500`}>{user.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{user.email}</td>
                  <td className='px-6 py-4 text-sm text-gray-500'>
                    <div className='flex items-center space-x-2'>
                      <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(user)}`}></span>
                      <span>{getStatusText(user)}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{user.phone}</td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{formatDate(user.createdAt)}</td>
                  <td className='px-6 py-4 text-sm text-gray-500'>
                  {user.roles?.map((role) => {
                    const isAdmin = role === 'Admin'
                    const bgColor = isAdmin ? 'bg-green-100' : 'bg-blue-100'
                    const textColor = isAdmin ? 'text-green-800' : 'text-blue-800'
                    return (
                      <span
                        key={role}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} mr-2`}
                      >
                        {role}
                      </span>
                    )
                  })}
                  </td>
                  <td className='px-6 py-4 text-sm font-medium'>
                    <div className='flex space-x-3'>
                      <button
                        onClick={() => handleEdit(user)}
                        className='text-blue-600 hover:text-blue-900'
                        disabled={updateUserMutation.isPending}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className={`text-red-600 hover:text-red-900`}
                        disabled={deleteUserMutation.isPending || user._id === profile?._id}
                        style={{ cursor: deleteUserMutation.isPending || user._id === profile?._id ? 'not-allowed' : 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          initialData={editingUser || undefined}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingUser(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={AUTH_MESSAGES.USER_DELETE_TITLE}
        message={AUTH_MESSAGES.USER_DELETE_CONFIRM}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setUserToDelete(null)
        }}
        isAdmin={userToDelete?.roles.includes('Admin')}
        adminCode={ADMIN_DELETE_VERIFICATION_CODE}
      />
    </div>
  )
} 
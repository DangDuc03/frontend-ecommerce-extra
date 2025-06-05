import { useState } from 'react'
import { X } from 'lucide-react'
import { AUTH_MESSAGES } from 'src/constants/auth.constants'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isAdmin?: boolean
  adminCode?: string
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isAdmin = false,
  adminCode
}: ConfirmModalProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (isAdmin) {
      if (code === adminCode) {
        onConfirm()
        setCode('')
      } else {
        setError(AUTH_MESSAGES.ADMIN_DELETE_CODE_ERROR)
      }
    } else {
      onConfirm()
    }
  }

  const handleCancel = () => {
    setCode('')
    onCancel()
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md relative'>
        <button onClick={handleCancel} className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'>
          <X size={20} />
        </button>
        
        <h3 className='text-lg font-semibold mb-4'>{title}</h3>
        <p className='text-gray-600 mb-6'>{message}</p>

        {isAdmin && (
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Nhập mã xác thực Admin
            </label>
            <input
              type='text'
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError('')
              }}
              className='w-full p-2 border rounded focus:outline-none focus:border-orange'
              placeholder='Nhập mã xác thực'
            />
            {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
          </div>
        )}

        <div className='flex justify-end gap-4'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-sm border rounded-lg hover:bg-gray-50'
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className='px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600'
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
} 
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, CreateUserDto } from 'src/types/user.type'
import { X } from 'lucide-react'

interface UserFormProps {
  initialData?: User
  onSubmit: (data: CreateUserDto) => void
  onClose: () => void
}

export default function UserForm({ initialData, onSubmit, onClose }: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateUserDto>({
    defaultValues: initialData || {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      roles: ['User']
    }
  })

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md relative'>
        <button onClick={onClose} className='absolute right-4 top-4 text-gray-500 hover:text-gray-700'>
          <X size={20} />
        </button>
        <h3 className='text-lg font-semibold mb-4'>{initialData ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên</label>
            <input
              {...register('name', { required: 'Tên là bắt buộc' })}
              type='text'
              className='w-full p-2 border rounded focus:outline-none focus:border-primary'
            />
            {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input
              {...register('email', {
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ'
                }
              })}
              type='email'
              className='w-full p-2 border rounded focus:outline-none focus:border-primary'
            />
            {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
          </div>

          {!initialData && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Mật khẩu</label>
              <input
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                  }
                })}
                type='password'
                className='w-full p-2 border rounded focus:outline-none focus:border-primary'
              />
              {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>}
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Số điện thoại</label>
            <input
              {...register('phone')}
              type='tel'
              className='w-full p-2 border rounded focus:outline-none focus:border-primary'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Địa chỉ</label>
            <input
              {...register('address')}
              type='text'
              className='w-full p-2 border rounded focus:outline-none focus:border-primary'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Vai trò</label>
            <select
              {...register('roles')}
              className='w-full p-2 border rounded focus:outline-none focus:border-primary'
              multiple
            >
              <option value='User'>User</option>
              <option value='Admin'>Admin</option>
            </select>
          </div>

          <div className='flex justify-end gap-4 mt-6'>
            <button type='button' onClick={onClose} className='px-4 py-2 text-sm border rounded-lg hover:bg-gray-50'>
              Hủy
            </button>
            <button type='submit' className='px-4 py-2 text-sm bg-button rounded-lg hover:bg-button-hover'>
              {initialData ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

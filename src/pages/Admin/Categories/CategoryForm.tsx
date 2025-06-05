import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'

interface Category {
  _id: string
  name: string
}

interface CategoryFormProps {
  initialData?: Category
  onSubmit: (data: any) => void
  onClose: () => void
}

export default function CategoryForm({ initialData, onSubmit, onClose }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  })

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-[400px]'>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>
              {initialData ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
            </h2>
            <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Tên danh mục
              </label>
              <input
                {...register('name', { required: 'Vui lòng nhập tên danh mục' })}
                type='text'
                className='w-full p-2 border rounded-lg focus:outline-none focus:border-orange'
              />
              {errors.name && (
                <span className='text-red-500 text-sm'>{errors.name.message}</span>
              )}
            </div>

            <div className='flex justify-end space-x-4 pt-4'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 border rounded-lg hover:bg-gray-50'
              >
                Hủy
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-600'
              >
                {initialData ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 
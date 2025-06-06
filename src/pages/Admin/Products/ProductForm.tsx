import { useForm } from 'react-hook-form'
import { Product } from 'src/types/product.type'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from 'src/apis/admin.api'
import { X } from 'lucide-react'
import { useState } from 'react'

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: any) => void
  onClose: () => void
}

const IMAGE_BASE_URL = 'http://localhost:4000/images'

export default function ProductForm({ initialData, onSubmit, onClose }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    defaultValues: initialData
  })

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>(initialData?.images || [])
  const [uploading, setUploading] = useState(false)

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => adminApi.categories.getList()
  })

  const categories = categoriesData?.data.data || []

  // Xử lý chọn nhiều ảnh
  const handleImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setSelectedFiles(files)
    // Hiển thị preview ảnh local
    const previews = files.map((file) => URL.createObjectURL(file))
    setPreviewImages(previews)
    // Upload lên server
    if (files.length > 0) {
      setUploading(true)
      const formData = new FormData()
      files.forEach((file) => formData.append('images', file))
      try {
        const res = await adminApi.products.uploadImages(formData)
        // res.data.data là mảng tên file ảnh
        setValue('images', res.data.data)
        // Set image đại diện là ảnh đầu tiên
        setValue('image', res.data.data[0] || '')
      } catch (err) {
        // handle error
      } finally {
        setUploading(false)
      }
    }
  }

  // Xóa ảnh khỏi preview và danh sách images
  const handleRemoveImage = (idx: number) => {
    const newPreview = [...previewImages]
    newPreview.splice(idx, 1)
    setPreviewImages(newPreview)
    // Xóa khỏi images đã upload
    const images = getValues('images') || []
    images.splice(idx, 1)
    setValue('images', images)
    // Nếu xóa ảnh đầu tiên thì cập nhật lại image đại diện
    setValue('image', images[0] || '')
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-xl font-semibold'>{initialData ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h2>
            <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Tên sản phẩm</label>
              <input
                {...register('name', { required: 'Vui lòng nhập tên sản phẩm' })}
                type='text'
                className='w-full p-2 border rounded-lg focus:outline-none focus:border-primary'
              />
              {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Mô tả</label>
              <textarea
                {...register('description')}
                rows={3}
                className='w-full p-2 border rounded-lg focus:outline-none focus:border-primary'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Giá</label>
                <input
                  {...register('price', {
                    required: 'Vui lòng nhập giá',
                    min: { value: 1000, message: 'Giá phải lớn hơn 1000đ' }
                  })}
                  type='number'
                  className='w-full p-2 border rounded-lg focus:outline-none focus:border-primary'
                />
                {errors.price && <span className='text-red-500 text-sm'>{errors.price.message}</span>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Số lượng</label>
                <input
                  {...register('quantity', {
                    required: 'Vui lòng nhập số lượng',
                    min: { value: 0, message: 'Số lượng không được âm' }
                  })}
                  type='number'
                  className='w-full p-2 border rounded-lg focus:outline-none focus:border-primary'
                />
                {errors.quantity && <span className='text-red-500 text-sm'>{errors.quantity.message}</span>}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Danh mục</label>
              <select
                {...register('category', { required: 'Vui lòng chọn danh mục' })}
                className='w-full p-2 border rounded-lg focus:outline-none focus:border-primary'
              >
                <option value=''>Chọn danh mục</option>
                {categories.map((category: any) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className='text-red-500 text-sm'>{errors.category.message}</span>}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Ảnh sản phẩm (nhiều ảnh)</label>
              <input type='file' multiple accept='image/*' onChange={handleImagesChange} />
              {uploading && <div className='text-main-500 text-sm'>Đang upload ảnh...</div>}
              <div className='flex gap-2 mt-2 flex-wrap'>
                {previewImages.map((img, idx) => (
                  <div key={idx} className='relative'>
                    <img src={img} alt='image product' className='w-16 h-16 object-cover rounded' />
                    <button
                      type='button'
                      onClick={() => handleRemoveImage(idx)}
                      className='absolute -top-2 -right-2 bg-white rounded-full p-1 shadow'
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <input type='hidden' {...register('images')} />
            <input type='hidden' {...register('image')} />

            <div className='flex justify-end space-x-4 pt-4'>
              <button type='button' onClick={onClose} className='px-4 py-2 border rounded-lg hover:bg-gray-50'>
                Hủy
              </button>
              <button type='submit' className='px-4 py-2 bg-button text-white rounded-lg hover:bg-button-hover'>
                {initialData ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

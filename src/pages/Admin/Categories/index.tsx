import { useState } from 'react'
import useAdminCategories from 'src/hooks/useAdminCategories'
import { Category } from 'src/types/category.type'
import { Edit, Trash2, Plus, Search, Loader2 } from 'lucide-react'
import CategoryForm from './CategoryForm'
import useAdminProducts from 'src/hooks/useAdminProducts'
import { Product } from 'src/types/product.type'
import CountUp from 'react-countup'

export default function Categories() {
  const { categoriesQuery, deleteCategoryMutation, createCategoryMutation, updateCategoryMutation } =
    useAdminCategories()
  const { productsQuery } = useAdminProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  console.log('Categories Response:', categoriesQuery.data?.data.data)

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      deleteCategoryMutation.mutate(id)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleSubmit = (data: any) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory._id,
        data
      })
    } else {
      createCategoryMutation.mutate(data)
    }
    setShowForm(false)
    setEditingCategory(null)
  }

  // Xử lý data an toàn hơn
  const categories = categoriesQuery.data?.data.data || []
  const products = productsQuery.data?.data?.data.products || []

  const filteredCategories = searchTerm
    ? categories.filter((category: Category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : categories

  // Đếm số lượng sản phẩm cho mỗi category
  const getProductCount = (categoryId: string) => {
    return products.filter((product: Product) => product.category._id === categoryId).length
  }

  // Loading state
  if (categoriesQuery.isLoading || productsQuery.isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-main-500' />
      </div>
    )
  }

  // Error state
  if (categoriesQuery.isError || productsQuery.isError) {
    return (
      <div className='flex flex-col items-center justify-center h-screen text-gray-500'>
        <p>Có lỗi xảy ra khi tải dữ liệu</p>
        <button
          onClick={() => {
            categoriesQuery.refetch()
            productsQuery.refetch()
          }}
          className='mt-4 text-main-500 hover:text-main-600'
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold'>Quản Lý Danh Mục</h2>
          <button
            onClick={() => setShowForm(true)}
            className='bg-button px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-button-hover transition-colors'
          >
            <Plus size={20} />
            Thêm Danh Mục
          </button>
        </div>

        {/* Search */}
        <div className='relative'>
          <input
            type='text'
            placeholder='Tìm kiếm danh mục...'
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={20} />
        </div>
      </div>

      {/* Categories Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Tên Danh Mục
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Số Lượng Sản Phẩm
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredCategories.map((category: Category) => (
                <tr key={category._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>{category.name}</div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500'>
                    <CountUp end={getProductCount(category._id)} duration={1.5} />
                  </td>
                  <td className='px-6 py-4 text-sm font-medium'>
                    <div className='flex space-x-3'>
                      <button
                        onClick={() => handleEdit(category)}
                        className='text-blue-600 hover:text-blue-900'
                        disabled={updateCategoryMutation.isPending}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className='text-red-600 hover:text-red-900'
                        disabled={deleteCategoryMutation.isPending}
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

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
}

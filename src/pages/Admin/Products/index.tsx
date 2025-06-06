import { useState } from 'react'
import useAdminProducts from 'src/hooks/useAdminProducts'
import { Product } from 'src/types/product.type'
import { Edit, Trash2, Plus, Search, Loader2 } from 'lucide-react'
import { formatCurrency } from 'src/utils/utils'
import ProductForm from './ProductForm'

export default function Products() {
  const { productsQuery, deleteProductMutation, createProductMutation, updateProductMutation } = useAdminProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Log để kiểm tra cấu trúc response
  console.log('Products Response:', productsQuery.data)

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      deleteProductMutation.mutate(id)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleSubmit = (data: any) => {
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id,
        data: {
          ...data,
          price_before_discount: data.price
        }
      })
    } else {
      createProductMutation.mutate({
        ...data,
        price_before_discount: data.price
      })
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  // Xử lý data an toàn hơn
  const products = productsQuery.data?.data?.data.products || []
  const filteredProducts = searchTerm
    ? products.filter((product: Product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : products

  // Loading state
  if (productsQuery.isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-main-500' />
      </div>
    )
  }

  // Error state
  if (productsQuery.isError) {
    return (
      <div className='flex flex-col items-center justify-center h-screen text-gray-500'>
        <p>Có lỗi xảy ra khi tải dữ liệu</p>

        <button onClick={() => productsQuery.refetch()} className='mt-4 text-main-500 hover:text-main-600'>
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
          <h2 className='text-xl font-semibold'>Quản Lý Sản Phẩm</h2>
          <button
            onClick={() => setShowForm(true)}
            className='bg-button text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-button-hover transition-colors'
          >
            <Plus size={20} />
            Thêm Sản Phẩm
          </button>
        </div>

        {/* Search */}
        <div className='relative'>
          <input
            type='text'
            placeholder='Tìm kiếm sản phẩm...'
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={20} />
        </div>
      </div>

      {/* Products Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Sản phẩm
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Danh mục
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Giá</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Số lượng
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Đã bán
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredProducts.map((product: Product) => (
                <tr key={product._id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center'>
                      <img src={product.image} alt={product.name} className='h-10 w-10 rounded-lg object-cover' />
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900'>{product.name}</div>
                        <div className='text-sm text-gray-500 truncate max-w-[300px]'>{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{product.category.name}</td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{formatCurrency(product.price)}₫</td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{product.quantity}</td>
                  <td className='px-6 py-4 text-sm text-gray-500'>{product.sold}</td>
                  <td className='px-6 py-4 text-sm font-medium'>
                    <div className='flex space-x-3'>
                      <button
                        onClick={() => handleEdit(product)}
                        className='text-blue-600 hover:text-blue-900'
                        disabled={updateProductMutation.isPending}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className='text-red-600 hover:text-red-900'
                        disabled={deleteProductMutation.isPending}
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

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          initialData={editingProduct || undefined}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

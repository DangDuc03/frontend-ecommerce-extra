import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from 'src/apis/admin.api'
import { ProductListConfig, ProductListResponse } from 'src/types/product.type'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { ErrorResponse } from 'src/types/utils.type'

export default function useAdminProducts() {
  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => adminApi.products.getList({}),
    retry: 1,
    staleTime: 3 * 60 * 1000
  })

  const createProductMutation = useMutation({
    mutationFn: (data: any) => adminApi.products.create(data),
    onSuccess: () => {
      toast.success('Thêm sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi thêm sản phẩm')
      }
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.products.update(id, data),
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm')
      }
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => adminApi.products.delete(id),
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi xóa sản phẩm')
      }
    }
  })

  return {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation
  }
}

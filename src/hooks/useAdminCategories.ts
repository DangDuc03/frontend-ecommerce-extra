import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from 'src/apis/admin.api'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { ErrorResponse } from 'src/types/utils.type'

export default function useAdminCategories() {
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.categories.getList(),
    retry: 1,
    staleTime: 3 * 60 * 1000
  })

  const createCategoryMutation = useMutation({
    mutationFn: (data: any) => adminApi.categories.create(data),
    onSuccess: () => {
      toast.success('Thêm danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi thêm danh mục')
      }
    }
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.categories.update(id, data),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi cập nhật danh mục')
      }
    }
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => adminApi.categories.delete(id),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi xóa danh mục')
      }
    }
  })

  return {
    categoriesQuery,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation
  }
} 
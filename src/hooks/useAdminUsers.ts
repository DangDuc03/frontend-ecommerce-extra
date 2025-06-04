import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from 'src/apis/admin.api'
import { toast } from 'react-toastify'
import { AxiosError } from 'axios'
import { ErrorResponse } from 'src/types/utils.type'

export default function useAdminUsers() {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.users.getList({}),
    retry: 1,
    staleTime: 3 * 60 * 1000
  })

  const createUserMutation = useMutation({
    mutationFn: (data: any) => adminApi.users.create(data),
    onSuccess: () => {
      toast.success('Thêm người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi thêm người dùng')
      }
    }
  })

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminApi.users.update(id, data),
    onSuccess: () => {
      toast.success('Cập nhật người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi cập nhật người dùng')
      }
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminApi.users.delete(id),
    onSuccess: () => {
      toast.success('Xóa người dùng thành công')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const errorResponse = error.response?.data as ErrorResponse<any>
        toast.error(errorResponse?.message || 'Có lỗi xảy ra khi xóa người dùng')
      }
    }
  })

  return {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation
  }
} 
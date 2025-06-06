import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { adminApi } from 'src/apis/admin.api'

export default function useAdminOrders(params?: any) {
  const ordersQuery = useQuery({
    queryKey: ['adminOrders', params],
    queryFn: () => adminApi.orders.getList(params),
    placeholderData: keepPreviousData
  })
  return { ordersQuery }
}

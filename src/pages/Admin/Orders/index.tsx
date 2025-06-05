import React, { useState } from 'react'
import useAdminOrders from 'src/hooks/useAdminOrders'
import { purchasesStatus } from 'src/constants/purchase'
import OrderForm from './OrderForm'

const STATUS_LABELS: Record<number, string> = {
  [purchasesStatus.inCart]: 'Giỏ hàng',
  [purchasesStatus.waitForConfirmation]: 'Chờ xác nhận',
  [purchasesStatus.waitForGetting]: 'Chờ lấy hàng',
  [purchasesStatus.inProgress]: 'Đang giao',
  [purchasesStatus.delivered]: 'Đã giao',
  [purchasesStatus.cancelled]: 'Đã hủy'
}

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả' },
  ...Object.entries(STATUS_LABELS)
    .filter(([value]) => Number(value) !== purchasesStatus.inCart && Number(value) !== purchasesStatus.all)
    .map(([value, label]) => ({ value: Number(value), label }))
]

export default function Orders() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const params = {
    search,
    status,
    page,
    limit,
    refreshKey
  }
  const { ordersQuery }: any = useAdminOrders(params)
  const orders = ordersQuery.data ? ordersQuery.data.data.data.orders : []
  const total = ordersQuery.data && ordersQuery.data.data && ordersQuery.data.data.total ? ordersQuery.data.data.total : 0
  const totalPages = Math.ceil(total / limit)

  console.log("ordersQuery: ", ordersQuery.data?.data?.data)

  const handleUpdated = () => {
    setSelectedOrder(null)
    setRefreshKey(k => k + 1)
  }
  const handleDeleted = () => {
    setSelectedOrder(null)
    setRefreshKey(k => k + 1)
  }

  if (ordersQuery.isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <span className='text-orange-500'>Đang tải đơn hàng...</span>
      </div>
    )
  }

  if (ordersQuery.isError) {
    return (
      <div className='flex flex-col items-center justify-center h-screen text-gray-500'>
        <p>Có lỗi xảy ra khi tải dữ liệu</p>
        <button
          onClick={() => ordersQuery.refetch()}
          className='mt-4 text-orange-500 hover:text-orange-600'
        >
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='bg-white p-6 rounded-lg shadow-sm'>
        <h2 className='text-xl font-semibold mb-4'>Quản Lý Đơn Hàng</h2>
        <div className='flex gap-4 mb-4'>
          <input
            type='text'
            placeholder='Tìm kiếm mã đơn, email khách hàng...'
            className='border px-3 py-2 rounded-lg w-64'
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
          <select
            className='border px-3 py-2 rounded-lg'
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1) }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Mã đơn</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Khách hàng</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tổng tiền</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Trạng thái</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Ngày tạo</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Thao tác</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className='text-center py-6 text-gray-400'>Không có đơn hàng nào</td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className='hover:bg-gray-50 text-sm'>
                    <td className='px-6 py-4'>{order._id}</td>
                    <td className='px-6 py-4'>{order.userName || 'chưa cập nhât'}</td>
                    <td className='px-6 py-4'>{order.total?.toLocaleString() || 0}₫</td>
                    <td className='px-6 py-4'>{STATUS_LABELS[order.status]}</td>
                    <td className='px-6 py-4'>{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
                    <td className='px-6 py-4'>
                      <button
                        className='text-blue-600 hover:underline mr-2'
                        onClick={() => setSelectedOrder(order)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-2 py-4'>
            <button
              className='px-3 py-1 rounded border disabled:opacity-50'
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Trước
            </button>
            <span>Trang {page} / {totalPages}</span>
            <button
              className='px-3 py-1 rounded border disabled:opacity-50'
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Sau
            </button>
          </div>
        )}
      </div>
      {selectedOrder && (
        <OrderForm
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  )
} 
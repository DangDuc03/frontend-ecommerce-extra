import React, { useState } from 'react'
import { adminApi } from 'src/apis/admin.api'
import { toast } from 'react-toastify'
import { purchasesStatus } from 'src/constants/purchase'
import { CloudCog } from 'lucide-react'

const STATUS_LABELS: Record<number, string> = {
  [purchasesStatus.inCart]: 'Giỏ hàng',
  [purchasesStatus.waitForConfirmation]: 'Chờ xác nhận',
  [purchasesStatus.waitForGetting]: 'Chờ lấy hàng',
  [purchasesStatus.inProgress]: 'Đang giao',
  [purchasesStatus.delivered]: 'Đã giao',
  [purchasesStatus.cancelled]: 'Đã hủy'
}

const STATUS_UPDATE_OPTIONS = Object.entries(STATUS_LABELS)
  .filter(([value]) => Number(value) !== purchasesStatus.inCart && Number(value) !== purchasesStatus.all)
  .map(([value, label]) => ({ value: Number(value), label }))

export default function OrderForm({ order, onClose, onUpdated, onDeleted }: any) {
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [status, setStatus] = useState(order.status)

  const handleUpdate = async () => {
    if (status === order.status) return onClose()
    setUpdating(true)
    try {
      await adminApi.orders.update(order._id, { status })
      toast.success('Cập nhật trạng thái thành công!')
      onUpdated()
    } catch (err) {
      toast.error('Cập nhật thất bại!')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn này?')) return
    setDeleting(true)
    try {
      await adminApi.orders.delete(order._id)
      toast.success('Xóa đơn hàng thành công!')
      onDeleted()
    } catch (err) {
      toast.error('Xóa đơn hàng thất bại!')
    } finally {
      setDeleting(false)
    }
  }

  order

  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative'>
        <button className='absolute top-2 right-2 text-gray-400 hover:text-gray-600' onClick={onClose}>
          &times;
        </button>
        <h3 className='text-lg font-semibold mb-4'>Chi tiết đơn hàng</h3>
        <div className='mb-2'>
          <b>Mã đơn:</b> {order._id}
        </div>
        <div className='mb-2'>
          <b>Khách hàng:</b> {order.user?.email || 'Ẩn'}
        </div>
        <div className='mb-2'>
          <b>Tổng tiền:</b> {order.total?.toLocaleString() || 0}₫
        </div>
        <div className='mb-2'>
          <b>Trạng thái:</b>
          <select
            className='border px-2 py-1 rounded ml-2'
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
          >
            {STATUS_UPDATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-2'>
          <b>Ngày tạo:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
        </div>
        <div className='mb-2'>
          <b>Sản phẩm:</b>
          <ul className='list-disc pl-6'>
            {order.items?.map((item: any) => (
              <li key={item._id}>
                {item.name || 'Sản phẩm'} x {item.quantity} ({item.price?.toLocaleString() || 0}₫)
              </li>
            ))}
          </ul>
        </div>
        <div className='flex gap-3 mt-6'>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50'
            onClick={handleUpdate}
            disabled={updating}
          >
            {updating ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          <button
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50'
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Đang xóa...' : 'Xóa đơn'}
          </button>
        </div>
      </div>
    </div>
  )
}

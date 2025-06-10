import React from 'react'
import { Link } from 'react-router-dom'
import { OrderInfo } from '../../@types/chatbot.types'

interface OrderCardProps {
  order: OrderInfo
  index: number
}

const URLIMAGE = import.meta.env.VITE_PRODUCTION_HOSS
? `${import.meta.env.VITE_PRODUCTION_HOSS}/images`
: 'http://localhost:4000/images'

const OrderCard: React.FC<OrderCardProps> = ({ order, index }) => {
  const fallbackImg = '' // Đặt ảnh mặc định trong public nếu chưa có
  const imgSrc = order.image && order.image !== '' ? order.image : fallbackImg
  const productUrl = order.product_url && order.product_url !== '' ? order.product_url : '#'
  return (
    <div
      key={order.product_id || index}
      className='flex flex-col items-center bg-white border border-blue-200 rounded-xl p-4 mb-3 shadow-sm w-full max-w-[200px]'
    >
      <img
        src={`${URLIMAGE}/${imgSrc}`}
        alt={order.name || 'Sản phẩm'}
        className='w-24 h-24 object-cover rounded-lg border border-gray-200 mb-3'
        onError={(e) => (e.currentTarget.src = fallbackImg)}
      />
      <div className='text-center w-full'>
        <Link to={productUrl} className='font-semibold text-sm text-blue-600 hover:underline line-clamp-2'>
          {order.name || 'Tên sản phẩm'}
        </Link>
        <div className='text-sm mt-2 space-y-1'>
          <div>
            <span className='font-medium text-gray-500'>Giá:</span>{' '}
            <span className='text-blue-500 font-semibold'>{order.price ? order.price.toLocaleString() : '---'}đ</span>
          </div>
          <div>
            <span className='font-medium text-gray-500'>Số lượng:</span>{' '}
            <span className='text-green-600 font-semibold'>{order.quantity ?? '---'}</span>
          </div>
          <div>
            <span className='font-medium text-gray-500'>Trạng thái:</span>{' '}
            <span className='text-main-500 font-semibold'>{order.status || '---'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderCard

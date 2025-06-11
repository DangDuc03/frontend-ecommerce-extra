import { useQuery, useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import Button from 'src/components/Button/Button'
import { useState } from 'react'
import { toast } from 'react-toastify'

const purchaseTabs = [
  { status: purchasesStatus.all, name: 'Tất cả' },
  { status: purchasesStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchasesStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchasesStatus.inProgress, name: 'Đang giao' },
  { status: purchasesStatus.delivered, name: 'Đã giao' },
  { status: purchasesStatus.cancelled, name: 'Đã hủy' }
]

// Hàm để lấy tên trạng thái
const getStatusName = (status: number) => {
  const statusMap = {
    [purchasesStatus.waitForConfirmation]: 'Chờ xác nhận',
    [purchasesStatus.waitForGetting]: 'Chờ lấy hàng',
    [purchasesStatus.inProgress]: 'Đang giao',
    [purchasesStatus.delivered]: 'Đã giao',
    [purchasesStatus.cancelled]: 'Đã hủy'
  }
  return statusMap[status as keyof typeof statusMap] || 'Không xác định'
}

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.all
  const [cancelingId, setCancelingId] = useState<string | null>(null)

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: string) => purchaseApi.cancelOrder(orderId),
    onSuccess: () => {
      setCancelingId(null)
      refetch()
    }
  })

  const handleCancelOrder = (orderId: string) => {
    setCancelingId(orderId)
    cancelOrderMutation.mutate(orderId)
    toast.success('Huỷ đơn hàng thành công')
  }

  // Nhóm các sản phẩm theo orderId
  const groupedOrders = purchasesInCart?.reduce(
    (acc, purchase) => {
      console.log('purchase: ', purchase)
      const orderId = purchase.order._id ? purchase.order._id : ''
      if (!acc[orderId]) {
        acc[orderId] = {
          orderId,
          status: purchase.status,
          items: [],
          totalAmount: 0
        }
      }
      acc[orderId].items.push(purchase)
      acc[orderId].totalAmount += purchase.product.price * purchase.buy_count
      return acc
    },
    {} as Record<string, { orderId: string; status: number; items: any[]; totalAmount: number }>
  )

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-primary text-main': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))

  const URLIMAGE = import.meta.env.VITE_PRODUCTION_HOSS
    ? `${import.meta.env.VITE_PRODUCTION_HOSS}/images`
    : 'http://localhost:4000/images'

  // groupedOrders && Object.values(groupedOrders).map((order) => console.log("order: ", order))

  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          <div>
            {groupedOrders &&
              Object.values(groupedOrders).map((order) => (
                <div
                  key={order.orderId}
                  className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'
                >
                  {/* Header đơn hàng */}
                  <div className='mb-4 pb-3 border-b border-gray-200'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <span className='text-sm text-gray-500'>Mã đơn hàng: </span>
                        <span className='font-medium text-blue-500'>{order.orderId}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span
                          className={classNames('font-medium text-[15px]', {
                            'text-gray-500': order.status === purchasesStatus.cancelled,
                            'text-orange-500': order.status === purchasesStatus.waitForConfirmation,
                            'text-blue-500': order.status === purchasesStatus.waitForGetting,
                            'text-purple-500': order.status === purchasesStatus.inProgress,
                            'text-green-500': order.status === purchasesStatus.delivered
                          })}
                        >
                          {getStatusName(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách sản phẩm trong đơn hàng */}
                  <div className='space-y-4'>
                    {order.items.map((purchase) => (
                      <Link
                        key={purchase._id}
                        to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                        className='flex items-center py-2 hover:bg-gray-50 rounded transition-colors'
                      >
                        <div className='flex-shrink-0'>
                          <img
                            className='h-20 w-20 object-cover rounded'
                            src={`${URLIMAGE}/${purchase.product.image}`}
                            alt={purchase.product.name}
                          />
                        </div>
                        <div className='ml-3 flex-grow overflow-hidden'>
                          <div className='truncate font-medium'>{purchase.product.name}</div>
                          <div className='mt-2 text-sm text-gray-600'>Số lượng: x{purchase.buy_count}</div>
                        </div>
                        <div className='ml-3 flex-shrink-0 text-right'>
                          <div className='text-sm text-gray-500 line-through'>
                            ₫{formatCurrency(purchase.product.price_before_discount)}
                          </div>
                          <div className='text-main font-medium'>₫{formatCurrency(purchase.product.price)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Footer đơn hàng - Tổng tiền và nút hành động */}
                  <div className='mt-4 pt-4 border-t border-gray-200'>
                    <div className='flex justify-between items-center'>
                      {/* Tổng tiền */}
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>Tổng tiền:</span>
                        <span
                          className={classNames('text-xl font-semibold', {
                            'text-gray-500 line-through': order.status === purchasesStatus.cancelled,
                            'text-main': order.status !== purchasesStatus.cancelled
                          })}
                        >
                          ₫{formatCurrency(order.totalAmount)}
                        </span>
                      </div>

                      {/* Nút huỷ đơn - chỉ hiển thị khi đơn hàng đang chờ xác nhận */}
                      {order.status === purchasesStatus.waitForConfirmation && status !== purchasesStatus.all && (
                        <Button
                          className='bg-button text-white px-6 py-2 rounded hover:bg-button-hover transition-colors font-medium'
                          isLoading={cancelingId === order.orderId && cancelOrderMutation.isPending}
                          disabled={cancelingId === order.orderId && cancelOrderMutation.isPending}
                          onClick={() => handleCancelOrder(order.orderId)}
                        >
                          {cancelingId === order.orderId && cancelOrderMutation.isPending
                            ? 'Đang huỷ...'
                            : 'Huỷ đơn hàng'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

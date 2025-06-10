import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import Popover from '../Popover'
import { purchasesStatus } from 'src/constants/purchase'
import purchaseApi from 'src/apis/purchase.api'
import noproduct from 'src/assets/images/no-product.png'
import { formatCurrency } from 'src/utils/utils'
import NavHeader from '../NavHeader'
import useSearchProducts from 'src/hooks/useSearchProducts'

const URLIMAGE = import.meta.env.VITE_PRODUCTION_HOSS
? `${import.meta.env.VITE_PRODUCTION_HOSS}/images`
: 'http://localhost:4000/images'

const MAX_PURCHASES = 5
export default function Header() {
  const { isAuthenticated } = useContext(AppContext)
  const { onSubmitSearch, register } = useSearchProducts()
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesInCart = purchasesInCartData?.data.data

  return (
    <div className='bg-gradient pb-5 pt-2'>
      <div className='container'>
        <NavHeader />
        <div className='mt-4 grid grid-cols-12 items-center gap-4'>
          <Link to='/' className='col-span-2'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-button'>
                <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M5 16L3 14l5.5-5.5L10 10l1.5-1.5L18 15l-2 2-5.5-5.5L9 13l-1.5 1.5L5 16z' />
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold bg-button bg-clip-text text-transparent'>Prime</h3>
            </div>
          </Link>
          <form className='col-span-9' onSubmit={onSubmitSearch}>
            <div className='bg-white rounded-sm p-1 flex'>
              <input
                type='text'
                className='text-black px-3 py-2 flex-grow border-none outline-none bg-transparent'
                placeholder='FREE SHIP ĐƠN TỪ 0Đ'
                {...register('name')}
              />
              <button className='rounded-sm py-2 px-5 flex-shrink-0 bg-button hover:opacity-90'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className='col-span-1 justify-self-center'>
            <Popover
              renderPopover={
                <div className='relative  max-w-[400px] rounded-sm border border-gray-200 bg-white text-sm shadow-md'>
                  {purchasesInCart && purchasesInCart.length > 0 ? (
                    <div className='p-2'>
                      <div className='capitalize text-gray-400'>Sản phẩm mới thêm</div>
                      <div className='mt-5'>
                        {purchasesInCart.slice(0, MAX_PURCHASES).map((purchase) => (
                          <div className='mt-2 flex py-2 hover:bg-gray-100' key={purchase._id}>
                            <div className='flex-shrink-0'>
                              <img
                                src={`${URLIMAGE}/${purchase.product.image}`}
                                alt={purchase.product.name}
                                className='h-11 w-11 object-cover'
                              />
                            </div>
                            <div className='ml-2 flex-grow overflow-hidden'>
                              <div className='truncate'>{purchase.product.name}</div>
                            </div>
                            <div className='ml-2 flex-shrink-0'>
                              <span className='text-red-500'>₫{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='mt-6 flex items-center justify-between'>
                        <div className='text-xs capitalize text-gray-500'>
                          {purchasesInCart.length > MAX_PURCHASES ? purchasesInCart.length - MAX_PURCHASES : ''} Thêm
                          hàng vào giỏ
                        </div>
                        <Link
                          to={path.cart}
                          className='rounded-sm bg-button px-4 py-2 capitalize hover:bg-button-hover'
                        >
                          Xem giỏ hàng
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className='flex h-[300px] w-[300px] flex-col items-center justify-center p-2'>
                      <img src={noproduct} alt='no purchase' className='h-24 w-24' />
                      <div className='mt-3 capitalize'>Chưa có sản phẩm</div>
                    </div>
                  )}
                </div>
              }
            >
              <Link to='/' className='relative'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-8 w-8'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                {purchasesInCart && purchasesInCart.length > 0 && (
                  <span className='absolute top-[-5px] left-[17px] rounded-full bg-white px-[9px] py-[1px] text-xs text-main '>
                    {purchasesInCart?.length}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}

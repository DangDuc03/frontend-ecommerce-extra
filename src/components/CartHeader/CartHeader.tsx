import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import useSearchProducts from 'src/hooks/useSearchProducts'
import NavHeader from '../NavHeader'

export default function CartHeader() {
  const { onSubmitSearch, register } = useSearchProducts()

  return (
    <div className='border-b border-b-black/10'>
      <div className='bg-gradient text-black'>
        <div className='container'>
          <NavHeader />
        </div>
      </div>
      <div className='bg-white py-6'>
        <div className='container'>
          <nav className='md:flex md:items-center md:justify-between'>
            <Link to={path.home} className='flex flex-shrink-0 items-center'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-button'>
                  <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M5 16L3 14l5.5-5.5L10 10l1.5-1.5L18 15l-2 2-5.5-5.5L9 13l-1.5 1.5L5 16z' />
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold bg-button bg-clip-text text-transparent'>Prime</h3>
              </div>
              <div className='mx-4 h-6 w-[1px] bg-button md:h-8' />
              <div className='capitalize text-main md:text-xl'>Giỏ hàng</div>
            </Link>
            <form className='mt-3 md:mt-0 md:w-[50%]' onSubmit={onSubmitSearch}>
              <div className='flex rounded-sm border-2 border-primary'>
                <input
                  type='text'
                  className='w-full flex-grow border-none bg-transparent px-3 py-2 text-black outline-none'
                  placeholder='Free Ship Đơn Từ 0Đ'
                  {...register('name')}
                />
                <button className='flex-shrink-0 bg-button py-2 px-8 hover:opacity-90'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5 stroke-white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                    />
                  </svg>
                </button>
              </div>
            </form>
          </nav>
        </div>
      </div>
    </div>
  )
}

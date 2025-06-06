export default function Footer() {
  return (
    <footer className='relative bg-gradient'>
      <div className='relative'>
        <div className='container mx-auto px-4 py-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-8'>
            <div className='lg:col-span-1'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='p-4 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600'>
                  <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M5 16L3 14l5.5-5.5L10 10l1.5-1.5L18 15l-2 2-5.5-5.5L9 13l-1.5 1.5L5 16z' />
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Prime
                </h3>
              </div>
              <p className='text-gray-600 text-sm leading-relaxed'>Chất lượng hàng đầu, dịch vụ tuyệt vời.</p>
            </div>

            <div>
              <h4 className='font-semibold text-gray-800 mb-3'>Liên kết nhanh</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    Sản phẩm
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    Khuyến mãi
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    Tin tức
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold text-gray-800 mb-3'>Hỗ trợ</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    Hướng dẫn mua hàng
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-blue-600 transition-colors'>
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold text-gray-800 mb-3'>Liên hệ</h4>
              <div className='space-y-2 text-sm text-gray-600'>
                <div className='flex items-start gap-2'>
                  <svg className='w-4 h-4 mt-0.5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span>123 Đường ABC, Q1, TP.HCM</span>
                </div>
                <div className='flex items-center gap-2'>
                  <svg className='w-4 h-4 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                  </svg>
                  <span>0123 456 789</span>
                </div>
                <div className='flex items-center gap-2'>
                  <svg className='w-4 h-4 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
                  <span>info@prime.vn</span>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-center gap-4 mb-6'>
            <a
              href='#'
              className='p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-110'
            >
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
              </svg>
            </a>
            <a
              href='#'
              className='p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-110'
            >
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' />
              </svg>
            </a>
            <a
              href='#'
              className='p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-110'
            >
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.233.085.359-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.915-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.744-1.378l-.628 2.43c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017.001z' />
              </svg>
            </a>
          </div>
        </div>

        <div className='border-t border-gray-200/50'>
          <div className='container mx-auto px-4 py-4'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-600'>
              <div className='flex items-center gap-2'>
                <span>© 2025 Prime Shop.</span>
                <span>Tất cả quyền được bảo lưu.</span>
              </div>
              <div className='flex gap-6'>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Chính sách bảo mật
                </a>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Điều khoản
                </a>
                <a href='#' className='hover:text-blue-600 transition-colors'>
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

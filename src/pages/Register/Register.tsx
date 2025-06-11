import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
// Không có tính năng tree-shaking
// import { omit } from 'lodash'

// Import chỉ mỗi function omit
import omit from 'lodash/omit'

import { schema, Schema } from 'src/utils/rules'
import Input from 'src/components/Input'
import authApi from 'src/apis/auth.api'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
import { Helmet } from 'react-helmet-async'
import path from 'src/constants/path'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
                type: 'Server'
              })
            })
          }
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-2'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-30'>
        <div className='w-full h-full bg-gradient-to-br from-blue-100/20 to-purple-100/20'></div>
      </div>
      <Helmet>
        <title>Đăng ký | Prime</title>
        <meta name='description' content='Đăng nhập vào Prime Shop' />
      </Helmet>
      <div className='relative w-full max-w-6xl mx-auto'>
        <div className='grid grid-cols-2 gap-16 items-center'>
          {/* Left Side - Branding & Features */}
          <div className='space-y-8'>
            <div className='space-y-6'>
              <div className='flex items-center space-x-3'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center'>
                  <svg className='w-6 h-6 text-white' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M5 16L3 14l5.5-5.5L10 10l1.5-1.5L18 15l-2 2-5.5-5.5L9 13l-1.5 1.5L5 16z' />
                    <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                  </svg>
                </div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Prime
                </h1>
              </div>

              <div className='space-y-4'>
                <h2 className='text-4xl font-bold text-gray-800 leading-tight'>Chào mừng bạn đến với Prime!</h2>
                <p className='text-lg text-gray-600 leading-relaxed'>
                  Trải nghiệm mua sắm cao cấp với dịch vụ Prime chất lượng hàng đầu
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4'>
                  <span className='text-2xl'>⚡</span>
                </div>
                <h3 className='font-semibold text-gray-800 mb-2'>Giao hàng siêu tốc</h3>
                <p className='text-sm text-gray-600'>Giao hàng trong 2 giờ với Prime Express</p>
              </div>

              <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20'>
                <div className='w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4'>
                  <span className='text-2xl'>👑</span>
                </div>
                <h3 className='font-semibold text-gray-800 mb-2'>Ưu đãi độc quyền</h3>
                <p className='text-sm text-gray-600'>Giảm giá đặc biệt chỉ dành cho Prime</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className='w-full max-w-md mx-auto'>
            <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12'>
              <div className='space-y-6'>
                <div className='text-center'>
                  <h2 className='text-3xl font-bold text-gray-800 mb-2'>Đăng Ký</h2>
                  <p className='text-gray-600'>Chào mừng bạn đến với Prime Shop</p>
                </div>

                <form action='' className='space-y-5' onSubmit={onSubmit} noValidate>
                  <div className=''>
                    <Input
                      name='email'
                      register={register}
                      type='email'
                      className='w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500'
                      errorMessage={errors.email?.message}
                      placeholder='your@email.com'
                      autoComplete='on'
                    />
                    <Input
                      name='password'
                      register={register}
                      type='password'
                      className='w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500'
                      errorMessage={errors.password?.message}
                      placeholder='••••••••'
                      autoComplete='on'
                    />
                    <Input
                      name='confirm_password'
                      register={register}
                      type='password'
                      className='w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500'
                      errorMessage={errors.confirm_password?.message}
                      placeholder='••••••••'
                      autoComplete='on'
                    />
                  </div>

                  {/* Submit Button */}
                  <div className='mt-1'>
                    <Button
                      type='submit'
                      className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform hover:translateY-[-1px] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2'
                      isLoading={registerAccountMutation.isPending}
                      disabled={registerAccountMutation.isPending}
                    >
                      Đăng ký
                    </Button>
                  </div>
                </form>

                {/* Divider */}
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-200'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-4 bg-white text-gray-500'>hoặc</span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className='text-center'>
                  <span className='text-gray-600'>Bạn đã có tài khoản?</span>
                  <Link
                    to={path.login}
                    className='ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors'
                  >
                    Tài khoản
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

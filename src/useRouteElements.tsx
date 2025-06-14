import path from 'src/constants/path'
import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './contexts/app.context'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
// import Login from './pages/Login'
// import ProductList from './pages/ProductList'
// import Profile from './pages/User/pages/Profile'
// import Register from './pages/Register'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
import AdminLayout from './pages/Admin/layouts/AdminLayout'
import AdminGuard from './components/Guards/AdminGuard'
import Orders from './pages/Admin/Orders'
// import ChangePassword from './pages/User/pages/ChangePassword'
// import HistoryPurchase from './pages/User/pages/HistoryPurchase'
// import NotFound from './pages/NotFound'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Admin Pages
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/Admin/Products'))
const AdminCategories = lazy(() => import('./pages/Admin/Categories'))
const AdminUsers = lazy(() => import('./pages/Admin/Users'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  console.log('useRouteElements Mountted')
  const routeElements = useRoutes([
    {
      path: path.admin.root,
      element: (
        <AdminGuard>
          <Suspense>
            <AdminLayout />
          </Suspense>
        </AdminGuard>
      ),
      children: [
        {
          path: '',
          element: <Dashboard />
        },
        {
          path: path.admin.products,
          element: <AdminProducts />
        },
        {
          path: path.admin.categories,
          element: <AdminCategories />
        },
        {
          path:  path.admin.users,
          element: <AdminUsers />
        },
        {
          path: path.admin.orders,
          element: <Orders />
        },
        {
          path: path.admin.reports,
          element: <Dashboard />
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.user,
          element: <MainLayout />,
          children: [
            {
              path: '',
              element: <UserLayout />,
              children: [
                {
                  path: path.profile,
                  element: (
                    <Suspense>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.changePassword,
                  element: (
                    <Suspense>
                      <ChangePassword />
                    </Suspense>
                  )
                },
                {
                  path: path.historyPurchase,
                  element: (
                    <Suspense>
                      <HistoryPurchase />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: '',
          index: true,
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
        {
          path: '*',
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          )
        }
      ]
    }

    // },
    // {
    //   path: path.productDetail,
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <ProductDetail />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // },
    // {
    //   path: '',
    //   index: true,
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <ProductList />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // },
    // {
    //   path: '*',
    //   element: (
    //     <MainLayout>
    //       <Suspense>
    //         <NotFound />
    //       </Suspense>
    //     </MainLayout>
    //   )
    // }
  ])
  return routeElements
}

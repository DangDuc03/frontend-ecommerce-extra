const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  admin: {
    root: '/admin',
    dashboard: '/admin',
    products: '/admin/products',
    categories: '/admin/categories',
    users: '/admin/users',
    reports: '/admin/reports'
  }
} as const

export default path

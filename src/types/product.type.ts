export interface Product {
  _id: string
  name: string
  description: string
  price: number
  price_before_discount: number
  quantity: number
  sold: number
  category: {
    _id: string
    name: string
  }
  image: string
  images: string[]
  status: 'active' | 'draft' | 'archived'
  rating: number
  view: number
  createdAt: string
  updatedAt: string
}

export interface ProductList {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export interface ProductListConfig {
  page?: number
  limit?: number
  sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  category?: string
  exclude?: string
  rating_filter?: number
  price_max?: number
  price_min?: number
  name?: string
  status?: 'active' | 'draft' | 'archived'
}

export interface ProductListResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
    total: number
  }
}

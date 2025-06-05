import { Product } from "./product.type"

export interface Category {
  _id: string
  name: string
  products: Product[]
}

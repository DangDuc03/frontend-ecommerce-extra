export interface SuggestedProduct {
  name: string
  price: number
  productId: string
  url: string
}

export interface Message {
  id: string
  content: string
  reply?: string
  sender: 'user' | 'bot'
  timestamp: Date
  typing?: boolean
  orders?: OrderInfo[]
  suggestedProducts?: SuggestedProduct[]
}

export interface OrderInfo {
  product_id?: string
  name: string
  image: string
  price: number
  quantity: number
  status: string
  product_url: string
}

export interface ChatbotProps {
  onSendMessage?: (message: string) => Promise<string>
  brandName?: string
  primaryColor?: string
}

export interface ChatbotApiResponse {
  reply: string
  orders?: OrderInfo[]
  intent?: string
  suggestedProducts?: SuggestedProduct[]
}

export interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  typing?: boolean
  orders?: OrderInfo[]
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
}
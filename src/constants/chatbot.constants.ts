import { Message } from '../@types/chatbot.types'

export const DEFAULT_MESSAGES: Message[] = [
  {
    id: '1',
    content: `Xin chào! Tôi là trợ lý AI của Ecommerce. Tôi có thể giúp bạn tìm sản phẩm, trả lời câu hỏi về đơn hàng, hoặc hỗ trợ mua sắm. Bạn cần hỗ trợ gì hôm nay?`,
    sender: 'bot',
    timestamp: new Date()
  }
]

export const QUICK_ACTIONS = [
  'Tìm sản phẩm hot nhất',
  'Kiểm tra đơn hàng',
  'Chính sách đổi trả',
  'Thông tin khuyến mãi'
]

export const CHATBOT_CONFIG = {
  DEFAULT_BRAND_NAME: 'Ecommerce',
  DEFAULT_PRIMARY_COLOR: '#2ec4b6',
  TYPING_DELAY: 1000,
  MESSAGE_MAX_WIDTH: '75%'
}

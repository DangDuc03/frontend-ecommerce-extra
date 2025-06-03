import React from 'react'
import { Bot, X } from 'lucide-react'
import { generateGradientStyle } from '../../utils/chatbot.utils'

interface ChatHeaderProps {
  brandName: string
  primaryColor: string
  onClose: () => void
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ brandName, primaryColor, onClose }) => {
  return (
    <div
      className='bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between'
      style={generateGradientStyle(primaryColor)}
    >
      <div className='flex items-center space-x-3'>
        <div className='bg-white/20 rounded-full p-2'>
          <Bot size={20} />
        </div>
        <div>
          <h3 className='font-semibold text-lg'>{brandName} Hà Tĩnh</h3>
          <p className='text-sm opacity-90'>Trợ lý mua sắm thông minh</p>
        </div>
      </div>
      <button onClick={onClose} className='hover:bg-white/20 rounded-full p-2 transition-colors'>
        <X size={20} />
      </button>
    </div>
  )
}

export default ChatHeader

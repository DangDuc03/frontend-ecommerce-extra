import React from 'react'
import { MessageCircle, Sparkles } from 'lucide-react'

interface ChatToggleButtonProps {
  onClick: () => void
  primaryColor: string
}

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ onClick, primaryColor }) => {
  return (
    <button
      onClick={onClick}
      className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse'
      style={{ backgroundColor: primaryColor }}
    >
      <MessageCircle size={24} />
      <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce'>
        <Sparkles size={12} />
      </div>
    </button>
  )
}

export default ChatToggleButton

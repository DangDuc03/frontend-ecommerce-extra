import React from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  inputValue: string
  setInputValue: (value: string) => void
  onSendMessage: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  isTyping: boolean
  primaryColor: string
  brandName: string
  inputRef: React.RefObject<HTMLInputElement>
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSendMessage,
  onKeyPress,
  isTyping,
  primaryColor,
  brandName,
  inputRef
}) => {
  return (
    <div className='p-4 border-t border-gray-200 bg-white'>
      <div className='flex space-x-2'>
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder='Nhập tin nhắn của bạn...'
          className='flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
        />
        <button
          onClick={onSendMessage}
          disabled={!inputValue.trim() || isTyping}
          className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full p-3 transition-colors'
          style={{ backgroundColor: inputValue.trim() && !isTyping ? primaryColor : undefined }}
        >
          <Send size={16} />
        </button>
      </div>
      <p className='text-xs text-gray-500 mt-2 text-center'>Support by AI • {brandName}</p>
    </div>
  )
}

export default ChatInput

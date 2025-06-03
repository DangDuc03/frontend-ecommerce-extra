import React from 'react'
import { Bot } from 'lucide-react'

const TypingIndicator: React.FC = () => {
  return (
    <div className='flex justify-start'>
      <div className='flex items-start space-x-2'>
        <div className='rounded-full p-2 bg-purple-500'>
          <Bot size={16} className='text-white' />
        </div>
        <div className='bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 shadow-sm'>
          <div className='flex space-x-1'>
            <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
            <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.1s' }}></div>
            <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator

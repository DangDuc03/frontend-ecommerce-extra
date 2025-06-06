import React from 'react'
import { Bot, User } from 'lucide-react'
import { Message } from '../../@types/chatbot.types'
import { formatTime } from '../../utils/chatbot.utils'
import OrderCard from './OrderCard'
import { Link } from 'react-router-dom'

interface MessageBubbleProps {
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  console.log('message: ', message)
  // Nếu là bot và có orders
  if (message.sender === 'bot' && message.orders) {
    return (
      <div key={message.id} className='flex justify-start'>
        <div className='flex flex-col gap-2 w-full'>
          <div className='flex items-start space-x-2'>
            <div className='rounded-full p-2 bg-purple-500'>
              <Bot size={16} className='text-white' />
            </div>
            <div className='bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 shadow-sm w-full'>
              <p className='text-sm mb-2'>{message.content}</p>
              {message.orders.map((order, idx) => (
                <OrderCard key={order.product_id || idx} order={order} index={idx} />
              ))}
            </div>
          </div>
          <p className='text-xs mt-1 text-gray-500'>{formatTime(message.timestamp)}</p>
        </div>
      </div>
    )
  }

  // Nếu là bot và có suggestedProducts
  if (message.sender === 'bot' && message.suggestedProducts && message.suggestedProducts.length > 0) {
    return (
      <div className='flex justify-start'>
        <div className='flex flex-col gap-2 w-full'>
          <div className='flex items-start space-x-2'>
            <div className='rounded-full p-2 bg-purple-500'>
              <Bot size={16} className='text-white' />
            </div>
            <div className='bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200 shadow-sm w-full'>
              <p className='text-sm mb-2'>{message.content}</p>
              <ul className='space-y-2'>
                {message.suggestedProducts.map((p, idx) => (
                  <li key={p.productId}>
                    <Link to={p.url} className='text-blue-600 hover:underline font-medium'>
                      {idx + 1}. {p.name} ({p.price.toLocaleString()}đ)
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className='text-xs mt-1 text-gray-500'>{formatTime(message.timestamp)}</p>
        </div>
      </div>
    )
  }

  // Message thông thường
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex items-start space-x-2 max-w-[75%] ${
          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
        }`}
      >
        <div className={`rounded-full p-2 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-purple-500'}`}>
          {message.sender === 'user' ? (
            <User size={16} className='text-white' />
          ) : (
            <Bot size={16} className='text-white' />
          )}
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.sender === 'user'
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
          }`}
        >
          <p className='text-sm leading-relaxed'>{message.content}</p>
          <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble

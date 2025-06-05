import React from 'react'
import { Message } from '../../@types/chatbot.types'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import QuickActions from './QuickActions'

interface ChatMessagesProps {
  messages: Message[]
  isTyping: boolean
  onQuickAction: (action: string) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping, onQuickAction, messagesEndRef }) => {
  return (
    <div  className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && <TypingIndicator />}

      {messages.length === 1 && <QuickActions onActionClick={onQuickAction} />}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages

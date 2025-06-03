import React from 'react'
import { ChatbotProps } from '../../@types/chatbot.types'
import { CHATBOT_CONFIG } from '../../constants/chatbot.constants'
import { useChatbot } from '../../hooks/useChatbot'
import ChatToggleButton from './ChatToggleButton'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

const Chatbot: React.FC<ChatbotProps> = ({
  brandName = CHATBOT_CONFIG.DEFAULT_BRAND_NAME,
  primaryColor = CHATBOT_CONFIG.DEFAULT_PRIMARY_COLOR
}) => {
  const {
    isOpen,
    setIsOpen,
    messages,
    inputValue,
    setInputValue,
    isTyping,
    messagesEndRef,
    inputRef,
    handleSendMessage,
    handleKeyPress,
    handleQuickAction
  } = useChatbot()

  return (
    <div className='fixed bottom-6 right-6 z-50'>
      {/* Chat Toggle Button */}
      {!isOpen && <ChatToggleButton onClick={() => setIsOpen(true)} primaryColor={primaryColor} />}

      {/* Chat Window */}
      {isOpen && (
        <div className='bg-white rounded-2xl shadow-2xl w-80 h-[500px] flex flex-col overflow-hidden border border-gray-200'>
          <ChatHeader brandName={brandName} primaryColor={primaryColor} onClose={() => setIsOpen(false)} />

          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            onQuickAction={handleQuickAction}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            isTyping={isTyping}
            primaryColor={primaryColor}
            brandName={brandName}
            inputRef={inputRef}
          />
        </div>
      )}
    </div>
  )
}

export default Chatbot

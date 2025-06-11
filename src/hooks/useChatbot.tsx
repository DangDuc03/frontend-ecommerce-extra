import { useState, useRef, useEffect, useContext } from 'react'
import { Message, ChatbotApiResponse } from '../@types/chatbot.types'
import { DEFAULT_MESSAGES } from '../constants/chatbot.constants'
import chatbotApi from '../apis/chatbot.api'
import { AppContext } from '../contexts/app.context'
import { LocalStorageEventTarget } from '../utils/auth'
import { useQueryClient } from '@tanstack/react-query'
import { purchasesStatus } from 'src/constants/purchase'
import userApi from '../apis/user.api'

export const useChatbot = () => {
  const { profile, setProfile } = useContext(AppContext)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(DEFAULT_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset messages khi logout
  useEffect(() => {
    const handleClearLS = () => {
      setMessages(DEFAULT_MESSAGES)
    }
    LocalStorageEventTarget.addEventListener('clearLS', handleClearLS)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', handleClearLS)
    }
  }, [])

  // Lấy lịch sử chat khi mở chatbox hoặc đổi tài khoản
  useEffect(() => {
    if (isOpen && profile) {
      chatbotApi
        .getHistory()
        .then((res: { data: { history: any[] } }) => {
          setMessages(
            res.data.history.length
              ? res.data.history.map((msg: any) => ({
                  ...msg,
                  sender: msg.role === 'user' ? 'user' : 'bot',
                  timestamp: new Date(msg.timestamp)
                }))
              : DEFAULT_MESSAGES
          )
        })
        .catch(() => {
          setMessages(DEFAULT_MESSAGES)
        })
    }
  }, [isOpen, profile])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      let botResponse = 'Cảm ơn bạn đã liên hệ! Tôi đang xử lý yêu cầu của bạn...'

      const res = (await chatbotApi.sendMessage({ prompt: inputValue })) as { data: ChatbotApiResponse & { profile?: any } }
      botResponse = res.data.reply || botResponse
      const intent = res.data.intent

      // Nếu intent là update_profile và có profile mới, cập nhật lại AppContext
      if (intent === 'update_profile') {
        if (res.data.profile) {
          setProfile(res.data.profile)
        } else {
          // Nếu không có profile trả về, gọi lại API lấy profile
          userApi.getProfile().then((resp) => {
            setProfile(resp.data.data)
          })
        }
      }

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(),
          ...(res.data.orders ? { orders: res.data.orders } : {}),
          ...(res.data.suggestedProducts ? { suggestedProducts: res.data.suggestedProducts } : {})
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
        if (intent === 'add_to_cart' || intent === 'order') {
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
        if (intent === 'order') {
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.waitForConfirmation }] })
        }
      }, 1000)
    } catch (error: any) {
      // Tin nhắn của người dùng đã được thêm vào ở trên một cách lạc quan.
      // Tuy nhiên, để đảm bảo tính toàn vẹn trong trường hợp re-render,
      // chúng ta sẽ cập nhật lại state với cả tin nhắn người dùng và tin nhắn lỗi của bot.
      
      const botErrorMessageContent =
        error?.response?.data?.reply ||
        error?.response?.data?.message ||
        'Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.';

      const botErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botErrorMessageContent,
        sender: 'bot',
        timestamp: new Date()
      };

      // Thay vì chỉ thêm tin nhắn lỗi, ta đảm bảo cả tin nhắn người dùng cũng được giữ lại.
      // Cách tiếp cận an toàn nhất là xóa tin nhắn lạc quan của người dùng (nếu có) và thêm lại cả hai.
      setMessages((prev) => {
        const optimisticMessageIndex = prev.findIndex(m => m.id === userMessage.id);
        const baseMessages = optimisticMessageIndex > -1 ? prev.slice(0, optimisticMessageIndex) : prev;
        return [...baseMessages, userMessage, botErrorMessage];
      });
      
      setIsTyping(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    setTimeout(() => {
      handleSendMessage()
    }, 0)
  }

  return {
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
  }
}

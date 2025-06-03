import { useState, useRef, useEffect, useContext } from 'react'
import { Message, ChatbotApiResponse } from '../@types/chatbot.types'
import { DEFAULT_MESSAGES } from '../constants/chatbot.constants'
import chatbotApi from '../apis/chatbot.api'
import { AppContext } from '../contexts/app.context'
import { LocalStorageEventTarget } from '../utils/auth'
import { useQueryClient } from '@tanstack/react-query'
import { purchasesStatus } from 'src/constants/purchase'

export const useChatbot = () => {
  const { profile } = useContext(AppContext)
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

      const res = (await chatbotApi.sendMessage({ prompt: inputValue })) as { data: ChatbotApiResponse }
      botResponse = res.data.reply || botResponse
      const intent = res.data.intent

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(),
          ...(res.data.orders ? { orders: res.data.orders } : {})
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
      if (error?.response?.status === 503) {
        setTimeout(() => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: 'Hệ thống AI đang quá tải, vui lòng thử lại sau.',
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages((prev) => [...prev, errorMessage])
          setIsTyping(false)
        }, 1000)
      } else {
        setTimeout(() => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content:
              error?.response?.status === 401
                ? 'Bạn cần đăng nhập để sử dụng chatbot.'
                : 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages((prev) => [...prev, errorMessage])
          setIsTyping(false)
        }, 1000)
      }
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

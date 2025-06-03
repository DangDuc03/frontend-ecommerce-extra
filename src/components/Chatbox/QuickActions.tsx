import React from 'react'
import { ShoppingBag } from 'lucide-react'
import { QUICK_ACTIONS } from '../../constants/chatbot.constants'

interface QuickActionsProps {
  onActionClick: (action: string) => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <div className='space-y-2'>
      <p className='text-sm text-gray-600 font-medium'>Câu hỏi thường gặp:</p>
      <div className='grid grid-cols-1 gap-2'>
        {QUICK_ACTIONS.map((action, index) => (
          <button
            key={index}
            onClick={() => onActionClick(action)}
            className='text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm'
          >
            <ShoppingBag size={16} className='inline mr-2 text-blue-500' />
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions

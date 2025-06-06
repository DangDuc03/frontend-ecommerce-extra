export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const generateGradientStyle = (primaryColor: string) => ({
  background: `linear-gradient(135deg, ${primaryColor}, #8B5CF6)`
})

import http from 'src/utils/http'

export const URL_CHATBOT = '/chatbot'

const chatbotApi = {
  sendMessage(body: { prompt: string }) {
    return http.post(URL_CHATBOT, body)
  },
  getHistory() {
    return http.get(URL_CHATBOT + '/history')
  }
}

export default chatbotApi

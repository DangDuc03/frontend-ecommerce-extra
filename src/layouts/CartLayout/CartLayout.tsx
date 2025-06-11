import CartHeader from 'src/components/CartHeader'
import Chatbot from 'src/components/Chatbox/Chatbot'
import Footer from 'src/components/Footer'
interface Props {
  children?: React.ReactNode
}
export default function CartLayout({ children }: Props) {
  return (
    <div>
      <CartHeader />
      {children}
      <Chatbot />
      <Footer />
    </div>
  )
}

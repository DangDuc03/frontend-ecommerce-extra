import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Chatbot from 'src/components/Chatbox/Chatbot'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
interface Props {
  children?: React.ReactNode
}
function MainLayoutInner({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <Outlet />
      <Chatbot />
      <Footer />
    </div>
  )
}
const MainLayout = memo(MainLayoutInner)
export default MainLayout

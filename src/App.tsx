import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useContext } from 'react'
import { LocalStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ErrorBoundary from './components/ErrorBoundary'
import { HelmetProvider } from 'react-helmet-async'
import Chatbot from './components/Chatbox/Chatbot'
import useOnlineStatus from './hooks/useOnlineStatus'

/**
 * Khi url thay đổi thì các component nào dùng các hook như
 * useRoutes, useParmas, useSearchParams,...
 * sẽ bị re-render.
 * Ví dụ component `App` dưới đây bị re-render khi mà url thay đổi
 * vì dùng `useRouteElements` (đây là customhook của `useRoutes`)
 */

function App() {
  const routeElements = useRouteElements()
  // Sử dụng hook để theo dõi trạng thái online
  useOnlineStatus()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <HelmetProvider>
      <ErrorBoundary>
        {routeElements}
        <ToastContainer />
        <Chatbot />
      </ErrorBoundary>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </HelmetProvider>
  )
}

export default App

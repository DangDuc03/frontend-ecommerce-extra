import { useEffect, useContext, useRef } from 'react'
import { AppContext } from 'src/contexts/app.context'
import userApi from 'src/apis/user.api'
import throttle from 'lodash/throttle'

const INACTIVE_TIMEOUT = 5 * 60 * 1000 // 5 phút
const THROTTLE_TIME = 30 * 1000 // 30 giây

export default function useOnlineStatus() {
  const { profile } = useContext(AppContext)
  const isOnlineRef = useRef(false)
  const profileRef = useRef(profile) // Lưu reference để sử dụng trong cleanup

  // Cập nhật profileRef khi profile thay đổi
  useEffect(() => {
    profileRef.current = profile
  }, [profile])

  // Expose method để force offline từ bên ngoài
  const forceOffline = async () => {
    if (!profile?._id) return

    try {
      await userApi.updateStatus(profile._id, {
        isOnline: false,
        lastActive: new Date().toISOString()
      })
      isOnlineRef.current = false
      console.log('Forced offline status update')
    } catch (error) {
      console.error('Failed to force offline status:', error)
    }
  }

  useEffect(() => {
    if (!profile?._id) return

    let lastActivity = Date.now()
    let timeoutId: NodeJS.Timeout

    // Throttle API call với error handling
    const throttledUpdateOnline = throttle(
      async () => {
        try {
          await userApi.updateStatus(profile._id, {
            isOnline: true,
            lastActive: new Date().toISOString()
          })
          isOnlineRef.current = true
          console.log('Online status updated via throttle')
        } catch (error) {
          console.error('Failed to update online status:', error)
        }
      },
      THROTTLE_TIME,
      { leading: true, trailing: false }
    )

    // Cập nhật trạng thái offline
    const updateOfflineStatus = async () => {
      try {
        // Cancel pending throttled calls khi chuyển offline
        throttledUpdateOnline.cancel()

        // Sử dụng profileRef thay vì profile để tránh stale closure
        const currentProfile = profileRef.current
        if (!currentProfile?._id) return

        await userApi.updateStatus(currentProfile._id, {
          isOnline: false,
          lastActive: new Date().toISOString()
        })
        isOnlineRef.current = false
        console.log('Status updated to offline')
      } catch (error) {
        console.error('Failed to update offline status:', error)
      }
    }

    // Kiểm tra hoạt động của user
    const checkActivity = () => {
      const now = Date.now()
      if (now - lastActivity > INACTIVE_TIMEOUT) {
        updateOfflineStatus()
      }
    }

    // Theo dõi các sự kiện người dùng
    const handleUserActivity = () => {
      lastActivity = Date.now()
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkActivity, INACTIVE_TIMEOUT)

      // Chỉ gọi throttled function nếu chưa online hoặc cần refresh
      throttledUpdateOnline()
    }

    // Giảm số lượng events để tối ưu performance
    const events = ['mousedown', 'keydown', 'click', 'touchstart']
    // Riêng scroll và mousemove dùng throttle khác với thời gian ngắn hơn
    const highFrequencyEvents = ['mousemove', 'scroll']

    // Event listeners cho các action chính
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true })
    })

    // Throttle riêng cho scroll/mousemove với thời gian ngắn hơn
    const throttledActivityForHighFreq = throttle(() => {
      lastActivity = Date.now()
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkActivity, INACTIVE_TIMEOUT)
      // Không gọi API cho high frequency events, chỉ update lastActivity
    }, 1000) // 1 giây cho scroll/mousemove

    highFrequencyEvents.forEach((event) => {
      window.addEventListener(event, throttledActivityForHighFreq, { passive: true })
    })

    // Xử lý khi user rời trang
    const handleBeforeUnload = () => {
      // Cancel throttled function trước khi offline
      throttledUpdateOnline.cancel()

      // Sử dụng sendBeacon nếu có thể
      if (navigator.sendBeacon && isOnlineRef.current && profileRef.current?._id) {
        const data = JSON.stringify({
          isOnline: false,
          lastActive: new Date().toISOString()
        })
        navigator.sendBeacon(`/api/users/${profileRef.current._id}/status`, data)
      }
      // Không fallback to sync request vì có thể không có token
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // Xử lý visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab bị ẩn - có thể cancel throttled calls để tiết kiệm
        throttledUpdateOnline.cancel()
      } else {
        // Tab được focus lại - cập nhật activity
        handleUserActivity()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cập nhật trạng thái online khi component mount
    handleUserActivity()

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity)
      })
      highFrequencyEvents.forEach((event) => {
        window.removeEventListener(event, throttledActivityForHighFreq)
      })
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      clearTimeout(timeoutId)
      throttledUpdateOnline.cancel()
      throttledActivityForHighFreq.cancel()

      // KHÔNG gọi updateOfflineStatus trong cleanup
      // Vì khi logout, profile đã bị clear và không có token
      // Thay vào đó, sẽ handle offline trong logout function
    }
  }, [profile?._id])

  // Return forceOffline để sử dụng khi logout
  return { forceOffline }
}

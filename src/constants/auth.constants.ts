// Mã xác thực để xóa tài khoản Admin - Chỉ những người được cấp quyền mới biết mã này
export const ADMIN_DELETE_VERIFICATION_CODE = 'ADMIN_2025_DELETE'

export const AUTH_MESSAGES = {
  ADMIN_DELETE_CONFIRM: 'Bạn đang thực hiện xóa một tài khoản Admin. Hành động này yêu cầu mã xác thực đặc biệt và không thể hoàn tác.',
  ADMIN_DELETE_TITLE: 'Xác nhận xóa tài khoản Admin',
  USER_DELETE_CONFIRM: 'Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.',
  USER_DELETE_TITLE: 'Xác nhận xóa người dùng',
  ADMIN_DELETE_CODE_ERROR: 'Mã xác thực không đúng. Vui lòng kiểm tra lại.',
  ADMIN_DELETE_SUCCESS: 'Xóa tài khoản Admin thành công',
  USER_DELETE_SUCCESS: 'Xóa người dùng thành công'
} as const 
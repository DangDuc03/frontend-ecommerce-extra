type Role = 'User' | 'Admin'

export interface User {
  _id: string
  roles: Role[]
  email: string
  name?: string
  date_of_birth?: string // ISO 8610
  avatar?: string
  address?: string
  phone?: string
  createdAt: string
  updatedAt: string
  lastActive?: string
  isOnline?: boolean
}

export interface CreateUserDto extends Omit<User, '_id' | 'createdAt' | 'updatedAt'> {
  password: string
}

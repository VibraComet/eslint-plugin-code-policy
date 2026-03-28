import type { User } from '../types/User'

export function formatUserName(user: User) {
  return `${user.firstName} ${user.lastName}`
}

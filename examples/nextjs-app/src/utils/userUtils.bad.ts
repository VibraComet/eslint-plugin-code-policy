/* eslint-disable code-policy/atomic-file */

// BAD EXAMPLE: Multiple functions in one file violates atomic-file rule.
// Remove the eslint-disable comment above to see the error.

import type { User } from '../types/User'

export function formatUserName(user: User) {
  return `${user.firstName} ${user.lastName}`
}

export function getUserAge(user: User) {
  return new Date().getFullYear() - user.birthYear
}

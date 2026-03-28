/* eslint-disable code-policy/view-logic-separation */

// BAD EXAMPLE: State, effects, and inline handlers inside a view component.
// Remove the eslint-disable comment above to see the errors.

import { useState, useEffect } from 'react'
import type { User } from '../types/User'
import type { UserCardProps } from '../types/UserCardProps'

export function UserCardBad({ userId }: UserCardProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Simulate fetch
    setUser({
      id: userId,
      firstName: 'Jane',
      lastName: 'Doe',
      birthYear: 1990,
    })
  }, [userId])

  const handleDelete = () => {
    console.log('Deleting user', userId)
  }

  return (
    <div>
      <h2>{user?.firstName}</h2>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

import type { User } from '../types/User'

export function useUserCard(userId: string) {
  // In a real app, this would use useState + useEffect
  const user: User = {
    id: userId,
    firstName: 'Jane',
    lastName: 'Doe',
    birthYear: 1990,
  }

  const handleDelete = () => {
    console.log('Deleting user', userId)
  }

  return { user, handleDelete }
}

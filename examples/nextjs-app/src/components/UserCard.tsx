import { useUserCard } from '../hooks/useUserCard'
import { formatUserName } from '../utils/formatUserName'
import type { UserCardProps } from '../types/UserCardProps'

export function UserCard({ userId }: UserCardProps) {
  const { user, handleDelete } = useUserCard(userId)

  return (
    <div>
      <h2>{formatUserName(user)}</h2>
      <button onClick={handleDelete}>Delete</button>
    </div>
  )
}

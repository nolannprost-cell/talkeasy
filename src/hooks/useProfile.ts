import { useCallback, useEffect, useState } from 'react'
import type { UserProfile } from '../types'
import { createProfile, loadProfile, saveProfile } from '../services/storage'

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setProfile(loadProfile())
    setLoading(false)
  }, [])

  const setup = useCallback((input: Pick<UserProfile, 'name' | 'level' | 'interests' | 'goals'>) => {
    const created = createProfile(input)
    setProfile(created)
    return created
  }, [])

  const update = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      saveProfile(next)
      return next
    })
  }, [])

  return { profile, loading, setup, update }
}

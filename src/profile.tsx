import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface ProfileScore {
  name?: string
  total: number
  games: number
  skills: number
  facilGames?: number
  facilSkills?: number
  base?: number
  mbonus?: number
  tierIdx?: number
  seasonUnknown?: number
  unknownList?: any[]
  gameList?: any[]
  skillList?: any[]
  seasonBadges?: any[]
  syncedAt?: number
}

export interface ProfileContextType {
  profileUrl: string
  score: ProfileScore | null
  memberId: string | null
  guild: string
  loading: boolean
  err: string
  setErr: (err: string) => void
  fetchScore: (url: string, guildArg?: string) => Promise<any>
  clear: () => void
  leave: () => Promise<void>
  canLeave: boolean
}

function useLocal<T>(key: string, initial: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? JSON.parse(s) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch {
      /* ignore */
    }
  }, [key, val])
  return [val, setVal]
}

const Ctx = createContext<ProfileContextType | null>(null)

export function useMyProfile(): ProfileContextType {
  const context = useContext(Ctx)
  if (!context) {
    throw new Error('useMyProfile must be used within a ProfileProvider')
  }
  return context
}

export interface ProfileProviderProps {
  children?: React.ReactNode
}

// Satu sumber kebenaran untuk "profil saya": dipakai Poin Saya, Hadiah (tier), dan Leaderboard (prefill).
export function ProfileProvider({ children }: ProfileProviderProps): React.JSX.Element {
  const [profileUrl, setProfileUrl] = useLocal<string>('gcaf2026_my_profile', '')
  const [score, setScore] = useLocal<ProfileScore | null>('gcaf2026_my_score', null)
  const [memberId, setMemberId] = useLocal<string | null>('gcaf2026_member_id', null)
  const [guild, setGuild] = useLocal<string>('gcaf2026_my_guild', '')
  const [removeToken, setRemoveToken] = useLocal<string | null>('gcaf2026_remove_token', null)
  const [loading, setLoading] = useState<boolean>(false)
  const [err, setErr] = useState<string>('')

  // Hitung poin + otomatis daftarkan/perbarui ke leaderboard (via /api/join).
  // Satu langkah: masuk profil di Poin Saya = otomatis tampil di Leaderboard.
  // guildArg (opsional) menang atas ?guild= di URL dan guild tersimpan; backend COALESCE jaga guild lama kalau kosong.
  const fetchScore = useCallback(
    async (url: string, guildArg?: string) => {
      setLoading(true)
      setErr('')
      try {
        let urlGuild = ''
        try {
          urlGuild = new URLSearchParams(window.location.search).get('guild') || ''
        } catch {
          /* ignore */
        }
        const code = (guildArg ?? '').trim() || urlGuild || guild || ''
        const r = await fetch('/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileUrl: url, name: '', code }),
        })
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || 'Gagal menghitung')
        const m = j.member || {}
        setScore({
          name: m.name,
          total: m.total,
          games: m.games,
          skills: m.skills,
          facilGames: m.facilGames || 0,
          facilSkills: m.facilSkills || 0,
          base: m.base,
          mbonus: m.mbonus,
          tierIdx: m.tierIdx,
          seasonUnknown: m.seasonUnknown || 0,
          unknownList: m.unknownList || [],
          gameList: m.gameList || [],
          skillList: m.skillList || [],
          seasonBadges: m.seasonBadges || [],
          syncedAt: Date.now(),
        })
        setProfileUrl(m.profileUrl || url)
        if (j.id) setMemberId(j.id)
        if (j.removeToken) setRemoveToken(j.removeToken) // hanya ada saat join pertama
        if (code) setGuild(code)
        return j
      } catch (e: any) {
        setErr(e.message)
        throw e
      } finally {
        setLoading(false)
      }
    },
    [setScore, setProfileUrl, setMemberId, setGuild, setRemoveToken, guild],
  )

  const clear = useCallback(() => {
    setScore(null)
    setProfileUrl('')
    setMemberId(null)
    setGuild('')
    setRemoveToken(null)
  }, [setScore, setProfileUrl, setMemberId, setGuild, setRemoveToken])

  // Keluar dari leaderboard: hapus entri publik (butuh token kepemilikan), lalu bersihkan state lokal.
  const leave = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      if (memberId && removeToken) {
        const r = await fetch('/api/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: memberId, token: removeToken }),
        })
        const j = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(j.error || 'Gagal keluar dari leaderboard.')
      }
      clear()
    } catch (e: any) {
      setErr(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [memberId, removeToken, clear])

  // auto-refresh sekali saat load kalau profil sudah tersimpan
  useEffect(() => {
    if (profileUrl) fetchScore(profileUrl).catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Ctx.Provider
      value={{
        profileUrl,
        score,
        memberId,
        guild,
        loading,
        err,
        setErr,
        fetchScore,
        clear,
        leave,
        canLeave: Boolean(memberId && removeToken),
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

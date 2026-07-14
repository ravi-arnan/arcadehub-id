import { createContext, useContext, useEffect, useState, useCallback } from 'react'

function useLocal(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* ignore */ } }, [key, val])
  return [val, setVal]
}

const Ctx = createContext(null)
export function useMyProfile() { return useContext(Ctx) }

// Satu sumber kebenaran untuk "profil saya": dipakai Poin Saya, Hadiah (tier), dan Leaderboard (prefill).
export function ProfileProvider({ children }) {
  const [profileUrl, setProfileUrl] = useLocal('gcaf2026_my_profile', '')
  const [score, setScore] = useLocal('gcaf2026_my_score', null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const fetchScore = useCallback(async (url) => {
    setLoading(true); setErr('')
    try {
      const r = await fetch('/api/score?url=' + encodeURIComponent(url))
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Gagal menghitung')
      setScore({
        name: j.name, total: j.total, games: j.games, skills: j.skills,
        facilGames: j.facilGames || 0, facilSkills: j.facilSkills || 0,
        base: j.base, mbonus: j.mbonus, tierIdx: j.tierIdx,
        gameList: j.gameList || [], skillList: j.skillList || [], seasonBadges: j.seasonBadges || [], syncedAt: Date.now(),
      })
      setProfileUrl(url)
      return j
    } catch (e) { setErr(e.message); throw e } finally { setLoading(false) }
  }, [setScore, setProfileUrl])

  const clear = useCallback(() => { setScore(null); setProfileUrl('') }, [setScore, setProfileUrl])

  // auto-refresh sekali saat load kalau profil sudah tersimpan
  useEffect(() => { if (profileUrl) fetchScore(profileUrl).catch(() => {}) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Ctx.Provider value={{ profileUrl, score, loading, err, setErr, fetchScore, clear }}>
      {children}
    </Ctx.Provider>
  )
}

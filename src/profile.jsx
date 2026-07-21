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
  const [memberId, setMemberId] = useLocal('gcaf2026_member_id', null)
  const [guild, setGuild] = useLocal('gcaf2026_my_guild', '')
  const [removeToken, setRemoveToken] = useLocal('gcaf2026_remove_token', null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  // Hitung poin + otomatis daftarkan/perbarui ke leaderboard (via /api/join).
  // Satu langkah: masuk profil di Poin Saya = otomatis tampil di Leaderboard.
  // guildArg (opsional) menang atas ?guild= di URL dan guild tersimpan; backend COALESCE jaga guild lama kalau kosong.
  const fetchScore = useCallback(async (url, guildArg) => {
    setLoading(true); setErr('')
    try {
      let urlGuild = ''
      try { urlGuild = new URLSearchParams(window.location.search).get('guild') || '' } catch { /* ignore */ }
      const code = (guildArg ?? '').trim() || urlGuild || guild || ''
      const r = await fetch('/api/join', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl: url, name: '', code }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Gagal menghitung')
      const m = j.member || {}
      setScore({
        name: m.name, total: m.total, games: m.games, skills: m.skills,
        facilGames: m.facilGames || 0, facilSkills: m.facilSkills || 0,
        base: m.base, mbonus: m.mbonus, tierIdx: m.tierIdx,
        gameList: m.gameList || [], skillList: m.skillList || [], seasonBadges: m.seasonBadges || [], syncedAt: Date.now(),
      })
      setProfileUrl(m.profileUrl || url)
      if (j.id) setMemberId(j.id)
      if (j.removeToken) setRemoveToken(j.removeToken) // hanya ada saat join pertama
      if (code) setGuild(code)
      return j
    } catch (e) { setErr(e.message); throw e } finally { setLoading(false) }
  }, [setScore, setProfileUrl, setMemberId, setGuild, setRemoveToken, guild])

  const clear = useCallback(() => {
    setScore(null); setProfileUrl(''); setMemberId(null); setGuild(''); setRemoveToken(null)
  }, [setScore, setProfileUrl, setMemberId, setGuild, setRemoveToken])

  // Keluar dari leaderboard: hapus entri publik (butuh token kepemilikan), lalu bersihkan state lokal.
  const leave = useCallback(async () => {
    setLoading(true); setErr('')
    try {
      if (memberId && removeToken) {
        const r = await fetch('/api/leave', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: memberId, token: removeToken }),
        })
        const j = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(j.error || 'Gagal keluar dari leaderboard.')
      }
      clear()
    } catch (e) { setErr(e.message); throw e } finally { setLoading(false) }
  }, [memberId, removeToken, clear])

  // auto-refresh sekali saat load kalau profil sudah tersimpan
  useEffect(() => { if (profileUrl) fetchScore(profileUrl).catch(() => {}) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Ctx.Provider value={{ profileUrl, score, memberId, guild, loading, err, setErr, fetchScore, clear, leave, canLeave: !!(memberId && removeToken) }}>
      {children}
    </Ctx.Provider>
  )
}

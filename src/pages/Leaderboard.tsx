import { useEffect, useState, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MS } from '../points'
import { searchMembers } from '../../lib/searchMembers.js'
import { nextTotalAbove } from '../../lib/rank.js'
import { useMyProfile } from '../profile'
import Tip from '../Tip'
import Medal from '../Medal'
import Avatar from '../components/Avatar'
import Collapse from '../components/Collapse'
import { ago, dayMonth } from '../utils/time'
import { guildKey, guildLabel } from '../../lib/guild.js'
import { IconGamepad } from '../icons'

export interface LeaderboardMember {
  id: string
  name: string
  profile_url: string
  avatar?: string | null
  guild?: string | null
  total: number
  games: number
  skills: number
  tier_idx?: number
  last_earned?: string | null
  last_synced?: string | null
}

const Rank = ({ i }: { i: number }) => <span className="rnum">{i + 1}</span>
const IconGame = () => <IconGamepad className="mini" />
const IconBadge = () => (
  <svg
    className="mini"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    <circle cx="12" cy="8" r="6" />
  </svg>
)
const IconFilter = () => (
  <svg
    className="gf-ico"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)
const IconSearch = () => (
  <svg
    className="lbs-ico"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

interface PodiumCardProps {
  p: LeaderboardMember
  place: number
  rank: number
  isMe: boolean
  refreshing: boolean
  onRefresh: () => void
}

function PodiumCard({ p, place, rank, isMe, refreshing, onRefresh }: PodiumCardProps) {
  return (
    <div className={`pod pod-${place}${isMe ? ' me' : ''}`}>
      <div className="pod-face">
        <Avatar src={p.avatar} name={p.name} size={64} className="pod-av" />
        <Medal i={rank} className="pod-medal" />
      </div>
      <div className="pod-name" title={p.name}>
        {p.name}
        {isMe && <span className="youtag">kamu</span>}
      </div>
      <span className="gtag pod-guild">{guildLabel(p.guild)}</span>
      <div className="pod-score">
        {p.total}
        <span>poin</span>
      </div>
      <span className="pod-break" aria-hidden="true" />
      <div className="pod-stats">
        <span className="pstat">
          <IconGame />
          {p.games}
        </span>
        <span className="pstat">
          <IconBadge />
          {p.skills}
        </span>
      </div>
      <div className="pod-acts">
        <Tip label={'Lihat profil ' + p.name}>
          <a
            className="viewlink"
            href={p.profile_url}
            target="_blank"
            rel="noreferrer"
            aria-label={'Lihat profil ' + p.name}
          >
            ↗
          </a>
        </Tip>
        <Tip label="Sinkronkan ulang poin">
          <button
            type="button"
            className="miniref"
            disabled={refreshing}
            onClick={onRefresh}
            aria-label={'Sinkronkan ulang ' + p.name}
          >
            {refreshing ? '…' : '↻'}
          </button>
        </Tip>
      </div>
      <div className="pod-plinth">{rank + 1}</div>
    </div>
  )
}

interface MemberRowProps {
  p: LeaderboardMember
  rank: number
  isMe: boolean
  refreshing: boolean
  onRefresh: () => void
}

function MemberRow({ p, rank, isMe, refreshing, onRefresh }: MemberRowProps) {
  return (
    <div
      className={
        'lbrow' + ((p.tier_idx ?? -1) >= 0 ? ' hasms' : '') + (isMe ? ' me' : '')
      }
    >
      <div className="rank">
        <Rank i={rank} />
      </div>
      <Avatar src={p.avatar} name={p.name} size={34} className="lb-av" />
      <div className="pinfo">
        <div className="pname">
          {p.name}
          {isMe && <span className="youtag">kamu</span>}
        </div>
        <div className="ptier">
          <span className="gtag">{guildLabel(p.guild)}</span>
          <span className="pstat">
            <IconGame />
            {p.games}
          </span>{' '}
          <span className="pstat">
            <IconBadge />
            {p.skills}
          </span>
          {p.last_earned && <> · capai {dayMonth(p.last_earned)}</>} · sync {ago(p.last_synced || '')}
        </div>
      </div>
      <div className="pscore">
        {p.total}
        <small>poin</small>
      </div>
      <div className="pacts">
        <Tip label={'Lihat profil ' + p.name}>
          <a
            className="viewlink"
            href={p.profile_url}
            target="_blank"
            rel="noreferrer"
            aria-label={'Lihat profil ' + p.name}
          >
            ↗
          </a>
        </Tip>
        <Tip label="Sinkronkan ulang poin">
          <button
            type="button"
            className="miniref"
            disabled={refreshing}
            onClick={onRefresh}
            aria-label={'Sinkronkan ulang ' + p.name}
          >
            {refreshing ? '…' : '↻'}
          </button>
        </Tip>
      </div>
    </div>
  )
}

const TOP_N = 50

interface MyStandingProps {
  shown: LeaderboardMember[]
  me: LeaderboardMember
  rank: number
}

function MyStanding({ shown, me, rank }: MyStandingProps) {
  const beat = shown.filter((p) => p.total < me.total).length
  const pct = shown.length > 1 ? Math.round((beat / (shown.length - 1)) * 100) : 100
  const nextTotal = nextTotalAbove(shown, me.total) as number | null
  const nextRank = nextTotal === null ? null : shown.filter((p) => p.total > nextTotal).length

  return (
    <div className="mystand">
      <div className="ms-rank">
        <span className="ms-hash">#</span>
        {rank + 1}
        <span className="ms-of">dari {shown.length}</span>
      </div>
      <div className="ms-body">
        {beat > 0 && (
          <div className="ms-t">
            Kamu unggul dari <b>{beat}</b> peserta ({pct}%).
          </div>
        )}
        {nextTotal !== null && nextRank !== null ? (
          <div className="ms-p">
            Tambah <b>{nextTotal - me.total} poin</b> dan peringkatmu naik ke <b>{nextRank + 1}</b>
            {rank - nextRank > 1 && <>, melompati {rank - nextRank} posisi sekaligus</>}.
          </div>
        ) : (
          <div className="ms-p">Kamu di puncak leaderboard.</div>
        )}
      </div>
    </div>
  )
}

export default function Leaderboard() {
  const { profileUrl, memberId } = useMyProfile()
  const [params] = useSearchParams()
  const urlGuild = (params.get('guild') || '').trim().toUpperCase()
  const [members, setMembers] = useState<LeaderboardMember[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [refreshingId, setRefreshingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>(urlGuild || 'ALL')
  const [filterOpen, setFilterOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const load = useCallback(async (bust?: boolean) => {
    setLoading(true)
    setErr('')
    try {
      const r = await fetch('/api/leaderboard' + (bust ? '?t=' + Date.now() : ''))
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Gagal memuat')
      setMembers(j.members || [])
    } catch (e: unknown) {
      setErr((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setShowAll(false)
  }, [filter])

  const refresh = async (id: string) => {
    setRefreshingId(id)
    setErr('')
    try {
      const r = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Gagal refresh')
      await load(true)
    } catch (e: unknown) {
      setErr((e as Error).message)
    } finally {
      setRefreshingId(null)
    }
  }

  const guilds = useMemo(() => {
    const map = new Map<string, number>()
    members.forEach((m) => {
      const key = guildKey(m.guild)
      map.set(key, (map.get(key) || 0) + 1)
    })
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [members])

  const shown = useMemo(
    () => (filter === 'ALL' ? members : members.filter((m) => guildKey(m.guild) === filter)),
    [members, filter]
  )
  const reached = useMemo(
    () => MS.map((_, i) => shown.filter((p) => (p.tier_idx ?? -1) >= i).length),
    [shown]
  )
  const isMe = (p: LeaderboardMember) =>
    Boolean((memberId && p.id === memberId) || (profileUrl && p.profile_url === profileUrl))

  const searching = query.trim() !== ''
  const results = useMemo<LeaderboardMember[]>(() => searchMembers(shown, query), [shown, query])
  const rankOf = useMemo(() => new Map<string, number>(shown.map((p, i) => [p.id, i])), [shown])

  const rest = shown.slice(3)
  const visible = showAll ? rest : rest.slice(0, Math.max(0, TOP_N - 3))
  const hidden = rest.length - visible.length
  const myIdx = shown.findIndex(isMe)
  const meHidden = myIdx >= TOP_N && !showAll

  return (
    <div>
      <div className="lb-note" id="lb-top">
        <span>
          Poin otomatis tersinkron dari tab <b>Poin Saya</b>. Masukkan link profil di sana, kamu langsung muncul di sini.
        </span>
        {!profileUrl && (
          <Link className="joinbtn lb-note-btn" to="/points">
            Masuk lewat Poin Saya
          </Link>
        )}
      </div>

      {err && <div className="ferr">{err}</div>}

      {loading ? (
        <div className="lb-skel" aria-hidden="true">
          <div className="lb-skel-sum" />
          <div className="lb-skel-podium">
            <div className="sk-pod p2" />
            <div className="sk-pod p1" />
            <div className="sk-pod p3" />
          </div>
          <div className="lb-skel-rows">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="sk-row" />
            ))}
          </div>
        </div>
      ) : members.length === 0 ? (
        <div className="empty">
          Belum ada peserta. <Link to="/points">Hitung poinmu di Poin Saya</Link> untuk jadi yang pertama.
        </div>
      ) : (
        <>
          {guilds.length > 1 && (
            <div className="gf-wrap">
              <button
                type="button"
                className={'gf-trig' + (filter !== 'ALL' ? ' active' : '')}
                onClick={() => setFilterOpen((o) => !o)}
                aria-expanded={filterOpen}
                aria-controls="gf-panel"
              >
                <IconFilter />
                <span className="gf-val">
                  {filter === 'ALL' ? 'Semua guild' : guildLabel(filter)}
                </span>
                <span className="gf-cnt">{shown.length}</span>
                <span className="gf-chev" aria-hidden>
                  ▾
                </span>
              </button>
              <Link className="gf-compare" to="/guilds">
                Bandingkan guild <span aria-hidden>→</span>
              </Link>
              <Collapse open={filterOpen}>
                <div className="gfilter gf-panel" id="gf-panel">
                  <button
                    type="button"
                    className={filter === 'ALL' ? 'on' : ''}
                    onClick={() => {
                      setFilter('ALL')
                      setFilterOpen(false)
                    }}
                  >
                    Semua ({members.length})
                  </button>
                  {guilds.map(([g, n]) => (
                    <button
                      type="button"
                      key={g}
                      className={filter === g ? 'on' : ''}
                      onClick={() => {
                        setFilter(g)
                        setFilterOpen(false)
                      }}
                    >
                      {guildLabel(g)} ({n})
                    </button>
                  ))}
                </div>
              </Collapse>
            </div>
          )}

          <div className="lbsearch">
            <IconSearch />
            <input
              className="lbs-in"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama peserta…"
              aria-label="Cari nama peserta"
            />
            {searching && (
              <>
                <span className="lbs-cnt" aria-live="polite">
                  {results.length} hasil
                </span>
                <button
                  type="button"
                  className="lbs-clear"
                  onClick={() => setQuery('')}
                  aria-label="Hapus pencarian"
                >
                  ×
                </button>
              </>
            )}
          </div>

          <div className="lbsummary">
            <span className="chip">
              Peserta: <b>{shown.length}</b>
            </span>
            {MS.map((m, i) =>
              reached[i] > 0 ? (
                <span key={m.short} className="chip">
                  {m.short}: <b>{reached[i]}</b>
                </span>
              ) : null
            )}
            <button
              type="button"
              className="miniref"
              onClick={() => load(true)}
              aria-label="Muat ulang leaderboard"
            >
              ↻ Muat ulang
            </button>
          </div>

          {myIdx >= 0 && (
            <MyStanding
              shown={shown}
              me={shown[myIdx]}
              rank={rankOf.get(shown[myIdx].id) ?? myIdx}
            />
          )}

          {searching ? (
            results.length === 0 ? (
              <div className="empty">Tidak ada peserta bernama “{query.trim()}”.</div>
            ) : (
              <div className="lblist">
                {results.map((p) => (
                  <MemberRow
                    key={p.id}
                    p={p}
                    rank={rankOf.get(p.id) ?? 0}
                    isMe={isMe(p)}
                    refreshing={refreshingId === p.id}
                    onRefresh={() => refresh(p.id)}
                  />
                ))}
              </div>
            )
          ) : (
            <>
              {shown.length > 0 && (
                <div className="podium">
                  {shown.slice(0, 3).map((p, i) => (
                    <PodiumCard
                      key={p.id}
                      p={p}
                      place={i + 1}
                      rank={rankOf.get(p.id) ?? i}
                      isMe={isMe(p)}
                      refreshing={refreshingId === p.id}
                      onRefresh={() => refresh(p.id)}
                    />
                  ))}
                </div>
              )}

              {visible.length > 0 && (
                <div className="lblist">
                  {visible.map((p) => (
                    <MemberRow
                      key={p.id}
                      p={p}
                      rank={rankOf.get(p.id) ?? 0}
                      isMe={isMe(p)}
                      refreshing={refreshingId === p.id}
                      onRefresh={() => refresh(p.id)}
                    />
                  ))}

                  {meHidden && (
                    <>
                      <div className="lbgap" aria-hidden>
                        · · ·
                      </div>
                      <MemberRow
                        p={shown[myIdx]}
                        rank={rankOf.get(shown[myIdx].id) ?? myIdx}
                        isMe
                        refreshing={refreshingId === shown[myIdx].id}
                        onRefresh={() => refresh(shown[myIdx].id)}
                      />
                    </>
                  )}
                </div>
              )}

              {hidden > 0 && (
                <button
                  type="button"
                  className="lbmore"
                  onClick={() => setShowAll(true)}
                >
                  Tampilkan {hidden} peserta lainnya
                  <span className="lbmore-sub">
                    peringkat {TOP_N + 1} sampai {shown.length}
                  </span>
                </button>
              )}

              {showAll && rest.length > TOP_N - 3 && (
                <button
                  type="button"
                  className="lbmore lbless"
                  onClick={() => {
                    setShowAll(false)
                    document.getElementById('lb-top')?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }}
                >
                  Ringkas lagi ke {TOP_N} teratas
                </button>
              )}
            </>
          )}
          <div className="foot">
            Poin dihitung otomatis dari badge di profil (best-effort). Klik ↗ untuk verifikasi. Untuk masuk guild fasilitator, buka link dengan ?guild=KODE.
          </div>
        </>
      )}
    </div>
  )
}

export interface BadgeItem {
  name: string
  date?: string
  kind?: 'skill' | 'game' | 'trivia' | 'special' | 'unknown'
  url?: string | null
  problem?: string | null
  since?: string
  alias?: string
}

export interface ScoreData {
  total: number
  games: number
  skills: number
  trivia: number
  milestone: string
  milestoneName?: string
  nextMilestone?: string
  neededForNext?: number
  badges?: BadgeItem[]
  breakdown?: Record<string, number>
}

export interface Member {
  id: string
  name: string
  profile_url: string
  avatar_url?: string | null
  guild?: string | null
  total: number
  games: number
  skills: number
  trivia?: number
  milestone?: string
  updated_at?: string
}

export interface GuildStatItem {
  guild: string
  key: string
  label: string
  count: number
  total: number
  avg: number
  max: number
  games: number
  skills: number
  milestones: Record<string, number>
}

export interface SwagItemDetail {
  name: string
  desc: string
}

export interface SwagTier {
  id: string
  name: string
  minPts: number
  spots: number
  stars: number
  badgeSvg: string
  image: string
  items: SwagItemDetail[]
  hasMore?: boolean
}

export interface SpotlightItem {
  name: string
  tiers: string
  image: string
  forumUrl: string
  features: string[]
}

export interface ExpandedModalItem {
  title: string
  meta?: string
  image: string
  items?: SwagItemDetail[]
  features?: string[]
  forumUrl?: string
}

export interface NavRoute {
  path: string
  label: string
  icon: string
  exact?: boolean
}

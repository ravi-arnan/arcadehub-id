// Target pribadi ("aku mau ngerjain yang ini") untuk katalog badge.
//
// Disimpan LOKAL saja dan sengaja tidak dikirim ke leaderboard: ini niat, bukan capaian, dan
// angka yang bisa diklaim tanpa bukti tidak boleh ikut memengaruhi peringkat. Alasan yang sama
// dipakai klaim Bonus Milestone di src/components/BonusMilestone.jsx.
// ponytail: localStorage, cukup sampai ada alasan nyata target ini perlu ikut pindah perangkat.
//
// Kuncinya adalah `it.key` dari katalog (`g-<nama game>` / `s-<id>`). Kunci game bisa jadi basi
// karena GAME_CATALOG berganti tiap bulan. Itu dibiarkan: pemakainya selalu menurunkan daftar
// target dari `items` yang sedang tampil, jadi kunci basi tidak pernah terhitung, cuma menumpang
// di storage. Jangan menghitung target dari isi Set ini langsung.
import { useState, useEffect } from 'react'

const KEY = 'gcaf2026_wishlist'

const read = () => {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch { return new Set() }
}

export function useWishlist() {
  const [saved, setSaved] = useState(read)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify([...saved])) } catch { /* private mode: target tidak persisten, bukan error */ }
  }, [saved])
  const toggle = (key) => setSaved((prev) => {
    const next = new Set(prev)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })
  return [saved, toggle]
}

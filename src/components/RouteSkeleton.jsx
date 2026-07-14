// Placeholder shimmer saat chunk halaman masih di-load (Suspense fallback).
export default function RouteSkeleton() {
  return (
    <div className="rskel" role="status" aria-label="Memuat halaman">
      <div className="skel sk-hero" aria-hidden="true" />
      <div className="sk-row" aria-hidden="true">
        <div className="skel sk-chip" />
        <div className="skel sk-chip" />
        <div className="skel sk-chip" />
      </div>
      <div className="sk-grid" aria-hidden="true">
        <div className="skel sk-card" />
        <div className="skel sk-card" />
      </div>
      <div className="skel sk-block" aria-hidden="true" />
      <div className="skel sk-block short" aria-hidden="true" />
      <span className="sr-only">Memuat…</span>
    </div>
  )
}

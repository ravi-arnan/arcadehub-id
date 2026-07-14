import { CONFIG } from '../config.js'
import { CONTRIBUTORS } from '../contributors.js'

function IconGithub(p) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
}
function IconExt(p) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" /></svg>
}

const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
const hue = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360; return h }

function Avatar({ c }) {
  if (c.github) return <img className="ct-av" src={`https://github.com/${c.github}.png?size=160`} alt={c.name} loading="lazy" width="72" height="72" />
  return <div className="ct-av ct-fallback" style={{ background: `hsl(${hue(c.name)} 45% 32%)` }} aria-hidden="true">{initials(c.name)}</div>
}

export default function Contribute() {
  return (
    <div className="contrib">
      <section className="ch-hero">
        <div className="ch-eyebrow">[ KOMUNITAS ]</div>
        <h2 className="ch-title">Kontributor</h2>
        <p className="ch-sub">Orang-orang yang bikin Arcade Hub makin oke. Proyek ini <b>open source (MIT)</b>, siapa pun boleh ikut ngoding, lapor bug, atau nambah ide.</p>
        <div className="ch-cta">
          <a className="joinbtn" href={CONFIG.repoUrl} target="_blank" rel="noreferrer"><IconGithub className="btn-ic" /> Lihat GitHub</a>
          <a className="ghost-btn" href={CONFIG.contributingUrl} target="_blank" rel="noreferrer">Cara Kontribusi</a>
        </div>
      </section>

      <div className="ch-ways">
        <a className="wayc" href={CONFIG.issuesUrl} target="_blank" rel="noreferrer">
          <div className="wayc-h">Lapor bug / ide</div>
          <div className="wayc-p">Nemu error atau punya usul fitur? Buka issue.</div>
        </a>
        <a className="wayc" href={CONFIG.goodFirstIssuesUrl} target="_blank" rel="noreferrer">
          <div className="wayc-h">Good first issue</div>
          <div className="wayc-p">Baru mulai open source? Mulai dari sini.</div>
        </a>
        <a className="wayc" href={CONFIG.addYourselfUrl} target="_blank" rel="noreferrer">
          <div className="wayc-h">Tambahkan dirimu</div>
          <div className="wayc-p">Edit <code>src/contributors.js</code> lewat PR.</div>
        </a>
      </div>

      <div className="ct-grid">
        {CONTRIBUTORS.map((c) => (
          <div key={c.name + (c.github || '')} className="ct-card">
            {c.core && <span className="ct-core">CORE</span>}
            <Avatar c={c} />
            <div className="ct-name">{c.name}</div>
            {c.bio && <p className="ct-bio">{c.bio}</p>}
            {c.tags?.length ? <div className="ct-tags">{c.tags.map((t) => <span key={t} className="ct-tag">{t}</span>)}</div> : null}
            <div className="ct-links">
              {c.github && <a href={`https://github.com/${c.github}`} target="_blank" rel="noreferrer"><IconGithub className="lk-ic" /> GitHub</a>}
              {c.web && <a href={c.web} target="_blank" rel="noreferrer"><IconExt className="lk-ic" /> Web</a>}
            </div>
          </div>
        ))}
        <a className="ct-card ct-add" href={CONFIG.addYourselfUrl} target="_blank" rel="noreferrer">
          <div className="ct-plus">+</div>
          <div className="ct-name">Kamu berikutnya?</div>
          <p className="ct-bio">Kontribusi sekecil apa pun dihargai. Tambahkan dirimu lewat PR.</p>
        </a>
      </div>
    </div>
  )
}

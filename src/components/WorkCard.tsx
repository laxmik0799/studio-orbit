import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/work'
import { Artwork } from './Artwork'
import { gsap, isFinePointer } from '../lib/motion'

/** Case-study card with a gentle 3D tilt on hover. */
export function WorkCard({ p, index, aspect = 'aspect-[4/5]', className = '' }: { p: Project; index: number; aspect?: string; className?: string }) {
  const art = useRef<HTMLDivElement>(null)
  const onMove = (e: React.PointerEvent) => {
    if (!art.current || !isFinePointer()) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(art.current, { rotateY: x * 8, rotateX: -y * 8, scale: 1.02, duration: 0.6, ease: 'power3.out' })
  }
  const onLeave = () => art.current && gsap.to(art.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
  return (
    <Link to={`/work/${p.slug}`} className={`group block ${className}`} data-cursor="View" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="[perspective:1000px]">
        <div ref={art} className={`relative overflow-hidden rounded-[6px] ${aspect} will-change-transform`}>
          <Artwork style={p.art.style} seed={p.art.seed} palette={p.art.palette} label={p.art.label ?? p.client.split(' ')[0]} alt={`Generated cover artwork for ${p.client}`} />
          <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-bone backdrop-blur">{p.disciplines.join(' · ')}</span>
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-60">
            {String(index + 1).padStart(2, '0')} / {p.year}
          </p>
          <h3 className="mt-1 font-display text-[clamp(1.4rem,2.2vw,2.1rem)] font-bold uppercase leading-none tracking-tight">{p.client}</h3>
        </div>
        <p className="hidden max-w-[16rem] text-right text-sm opacity-70 sm:block">{p.title}</p>
      </div>
    </Link>
  )
}

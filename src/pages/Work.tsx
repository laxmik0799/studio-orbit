import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowUpRight, LayoutGrid, List } from 'lucide-react'
import { DISCIPLINES, PROJECTS, type Discipline } from '../data/work'
import { WorkCard } from '../components/WorkCard'
import { Artwork } from '../components/Artwork'
import { gsap, isFinePointer, ScrollTrigger, Split, useScrollReveals } from '../lib/motion'

export default function Work() {
  const root = useRef<HTMLDivElement>(null)
  const [params, setParams] = useSearchParams()
  const filter = (DISCIPLINES.includes(params.get('filter') as Discipline) ? params.get('filter') : 'All') as Discipline | 'All'
  const view = params.get('view') === 'list' ? 'list' : 'grid'
  const shown = PROJECTS.filter((p) => filter === 'All' || p.disciplines.includes(filter))
  const [hover, setHover] = useState<number | null>(null)
  const follower = useRef<HTMLDivElement>(null)
  useScrollReveals(root)

  const set = (k: string, v: string | null) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p)
        v ? n.set(k, v) : n.delete(k)
        return n
      },
      { replace: true },
    )

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 700)
    return () => clearTimeout(t)
  }, [filter, view])

  useEffect(() => {
    const el = follower.current
    if (!el || !isFinePointer() || view !== 'list') return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    let placed = false
    const move = (e: PointerEvent) => {
      if (!placed) {
        gsap.set(el, { x: e.clientX, y: e.clientY })
        placed = true
      }
      xTo(e.clientX)
      yTo(e.clientY)
    }
    window.addEventListener('pointerover', move)
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointerover', move)
      window.removeEventListener('pointermove', move)
    }
  }, [view])

  const count = (d: Discipline | 'All') => (d === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.disciplines.includes(d)).length)

  return (
    <div ref={root} className="min-h-screen bg-bone pb-28 pt-36 sm:pt-44">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="h-display text-[clamp(4rem,15vw,15rem)]" data-split>
            <Split text="Work" by="char" />
          </h1>
          <p className="max-w-sm pb-4 text-ash" data-reveal>
            A selection of brands, websites and 3D worlds. Every client here is fictional, and every image is generated in code.
          </p>
        </div>

        <div className="sticky top-20 z-30 -mx-5 mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-ink/15 bg-bone/90 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div role="group" aria-label="Filter by discipline" className="flex flex-wrap gap-2">
            <LayoutGroup id="filters">
              {(['All', ...DISCIPLINES] as const).map((d) => {
                const active = filter === d
                return (
                  <button key={d} type="button" aria-pressed={active} onClick={() => set('filter', d === 'All' ? null : d)} className={`pill relative border-ink/20 ${active ? 'text-bone' : 'hover:border-ink'}`}>
                    {active && <motion.span layoutId="filter-bg" className="absolute inset-0 -z-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <span className="relative">
                      {d} <sup className="opacity-60">{count(d)}</sup>
                    </span>
                  </button>
                )
              })}
            </LayoutGroup>
          </div>
          <div role="radiogroup" aria-label="Layout" className="flex gap-1 rounded-full border border-ink/20 p-1">
            {(
              [
                ['grid', LayoutGrid],
                ['list', List],
              ] as const
            ).map(([v, Icon]) => (
              <button key={v} type="button" role="radio" aria-checked={view === v} aria-label={`${v} view`} onClick={() => set('view', v === 'grid' ? null : v)} className={`rounded-full p-2 transition-colors ${view === v ? 'bg-ink text-bone' : 'hover:bg-paper'}`}>
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {shown.length} projects shown
        </p>

        {view === 'grid' ? (
          <motion.div layout className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <motion.div key={p.slug} layout initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }} className={i % 2 === 1 ? 'md:mt-28' : ''}>
                  <WorkCard p={p} index={PROJECTS.indexOf(p)} aspect={i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[5/4]'} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-10" onPointerLeave={() => setHover(null)}>
            <div className="hidden grid-cols-[60px_1fr_1fr_120px] gap-6 border-b border-ink/15 pb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ash md:grid">
              <span>No.</span>
              <span>Client</span>
              <span>Discipline</span>
              <span className="text-right">Year</span>
            </div>
            <AnimatePresence initial={false}>
              {shown.map((p) => {
                const idx = PROJECTS.indexOf(p)
                return (
                  <motion.div key={p.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPointerEnter={() => setHover(idx)}>
                    <Link to={`/work/${p.slug}`} className="group relative grid grid-cols-[40px_1fr_auto] items-center gap-4 overflow-hidden border-b border-ink/15 py-6 md:grid-cols-[60px_1fr_1fr_120px] md:gap-6 md:py-8" data-cursor="View">
                      <span className="absolute inset-0 origin-left scale-x-0 bg-volt transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" aria-hidden />
                      <span className="relative font-mono text-[12px] text-ash group-hover:text-ink">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="relative font-display text-[clamp(1.8rem,4.5vw,4rem)] font-bold uppercase leading-none tracking-tight transition-transform duration-500 group-hover:translate-x-3">{p.client}</span>
                      <span className="relative hidden text-sm md:block">{p.disciplines.join(' · ')}</span>
                      <span className="relative flex items-center justify-end gap-2 font-mono text-[12px]">
                        {p.year} <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={follower} className="pointer-events-none fixed left-0 top-0 z-40 hidden h-64 w-52 -translate-x-1/2 -translate-y-1/2 lg:block" aria-hidden>
              <AnimatePresence>
                {hover !== null && (
                  <motion.div key={hover} className="absolute inset-0 overflow-hidden rounded-md shadow-2xl" initial={{ opacity: 0, scale: 0.5, rotate: 6 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.35 }}>
                    <Artwork {...PROJECTS[hover].art} label={PROJECTS[hover].art.label ?? PROJECTS[hover].client.split(' ')[0]} alt="" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

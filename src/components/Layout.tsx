import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { EASE, useLenis } from '../lib/motion'
import { Magnetic } from './Cursor'

export const LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/studio', label: 'Studio' },
  { to: '/contact', label: 'Contact' },
]

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  return <span className="tabular-nums">{new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(now)} IST</span>
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 font-display text-[18px] font-extrabold uppercase tracking-tight ${className}`}>
      <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden>
        <circle cx="16" cy="16" r="6.5" fill="currentColor" />
        <ellipse cx="16" cy="16" rx="13.5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(-25 16 16)" />
      </svg>
      Orbit
    </span>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const lenis = useLenis()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
    document.documentElement.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lenis])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] text-bone mix-blend-difference">
        <div className="container-x flex h-20 items-center justify-between">
          <Link to="/" className="pointer-events-auto" aria-label="Orbit Studio home">
            <Logo />
          </Link>
          <nav aria-label="Main" className="pointer-events-auto hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `group relative font-mono text-[12px] uppercase tracking-[0.14em] ${isActive ? '' : 'opacity-80 hover:opacity-100'}`}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-500 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="pointer-events-auto flex items-center gap-6">
            <span className="hidden font-mono text-[12px] uppercase tracking-[0.14em] lg:inline">
              Bengaluru · <Clock />
            </span>
            <button type="button" onClick={() => setOpen(true)} className="group flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em]" aria-expanded={open} aria-controls="menu">
              Menu
              <span className="flex flex-col gap-[5px]" aria-hidden>
                <span className="h-px w-6 bg-current transition-transform group-hover:translate-x-1" />
                <span className="h-px w-6 bg-current transition-transform group-hover:-translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[70] flex flex-col bg-ink text-bone"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="container-x flex h-20 items-center justify-between">
              <Link to="/" aria-label="Orbit Studio home">
                <Logo />
              </Link>
              <button type="button" autoFocus onClick={() => setOpen(false)} className="font-mono text-[12px] uppercase tracking-[0.14em] hover:text-volt">
                Close ✕
              </button>
            </div>
            <nav aria-label="Menu" className="container-x flex flex-1 flex-col justify-center">
              {[{ to: '/', label: 'Home' }, ...LINKS].map((l, i) => (
                <div key={l.to} className="overflow-hidden">
                  <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.25 + i * 0.07, duration: 0.9, ease: EASE }}>
                    <Link to={l.to} className="group flex items-baseline gap-4 py-1 sm:gap-8" data-cursor="Go">
                      <span className="font-mono text-[12px] text-ash">0{i + 1}</span>
                      <span className="h-display text-[clamp(3.2rem,11vw,10rem)] transition-colors duration-300 group-hover:text-volt">{l.label}</span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="container-x flex flex-wrap justify-between gap-4 pb-8 font-mono text-[12px] uppercase tracking-[0.14em] text-ash">
              <span>hello@orbit.studio.example</span>
              <span>Fictional studio · portfolio project</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Marquee({ items, className = '', reverse = false }: { items: string[]; className?: string; reverse?: boolean }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <div className={`flex w-max animate-marquee ${reverse ? '[animation-direction:reverse]' : ''}`}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="px-6">{t}</span>
            <span className="text-[0.6em]">✺</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function Footer() {
  const lenis = useLenis()
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-bone">
      <div className="container-x">
        <p className="eyebrow text-ash">Have a project in mind?</p>
        <Link to="/contact" className="group mt-4 block" data-cursor="Talk">
          <span className="h-display flex items-center gap-4 text-[clamp(3.5rem,13vw,13rem)] transition-colors duration-500 group-hover:text-volt">
            Let’s talk
            <ArrowUpRight className="h-[0.7em] w-[0.7em] shrink-0 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
          </span>
        </Link>
        <div className="mt-16 grid gap-10 border-t border-bone/15 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-ash">An independent studio for brands, websites and 3D worlds that move.</p>
          </div>
          <div className="font-mono text-[12px] uppercase tracking-[0.14em]">
            <p className="text-ash">Pages</p>
            <ul className="mt-3 space-y-2">
              {[{ to: '/', label: 'Home' }, ...LINKS].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-volt">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="font-mono text-[12px] uppercase tracking-[0.14em]">
            <p className="text-ash">Built by</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="https://laxmi-portfolio-beryl.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-volt">
                  Laxmi Kumari ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/laxmik0799/studio-orbit" target="_blank" rel="noopener noreferrer" className="hover:text-volt">
                  Source on GitHub ↗
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-start lg:justify-end">
            <Magnetic>
              <button type="button" onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))} className="flex h-24 w-24 items-center justify-center rounded-full border border-bone/30 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-volt hover:bg-volt hover:text-ink">
                Back to top
              </button>
            </Magnetic>
          </div>
        </div>
        <p className="border-t border-bone/15 py-6 text-[12px] text-ash">Orbit Studio is a fictional agency created for a portfolio project by Laxmi Kumari. Clients, projects and results shown are invented; all artwork is generated in code.</p>
      </div>
    </footer>
  )
}

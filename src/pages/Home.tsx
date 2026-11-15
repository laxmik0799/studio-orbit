import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react'
import { gsap, ScrollTrigger, Split, isFinePointer, prefersReducedMotion, useScrollReveals } from '../lib/motion'
import { PROJECTS } from '../data/work'
import { Artwork } from '../components/Artwork'
import { WorkCard } from '../components/WorkCard'
import { Magnetic } from '../components/Cursor'
import { Marquee } from '../components/Layout'

const Blob = lazy(() => import('../three/Blob'))

const MANIFESTO =
  'We are a small, stubborn studio that believes the internet should feel alive. We design brands with a point of view, build websites that move like they mean it, and craft 3D worlds people want to stay in.'

const SERVICES = [
  { n: '01', title: 'Branding', desc: 'Strategy, naming support, identity systems and guidelines that survive contact with the real world.', items: ['Brand strategy', 'Visual identity', 'Packaging', 'Guidelines'], art: PROJECTS[3].art },
  { n: '02', title: 'Digital', desc: 'Websites and products designed and engineered in-house, fast on every phone and easy to update.', items: ['Websites', 'Web apps', 'E-commerce', 'Design systems'], art: PROJECTS[4].art },
  { n: '03', title: '3D & Motion', desc: 'Real-time WebGL, product configurators, generative systems and motion that gives a brand a pulse.', items: ['WebGL', 'Configurators', 'Generative art', 'Motion design'], art: PROJECTS[1].art },
  { n: '04', title: 'Campaigns', desc: 'Launches that travel: concept, art direction and assets for social, out-of-home and everything between.', items: ['Concept', 'Art direction', 'Social', 'Launch films'], art: PROJECTS[2].art },
]

const PRINCIPLES = [
  { k: 'Make it move', d: 'Motion is not decoration. It explains, guides and gives a brand a heartbeat.', bg: 'bg-volt text-ink' },
  { k: 'Fast is a feature', d: 'Every site we ship loads quickly on a mid-range phone. Beauty that buffers is not beautiful.', bg: 'bg-ink text-bone' },
  { k: 'Small team, no hand-offs', d: 'The people who pitch are the people who design and build. Nothing gets lost in translation.', bg: 'bg-paper text-ink' },
  { k: 'Leave it better', d: 'We document everything and design for the team that maintains it after launch.', bg: 'bg-[#9a8cff] text-ink' },
]

function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const scroll = useRef(0)
  const [show3d, setShow3d] = useState(false)

  useEffect(() => {
    // Defer the WebGL scene until the intro has finished so the counter stays smooth.
    if (ready) setShow3d(true)
  }, [ready])

  useEffect(() => {
    if (!ready || !root.current) return
    const reduce = prefersReducedMotion()
    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.from('.hero-char', { yPercent: 115, rotate: 8, duration: 1.3, ease: 'expo.out', stagger: 0.025, delay: 0.15 })
        gsap.from('.hero-fade', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.7 })
        gsap.from('.hero-blob', { scale: 0.6, opacity: 0, duration: 1.8, ease: 'expo.out', delay: 0.2 })
      }
      ScrollTrigger.create({ trigger: root.current, start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => (scroll.current = s.progress) })
      if (!reduce) gsap.to('.hero-copy', { yPercent: -30, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [ready])

  const lines = ['We build', 'brands that', 'orbit']
  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink text-bone" aria-label="Introduction">
      <div className="hero-blob pointer-events-none absolute inset-x-0 top-12 h-[46svh] lg:inset-0 lg:left-[30%] lg:top-0 lg:h-auto">
        {show3d && (
          <Suspense fallback={null}>
            <Blob scroll={scroll} className="h-full w-full" />
          </Suspense>
        )}
      </div>
      <div className="hero-copy container-x relative flex flex-1 flex-col justify-end pb-10 pt-32">
        <p className="hero-fade eyebrow mb-6 text-ash">( Independent creative studio — Bengaluru / Remote )</p>
        <h1 className="h-display text-[clamp(3.4rem,12.5vw,13.5rem)]" aria-label="We build brands that orbit">
          {lines.map((l, i) => (
            <span key={l} className="block" aria-hidden>
              {l.split(' ').map((word, w, arr) => (
                <span key={w} className="inline-block whitespace-nowrap">
                  {[...word].map((c, j) => (
                    <span key={j} className="inline-block overflow-hidden align-bottom pb-[0.04em]">
                      <span className={`hero-char inline-block ${i === 2 ? 'text-volt' : ''}`}>{c}</span>
                    </span>
                  ))}
                  {w < arr.length - 1 && <span className="inline-block">&nbsp;</span>}
                </span>
              ))}
              {i === 2 && <span className="hero-char ml-[0.15em] inline-block align-top text-[0.25em] text-bone">✺</span>}
            </span>
          ))}
        </h1>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <p className="hero-fade max-w-md text-[17px] leading-relaxed text-bone/75">Identity, websites and real-time 3D for ambitious companies that refuse to look like everyone else.</p>
          <div className="hero-fade flex items-center gap-4">
            <Magnetic>
              <Link to="/work" className="pill border-bone/40 bg-bone text-ink hover:border-volt hover:bg-volt">
                See our work <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
            <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash sm:flex">
              Scroll <ArrowDownRight size={14} className="animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Manifesto() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.mf-word', { opacity: 0.12 }, { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: '.mf-text', start: 'top 80%', end: 'bottom 45%', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])
  const words = MANIFESTO.split(' ')
  return (
    <section ref={root} className="relative overflow-hidden bg-bone py-28 sm:py-40" aria-label="Manifesto">
      <div className="pointer-events-none absolute -left-10 top-16 h-40 w-32 overflow-hidden rounded-md opacity-90 sm:h-56 sm:w-44" data-speed="0.6">
        <Artwork {...PROJECTS[0].art} alt="" />
      </div>
      <div className="pointer-events-none absolute -right-8 bottom-10 h-44 w-36 overflow-hidden rounded-md sm:h-64 sm:w-52" data-speed="1.1">
        <Artwork {...PROJECTS[5].art} alt="" />
      </div>
      <div className="container-x relative">
        <p className="eyebrow mb-10 text-ash">( Manifesto )</p>
        <p className="mf-text max-w-[22ch] font-display text-[clamp(2rem,5.2vw,5.4rem)] font-bold leading-[1.02] tracking-[-0.03em]">
          {words.map((w, i) => (
            <span key={i} className={`mf-word ${['alive.', 'move', '3D'].some((k) => w.startsWith(k)) ? 'text-[#5b4cff]' : ''}`}>
              {w}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}

function HorizontalWork() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!root.current || !track.current) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.current!.scrollWidth - window.innerWidth
      gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (s) => bar.current && (bar.current.style.transform = `scaleX(${s.progress})`),
        },
      })
    })
    return () => mm.revert()
  }, [])
  return (
    <section ref={root} className="relative overflow-hidden bg-ink py-20 text-bone lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0" aria-labelledby="work-h">
      <div className="container-x mb-10 flex items-end justify-between lg:mb-12">
        <h2 id="work-h" className="h-display text-[clamp(2.6rem,7vw,6.5rem)]">
          Selected <span className="text-volt">work</span>
          <sup className="ml-2 align-top font-mono text-[0.25em] font-normal text-ash">({String(PROJECTS.length).padStart(2, '0')})</sup>
        </h2>
        <Link to="/work" className="pill hidden border-bone/30 hover:border-volt hover:text-volt sm:inline-flex">
          All projects <ArrowUpRight size={14} />
        </Link>
      </div>
      <div ref={track} className="flex flex-col gap-14 px-5 sm:px-8 lg:w-max lg:flex-row lg:gap-10 lg:px-12">
        {PROJECTS.map((p, i) => (
          <WorkCard key={p.slug} p={p} index={i} className="lg:w-[34vw] xl:w-[30vw]" aspect="aspect-[4/5] lg:aspect-[4/4.6]" />
        ))}
        <Link to="/work" className="group hidden w-[24vw] shrink-0 items-center justify-center rounded-md border border-bone/20 lg:flex" data-cursor="All">
          <span className="h-display text-center text-[4vw] transition-colors group-hover:text-volt">
            All
            <br />
            work →
          </span>
        </Link>
      </div>
      <div className="container-x mt-10 hidden lg:block">
        <div className="h-px w-full bg-bone/15">
          <div ref={bar} className="h-px origin-left scale-x-0 bg-volt" />
        </div>
      </div>
    </section>
  )
}

function Services() {
  const [open, setOpen] = useState<string | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const follower = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = follower.current
    const list = listRef.current
    if (!el || !list || !isFinePointer()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    let placed = false
    const move = (e: PointerEvent) => {
      const r = list.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      // Jump straight to the pointer on entry, then follow smoothly.
      if (!placed) {
        gsap.set(el, { x, y })
        placed = true
      }
      xTo(x)
      yTo(y)
    }
    const leave = () => (placed = false)
    list.addEventListener('pointerover', move)
    list.addEventListener('pointermove', move)
    list.addEventListener('pointerleave', leave)
    return () => {
      list.removeEventListener('pointerover', move)
      list.removeEventListener('pointermove', move)
      list.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section className="bg-bone py-28 sm:py-36" aria-labelledby="svc-h">
      <div className="container-x">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <h2 id="svc-h" className="h-display text-[clamp(2.6rem,7vw,6.5rem)]" data-split>
            <Split text="What we do" />
          </h2>
          <p className="max-w-sm text-ash" data-reveal>
            Four disciplines, one team. Most projects mix at least two, which is where the interesting work happens.
          </p>
        </div>
        <div ref={listRef} className="relative border-t border-ink/15" onPointerLeave={() => setHover(null)}>
          <div ref={follower} className="pointer-events-none absolute left-0 top-0 z-10 hidden h-56 w-44 -translate-x-1/2 -translate-y-1/2 lg:block" aria-hidden>
            <AnimatePresence>
              {hover !== null && (
                <motion.div key={hover} className="absolute inset-0 overflow-hidden rounded-md" initial={{ opacity: 0, scale: 0.6, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.35 }}>
                  <Artwork {...SERVICES[hover].art} alt="" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {SERVICES.map((s, i) => {
            const isOpen = open === s.n
            return (
              <div key={s.n} className="border-b border-ink/15" onPointerEnter={() => setHover(i)}>
                <button type="button" onClick={() => setOpen(isOpen ? null : s.n)} aria-expanded={isOpen} className="group relative flex w-full items-center gap-6 overflow-hidden py-7 text-left sm:py-9">
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100" aria-hidden />
                  <span className="relative font-mono text-[12px] text-ash transition-colors group-hover:text-volt">{s.n}</span>
                  <span className="h-display relative flex-1 text-[clamp(2.2rem,6vw,5.5rem)] transition-all duration-500 group-hover:translate-x-4 group-hover:text-bone">{s.title}</span>
                  <Plus className={`relative h-8 w-8 shrink-0 transition-all duration-500 group-hover:text-volt ${isOpen ? 'rotate-45' : ''}`} strokeWidth={1.4} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }} className="overflow-hidden">
                      <div className="grid gap-6 pb-10 pl-10 sm:grid-cols-2 sm:pl-14">
                        <p className="max-w-md text-lg leading-relaxed">{s.desc}</p>
                        <ul className="flex flex-wrap content-start gap-2">
                          {s.items.map((it) => (
                            <li key={it} className="pill border-ink/20">
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Numbers() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!root.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.count').forEach((el) => {
        const end = Number(el.dataset.to)
        const obj = { v: prefersReducedMotion() ? end : 0 }
        el.textContent = String(obj.v)
        gsap.to(obj, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' }, onUpdate: () => (el.textContent = String(Math.round(obj.v))) })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  const stats = [
    { to: 7, suffix: '', label: 'Years orbiting' },
    { to: 64, suffix: '', label: 'Launches shipped' },
    { to: 11, suffix: '', label: 'People, one room' },
    { to: 98, suffix: '', label: 'Avg. Lighthouse score' },
  ]
  return (
    <section ref={root} className="relative overflow-hidden bg-volt py-24 text-ink sm:py-32" aria-label="Studio in numbers">
      <Marquee items={['Branding', 'Websites', '3D & Motion', 'Campaigns', 'Generative art']} className="h-display absolute -top-2 left-0 text-[clamp(4rem,12vw,11rem)] text-ink/[0.07]" />
      <div className="container-x relative grid grid-cols-2 gap-y-14 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} data-reveal data-delay={i * 0.08} className="border-l border-ink/25 pl-5">
            <p className="h-display text-[clamp(4rem,9vw,8.5rem)]">
              <span className="count" data-to={s.to}>
                {s.to}
              </span>
            </p>
            <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.14em]">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Principles() {
  return (
    <section className="bg-bone py-28 sm:py-36" aria-labelledby="pr-h">
      <div className="container-x">
        <p className="eyebrow mb-4 text-ash">( How we work )</p>
        <h2 id="pr-h" className="h-display mb-16 text-[clamp(2.6rem,7vw,6.5rem)]" data-split>
          <Split text="Four rules" />
        </h2>
        <div className="relative">
          {PRINCIPLES.map((p, i) => (
            <article key={p.k} className={`sticky mb-8 flex min-h-[46vh] flex-col justify-between rounded-[22px] p-8 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.35)] sm:p-12 ${p.bg}`} style={{ top: `${96 + i * 28}px` }}>
              <div className="flex items-start justify-between gap-6">
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] opacity-70">Rule {String(i + 1).padStart(2, '0')}</span>
                <span className="h-display text-[clamp(3rem,8vw,7rem)] opacity-20">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <h3 className="h-display text-[clamp(2.2rem,6vw,5.5rem)]">{p.k}</h3>
                <p className="mt-4 max-w-xl text-lg opacity-80">{p.d}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="relative overflow-hidden bg-bone pb-28 sm:pb-36" aria-label="Start a project">
      <div className="container-x flex flex-col items-center text-center">
        <p className="eyebrow text-ash" data-reveal>
          ( Got something in mind? )
        </p>
        <h2 className="h-display mt-6 text-[clamp(3rem,10vw,10rem)]" data-split>
          <Split text="Let’s make it move" />
        </h2>
        <div className="mt-12" data-reveal>
          <Magnetic strength={0.5}>
            <Link to="/contact" className="group relative flex h-44 w-44 items-center justify-center overflow-hidden rounded-full bg-ink text-bone sm:h-52 sm:w-52" data-cursor="Hello">
              <span className="absolute inset-0 origin-bottom scale-0 rounded-full bg-volt transition-transform duration-500 ease-out group-hover:scale-100" aria-hidden />
              <span className="relative font-mono text-[12px] uppercase tracking-[0.16em] transition-colors group-hover:text-ink">Start a project</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

export default function Home({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  useScrollReveals(root)
  return (
    <div ref={root}>
      <Hero ready={ready} />
      <div className="bg-volt py-5 text-ink">
        <Marquee items={['Branding', 'Websites', '3D & Motion', 'Campaigns', 'Generative art']} className="h-display text-[clamp(1.6rem,3.5vw,3rem)]" />
      </div>
      <Manifesto />
      <HorizontalWork />
      <Services />
      <Numbers />
      <Principles />
      <CTA />
    </div>
  )
}

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { gsap, ScrollTrigger, Split, prefersReducedMotion, useScrollReveals } from '../lib/motion'
import { Marquee } from '../components/Layout'

const Blob = lazy(() => import('../three/Blob'))

const STEPS = [
  { t: 'Discover', d: 'Workshops, interviews and a hard look at the competition. We leave with one sharp sentence about what makes you different.', w: '1–2 weeks' },
  { t: 'Define', d: 'Strategy, scope and a creative territory you can react to early, before anyone opens Figma for real.', w: '1 week' },
  { t: 'Design', d: 'Identity, interface and motion explored together, prototyped in the browser so it feels right, not just looks right.', w: '3–6 weeks' },
  { t: 'Develop', d: 'The same team builds it: accessible, fast and tested on real devices, with a CMS your team will actually enjoy.', w: '4–8 weeks' },
  { t: 'Launch & grow', d: 'Launch support, analytics and a handover kit. Many clients keep us on for monthly design sprints.', w: 'Ongoing' },
]

const CAPABILITIES = ['Brand strategy', 'Naming support', 'Visual identity', 'Packaging', 'Art direction', 'UX & UI design', 'Design systems', 'React & Next.js', 'Three.js & WebGL', 'Shader art', 'Motion design', 'Headless CMS', 'E-commerce', 'Accessibility audits', 'Performance', 'Creative tooling']

function Process() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (!root.current) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 2.5}`,
        pin: true,
        scrub: true,
        onUpdate: (s) => setActive(Math.min(STEPS.length - 1, Math.floor(s.progress * STEPS.length))),
      })
    })
    return () => mm.revert()
  }, [])
  return (
    <section ref={root} className="bg-ink py-24 text-bone lg:flex lg:h-screen lg:items-center lg:py-0" aria-labelledby="proc-h">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow mb-4 text-ash">( Process )</p>
          <h2 id="proc-h" className="h-display text-[clamp(2.6rem,6vw,5.5rem)]">
            Five stops
            <br />
            <span className="text-volt">one orbit</span>
          </h2>
          <div className="relative mt-12 hidden aspect-square w-[min(380px,80%)] lg:block" aria-hidden>
            <div className="absolute inset-0 rounded-full border border-bone/15" />
            <div className="absolute inset-[18%] rounded-full border border-bone/10" />
            {STEPS.map((_, i) => {
              const a = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2
              return (
                <span
                  key={i}
                  className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ${i <= active ? 'scale-125 bg-volt' : 'bg-bone/25'}`}
                  style={{ left: `${50 + Math.cos(a) * 50}%`, top: `${50 + Math.sin(a) * 50}%` }}
                />
              )
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="h-display text-[7rem] text-volt">{String(active + 1).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <ol className="space-y-2">
          {STEPS.map((s, i) => {
            const on = i === active
            return (
              <li key={s.t} className={`rounded-2xl border p-6 transition-all duration-500 sm:p-7 ${on ? 'border-volt bg-coal' : 'border-bone/10 lg:opacity-40'}`}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-bold uppercase tracking-tight">
                    <span className="mr-3 font-mono text-[12px] text-ash">0{i + 1}</span>
                    {s.t}
                  </h3>
                  <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">{s.w}</span>
                </div>
                <p className="mt-3 max-w-lg text-bone/70">{s.d}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

export default function Studio() {
  const root = useRef<HTMLDivElement>(null)
  const scroll = useRef(0)
  useScrollReveals(root)
  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: '.studio-hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => (scroll.current = s.progress) })
      gsap.utils.toArray<HTMLElement>('.cap').forEach((el, i) => {
        gsap.from(el, { opacity: 0, y: 30, rotate: i % 2 ? 4 : -4, duration: 0.8, ease: 'back.out(2)', delay: (i % 6) * 0.05, scrollTrigger: { trigger: el, start: 'top 92%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <div ref={root}>
      <section className="studio-hero relative overflow-hidden bg-bone pb-20 pt-36 sm:pt-44">
        <div className="pointer-events-none absolute -right-[20%] top-10 h-[70vh] w-[90vw] opacity-90 sm:-right-[10%] lg:w-[60vw]">
          <Suspense fallback={null}>
            <Blob scroll={scroll} colors={['#e7e4dc', '#5b4cff', '#d4ff3a']} className="h-full w-full" />
          </Suspense>
        </div>
        <div className="container-x relative">
          <p className="eyebrow mb-6 text-ash">( Studio )</p>
          <h1 className="h-display max-w-[11ch] text-[clamp(3.4rem,11vw,11rem)]" data-split>
            <Split text="Small team. Big gravity." />
          </h1>
          <div className="mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
            <p className="text-xl leading-relaxed" data-reveal>
              Orbit is eleven designers, developers and 3D artists in one room in Bengaluru, working with clients from Mumbai to Melbourne.
            </p>
            <p className="text-ash" data-reveal data-delay="0.1">
              We started in 2019 because we were tired of beautiful websites that loaded slowly and fast websites that felt like spreadsheets. Seven years later, we still believe you can have both. (Orbit is fictional, but the belief is real.)
            </p>
          </div>
        </div>
      </section>

      <div className="border-y border-ink/10 bg-bone py-6">
        <Marquee items={['Curious', 'Precise', 'Playful', 'Honest', 'Fast']} className="h-display text-[clamp(2rem,5vw,4.5rem)] text-ink/80" reverse />
      </div>

      <Process />

      <section className="bg-bone py-28 sm:py-36" aria-labelledby="cap-h">
        <div className="container-x">
          <h2 id="cap-h" className="h-display mb-14 text-[clamp(2.6rem,7vw,6.5rem)]" data-split>
            <Split text="Capabilities" />
          </h2>
          <ul className="flex flex-wrap gap-3">
            {CAPABILITIES.map((c, i) => (
              <li key={c} className={`cap rounded-full border px-6 py-3 font-display text-[clamp(1.1rem,2vw,1.7rem)] font-semibold transition-colors duration-300 hover:bg-ink hover:text-volt ${i % 5 === 0 ? 'border-ink bg-volt' : 'border-ink/20'}`}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper py-24" aria-label="Next">
        <div className="container-x flex flex-wrap items-end justify-between gap-8">
          <p className="h-display max-w-[14ch] text-[clamp(2.4rem,6vw,5rem)]" data-reveal>
            Seen enough? See the work.
          </p>
          <Link to="/work" className="pill border-ink bg-ink text-bone hover:bg-volt hover:text-ink" data-reveal>
            Browse projects <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}

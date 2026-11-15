import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { PROJECTS, projectBySlug } from '../data/work'
import { Artwork } from '../components/Artwork'
import { gsap, prefersReducedMotion, Split, useScrollReveals } from '../lib/motion'
import NotFound from './NotFound'

export default function CaseStudy() {
  const { slug = '' } = useParams()
  const p = projectBySlug(slug)
  const root = useRef<HTMLDivElement>(null)
  useScrollReveals(root, [slug])

  useEffect(() => {
    if (p) document.title = `${p.client} — Orbit Studio`
  }, [p])

  useEffect(() => {
    if (!root.current || !p || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.cs-hero-art', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.cs-hero', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from('.cs-hero', { clipPath: 'inset(18% 10% 18% 10% round 24px)', duration: 1.6, ease: 'expo.out', delay: 0.4 })
      gsap.utils.toArray<HTMLElement>('.cs-out').forEach((el) => {
        gsap.from(el, { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [p])

  if (!p) return <NotFound />
  const i = PROJECTS.indexOf(p)
  const next = PROJECTS[(i + 1) % PROJECTS.length]
  const pal = p.art.palette

  return (
    <div ref={root} style={{ ['--bg' as string]: pal.bg }}>
      <section className="bg-ink pb-16 pt-36 text-bone sm:pt-44">
        <div className="container-x">
          <Link to="/work" className="eyebrow text-ash hover:text-volt">
            ← All work
          </Link>
          <p className="eyebrow mt-10" style={{ color: pal.accent }}>
            {String(i + 1).padStart(2, '0')} — {p.client}
          </p>
          <h1 className="h-display mt-4 max-w-[14ch] text-[clamp(3rem,9vw,9rem)]" data-split>
            <Split text={p.title} />
          </h1>
          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-bone/15 pt-6 font-mono text-[12px] uppercase tracking-[0.12em] md:grid-cols-4" data-reveal>
            {[
              ['Client', p.client],
              ['Sector', p.sector],
              ['Year', String(p.year)],
              ['Disciplines', p.disciplines.join(', ')],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-ash">{k}</dt>
                <dd className="mt-1.5 text-bone">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="bg-ink">
        <div className="cs-hero relative h-[70vh] overflow-hidden sm:h-[92vh]">
          <div className="cs-hero-art absolute inset-0">
            <Artwork {...p.art} label={p.art.label ?? p.client.split(' ')[0]} alt={`Key visual for ${p.client}`} />
          </div>
        </div>
      </div>

      <section className="bg-bone py-24 sm:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] font-bold leading-tight tracking-tight" data-reveal>
            {p.summary}
          </p>
          <div className="space-y-12">
            <div data-reveal>
              <p className="eyebrow mb-3 text-ash">( The challenge )</p>
              <p className="text-lg leading-relaxed">{p.challenge}</p>
            </div>
            <div data-reveal>
              <p className="eyebrow mb-3 text-ash">( Our approach )</p>
              <p className="text-lg leading-relaxed">{p.approach}</p>
            </div>
            <div data-reveal>
              <p className="eyebrow mb-3 text-ash">( Services )</p>
              <ul className="flex flex-wrap gap-2">
                {p.services.map((s) => (
                  <li key={s} className="pill border-ink/20">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-bone pb-24" aria-label="Project visuals">
        <div className="container-x grid gap-6 md:grid-cols-12">
          {p.variants.map((v, k) => {
            const layout = ['md:col-span-7 aspect-[4/5]', 'md:col-span-5 md:mt-40 aspect-[3/4]', 'md:col-span-12 aspect-[16/8]'][k]
            return (
              <div key={k} className={`overflow-hidden rounded-md ${layout}`} data-speed={k === 1 ? '0.15' : '0'}>
                <Artwork style={v.style} seed={v.seed} palette={{ ...pal, ...v.palette }} label={p.client.split(' ')[0]} alt={`${p.client} visual ${k + 2}`} />
              </div>
            )
          })}
        </div>
      </section>

      <section className="py-24 sm:py-32" style={{ background: pal.bg, color: pal.fg }} aria-label="Results">
        <div className="container-x">
          <p className="eyebrow mb-12 opacity-70">( Results )</p>
          <div className="grid gap-12 md:grid-cols-3">
            {p.outcome.map((o) => (
              <div key={o.label} className="border-t pt-6" style={{ borderColor: `${pal.fg}33` }}>
                <p className="cs-out h-display text-[clamp(3.5rem,8vw,7.5rem)]" style={{ color: pal.accent }}>
                  {o.value}
                </p>
                <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.14em]">{o.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-14 text-[12px] opacity-60">Concept project: the client and results are fictional.</p>
        </div>
      </section>

      <Link to={`/work/${next.slug}`} className="group relative block overflow-hidden bg-ink text-bone" data-cursor="Next">
        <div className="absolute inset-0 opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60">
          <Artwork {...next.art} label={next.art.label ?? next.client.split(' ')[0]} alt="" />
        </div>
        <div className="container-x relative flex min-h-[60vh] flex-col justify-center py-24">
          <p className="eyebrow text-ash">Next project</p>
          <p className="h-display mt-4 flex items-center gap-4 text-[clamp(3rem,10vw,10rem)] transition-colors group-hover:text-volt">
            {next.client}
            <ArrowUpRight className="h-[0.6em] w-[0.6em] shrink-0 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
          </p>
        </div>
      </Link>
    </div>
  )
}

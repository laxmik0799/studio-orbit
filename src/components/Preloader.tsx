import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/** First-visit intro: a counter to 100, then the panel lifts away. Skipped on repeat visits in the same session. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [show] = useState(() => {
    try {
      return !sessionStorage.getItem('orbit-intro') && !prefersReducedMotion()
    } catch {
      return false
    }
  })
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!show) {
      onDone()
      return
    }
    try {
      sessionStorage.setItem('orbit-intro', '1')
    } catch {
      /* ignore */
    }
    const counter = { v: 0 }
    const tl = gsap.timeline({ onComplete: onDone })
    tl.to(counter, { v: 100, duration: 1.8, ease: 'power2.inOut', onUpdate: () => num.current && (num.current.textContent = String(Math.round(counter.v)).padStart(3, '0')) })
      .from('.pre-word', { yPercent: 110, stagger: 0.12, duration: 0.8, ease: 'expo.out' }, 0.1)
      .to('.pre-word', { yPercent: -110, stagger: 0.06, duration: 0.6, ease: 'expo.in' }, '-=0.1')
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=0.2')
      .set(root.current, { display: 'none' })
    return () => {
      tl.kill()
    }
  }, [show, onDone])

  if (!show) return null
  return (
    <div ref={root} className="fixed inset-0 z-[150] flex flex-col justify-between bg-ink p-6 text-bone sm:p-10" style={{ clipPath: 'inset(0 0 0% 0)' }} aria-hidden>
      <div className="flex justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-ash">
        <span>Orbit Studio</span>
        <span>Loading worlds</span>
      </div>
      <div className="h-display flex flex-wrap gap-x-[0.25em] text-[clamp(2.6rem,9vw,8rem)]">
        {['Brands', 'Sites', 'Worlds'].map((w) => (
          <span key={w} className="line-mask">
            <span className="pre-word inline-block">{w}</span>
          </span>
        ))}
      </div>
      <div className="flex items-end justify-between">
        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ash">Est. 2019 · Bengaluru</span>
        <span ref={num} className="h-display text-[clamp(4rem,14vw,12rem)] text-volt">
          000
        </span>
      </div>
    </div>
  )
}

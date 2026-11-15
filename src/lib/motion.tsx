import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

export const EASE = [0.76, 0, 0.24, 1] as const
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

const LenisCtx = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisCtx)

/** Smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const raf = useRef<(t: number) => void>()
  useEffect(() => {
    if (prefersReducedMotion()) return
    const l = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), touchMultiplier: 1.4 })
    l.on('scroll', ScrollTrigger.update)
    raf.current = (time: number) => l.raf(time * 1000)
    gsap.ticker.add(raf.current)
    gsap.ticker.lagSmoothing(0)
    setLenis(l)
    return () => {
      if (raf.current) gsap.ticker.remove(raf.current)
      l.destroy()
    }
  }, [])
  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>
}

/** Split a string into masked words (or letters) for reveal animations. */
export function Split({ text, by = 'word', className = '', inner = '' }: { text: string; by?: 'word' | 'char'; className?: string; inner?: string }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden whitespace-nowrap align-top pb-[0.08em]">
          {by === 'word' ? (
            <span className={`split-unit inline-block will-change-transform ${inner}`}>{w}</span>
          ) : (
            [...w].map((c, j) => (
              <span key={j} className={`split-unit inline-block will-change-transform ${inner}`}>
                {c}
              </span>
            ))
          )}
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

/** Reveal `.split-unit` children and `[data-reveal]` blocks as they scroll into view. */
export function useScrollReveals(scope: React.RefObject<HTMLElement>, deps: unknown[] = []) {
  useEffect(() => {
    if (!scope.current) return
    const reduce = prefersReducedMotion()
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        const units = el.querySelectorAll('.split-unit')
        if (reduce) return
        gsap.from(units, { yPercent: 110, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.03, scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        if (reduce) return
        gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', delay: Number(el.dataset.delay ?? 0), scrollTrigger: { trigger: el, start: 'top 90%' } })
      })
      gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
        if (reduce) return
        const speed = Number(el.dataset.speed)
        gsap.to(el, { yPercent: -speed * 100, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }, scope)
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => {
      clearTimeout(t)
      ctx.revert()
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

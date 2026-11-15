import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap, isFinePointer } from '../lib/motion'

/**
 * Custom cursor: a dot plus a ring that trails behind. Elements can set
 * `data-cursor="View"` (or any short label) to grow the ring and show text,
 * and `data-cursor="hide"` to hide it (e.g. over text inputs).
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [state, setState] = useState<'idle' | 'link' | 'label' | 'hidden'>('idle')
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isFinePointer()) return
    setEnabled(true)
    document.documentElement.classList.add('has-cursor')
    return () => document.documentElement.classList.remove('has-cursor')
  }, [])

  useEffect(() => setState('idle'), [pathname])

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08 })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      const tagged = t.closest<HTMLElement>('[data-cursor]')
      if (tagged) {
        const v = tagged.dataset.cursor!
        if (v === 'hide') return setState('hidden')
        setLabel(v)
        return setState('label')
      }
      if (t.closest('a, button, [role=button], label, select, summary')) return setState('link')
      if (t.closest('input, textarea')) return setState('hidden')
      setState('idle')
    }
    // Hide when the pointer leaves the window; the next pointerover restores the right state.
    const leave = () => setState('hidden')
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
    }
  }, [enabled])

  if (!enabled) return null
  const ringSize = state === 'label' ? 92 : state === 'link' ? 56 : 32
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <div ref={ring} className={`fixed left-0 top-0 ${state === 'label' ? '' : 'mix-blend-difference'}`}>
        <div
          className={`flex items-center justify-center rounded-full border transition-[width,height,background-color,opacity,border-color] duration-300 ease-out ${state === 'label' ? 'border-volt bg-volt' : 'border-bone'} ${state === 'hidden' ? 'opacity-0' : 'opacity-100'}`}
          style={{ width: ringSize, height: ringSize }}
        >
          <span className={`font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-opacity duration-200 ${state === 'label' ? 'opacity-100' : 'opacity-0'}`}>
            {label}
          </span>
        </div>
      </div>
      <div ref={dot} className={`fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-bone mix-blend-difference transition-opacity ${state === 'label' || state === 'hidden' ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  )
}

/** Wraps a child so it is pulled toward the pointer when hovered. */
export function Magnetic({ children, strength = 0.35, className = '' }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer()) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const reset = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', reset)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', reset)
    }
  }, [strength])
  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}

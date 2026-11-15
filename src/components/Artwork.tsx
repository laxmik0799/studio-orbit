import { useEffect, useRef } from 'react'
import { drawArt, type ArtStyle, type Palette } from '../lib/art'

interface Props {
  style: ArtStyle
  seed: number
  palette: Palette
  label?: string
  className?: string
  alt: string
}

/** Canvas that redraws its generative artwork whenever its size changes. */
export function Artwork({ style, seed, palette, label, className = '', alt }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    let last = ''
    const draw = () => {
      const r = c.getBoundingClientRect()
      if (!r.width || !r.height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const key = `${Math.round(r.width)}x${Math.round(r.height)}@${dpr}`
      if (key === last) return
      last = key
      c.width = Math.round(r.width * dpr)
      c.height = Math.round(r.height * dpr)
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.scale(dpr, dpr)
      drawArt(ctx, r.width, r.height, style, seed, palette, label)
    }
    const ro = new ResizeObserver(draw)
    ro.observe(c)
    // Typographic art needs the display font before drawing.
    document.fonts?.ready.then(() => {
      last = ''
      draw()
    })
    return () => ro.disconnect()
  }, [style, seed, palette, label])
  return <canvas ref={ref} role="img" aria-label={alt} className={`block h-full w-full ${className}`} />
}

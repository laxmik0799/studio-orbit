/**
 * Generative cover art for the (fictional) case studies.
 * Every image is drawn in code from a seed, so the gallery needs no stock photos.
 */

export type ArtStyle = 'orbits' | 'flow' | 'grid' | 'type' | 'blobs' | 'shapes' | 'stripes'

export interface Palette {
  bg: string
  fg: string
  accent: string
  soft: string
}

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Smooth 2D value noise. */
function noise2(seed: number) {
  const r = rng(seed)
  const perm = Array.from({ length: 512 }, () => r())
  const at = (x: number, y: number) => perm[(((x * 73856093) ^ (y * 19349663)) >>> 0) % 512]
  const fade = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y)
    const xf = x - xi, yf = y - yi
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1)
    const u = fade(xf), v = fade(yf)
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
  }
}

export function drawArt(ctx: CanvasRenderingContext2D, w: number, h: number, style: ArtStyle, seed: number, p: Palette, label = '') {
  const r = rng(seed)
  const s = Math.min(w, h)
  ctx.save()
  ctx.fillStyle = p.bg
  ctx.fillRect(0, 0, w, h)

  switch (style) {
    case 'orbits': {
      const cx = w * (0.45 + r() * 0.15), cy = h * (0.45 + r() * 0.1)
      for (let i = 0; i < 26; i++) {
        const rad = s * 0.04 + i * s * 0.028
        ctx.beginPath()
        const start = r() * Math.PI * 2
        ctx.arc(cx, cy, rad, start, start + Math.PI * (0.6 + r() * 1.3))
        ctx.strokeStyle = i % 5 === 0 ? p.accent : p.fg
        ctx.globalAlpha = i % 5 === 0 ? 1 : 0.55
        ctx.lineWidth = i % 5 === 0 ? s * 0.012 : s * 0.004
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = p.accent
      ctx.beginPath()
      ctx.arc(cx, cy, s * 0.07, 0, Math.PI * 2)
      ctx.fill()
      for (let i = 0; i < 5; i++) {
        const a = r() * Math.PI * 2, d = s * (0.12 + r() * 0.3)
        ctx.fillStyle = i % 2 ? p.fg : p.soft
        ctx.beginPath()
        ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, s * (0.01 + r() * 0.02), 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'flow': {
      const n = noise2(seed)
      const scale = 2.6 / s
      ctx.lineWidth = Math.max(1, s * 0.0028)
      for (let i = 0; i < 900; i++) {
        let x = r() * w, y = r() * h
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.strokeStyle = r() < 0.12 ? p.accent : p.fg
        ctx.globalAlpha = 0.18 + r() * 0.5
        for (let k = 0; k < 40; k++) {
          const a = n(x * scale, y * scale) * Math.PI * 4
          x += Math.cos(a) * s * 0.008
          y += Math.sin(a) * s * 0.008
          ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      break
    }
    case 'grid': {
      const horizon = h * (0.42 + r() * 0.1)
      const g = ctx.createLinearGradient(0, 0, 0, horizon)
      g.addColorStop(0, p.bg)
      g.addColorStop(1, p.soft)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, horizon)
      ctx.fillStyle = p.accent
      ctx.beginPath()
      ctx.arc(w / 2, horizon, s * 0.2, Math.PI, 0)
      ctx.fill()
      ctx.fillStyle = p.bg
      for (let i = 0; i < 6; i++) ctx.fillRect(w / 2 - s * 0.21, horizon - s * 0.03 * (i + 1) - i * i * 1.2, s * 0.42, s * 0.006 + i * 0.6)
      ctx.strokeStyle = p.fg
      ctx.globalAlpha = 0.85
      ctx.lineWidth = Math.max(1, s * 0.003)
      for (let i = -14; i <= 14; i++) {
        ctx.beginPath()
        ctx.moveTo(w / 2 + i * s * 0.015, horizon)
        ctx.lineTo(w / 2 + i * w * 0.16, h)
        ctx.stroke()
      }
      for (let i = 1; i < 14; i++) {
        const y = horizon + Math.pow(i / 14, 2.2) * (h - horizon)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      break
    }
    case 'type': {
      const word = (label || 'ORBIT').toUpperCase()
      ctx.fillStyle = p.fg
      ctx.textBaseline = 'alphabetic'
      const rows = 5
      for (let i = 0; i < rows; i++) {
        const size = h / (rows - 0.6)
        ctx.font = `800 ${size}px Syne, sans-serif`
        ctx.globalAlpha = i === 2 ? 1 : 0.14 + i * 0.05
        ctx.fillStyle = i === 2 ? p.accent : p.fg
        const tw = ctx.measureText(word).width
        const x = ((i * 0.37 + r() * 0.3) % 1) * -tw * 0.5
        ctx.fillText(word + ' ' + word, x, size * (i + 0.86))
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = p.soft
      ctx.font = `500 ${s * 0.03}px "JetBrains Mono", monospace`
      ctx.fillText('NO. ' + String(seed % 97).padStart(2, '0'), s * 0.05, h - s * 0.05)
      break
    }
    case 'blobs': {
      ctx.globalCompositeOperation = 'source-over'
      for (let i = 0; i < 7; i++) {
        const x = r() * w, y = r() * h, rad = s * (0.25 + r() * 0.45)
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad)
        const c = [p.accent, p.fg, p.soft][i % 3]
        g.addColorStop(0, c)
        g.addColorStop(1, 'transparent')
        ctx.globalAlpha = 0.7
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }
      ctx.globalAlpha = 0.08
      for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = r() < 0.5 ? '#000' : '#fff'
        ctx.fillRect(r() * w, r() * h, 1.5, 1.5)
      }
      break
    }
    case 'shapes': {
      const cols = 6, cell = w / cols
      const rows = Math.ceil(h / cell)
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const px = x * cell, py = y * cell
          const t = Math.floor(r() * 5)
          ctx.fillStyle = [p.fg, p.accent, p.soft, p.fg, p.bg][Math.floor(r() * 5)]
          ctx.beginPath()
          if (t === 0) ctx.arc(px + cell / 2, py + cell / 2, cell * 0.42, 0, Math.PI * 2)
          else if (t === 1) ctx.rect(px + cell * 0.1, py + cell * 0.1, cell * 0.8, cell * 0.8)
          else if (t === 2) {
            ctx.moveTo(px, py + cell)
            ctx.lineTo(px + cell, py + cell)
            ctx.lineTo(px + (r() < 0.5 ? 0 : cell), py)
          } else if (t === 3) ctx.arc(px + (r() < 0.5 ? 0 : cell), py + cell, cell, -Math.PI / 2, 0)
          ctx.fill()
        }
      break
    }
    case 'stripes': {
      const cx = w * 0.5, cy = h * 0.5
      ctx.strokeStyle = p.fg
      ctx.lineWidth = Math.max(1, s * 0.006)
      for (let i = 0; i < 90; i++) {
        ctx.beginPath()
        ctx.arc(cx - s * 0.08, cy, i * s * 0.012, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.strokeStyle = p.accent
      ctx.globalAlpha = 0.9
      for (let i = 0; i < 90; i++) {
        ctx.beginPath()
        ctx.arc(cx + s * 0.08, cy + s * 0.02, i * s * 0.012, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    }
  }
  ctx.restore()
}

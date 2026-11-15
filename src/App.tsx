import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, PresenceContext, motion } from 'framer-motion'
import { Cursor } from './components/Cursor'
import { Footer, Nav } from './components/Layout'
import { Preloader } from './components/Preloader'
import { EASE, ScrollTrigger, SmoothScroll, useLenis } from './lib/motion'
import Home from './pages/Home'

const Work = lazy(() => import('./pages/Work'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))
const Studio = lazy(() => import('./pages/Studio'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

const TITLES: Record<string, string> = { '/work': 'Work', '/studio': 'Studio', '/contact': 'Contact' }

/** Each page enters behind a curtain that wipes away, and leaves behind one that wipes in. */
function Page({ children, label }: { children: ReactNode; label: string }) {
  const lenis = useLenis()
  useLayoutEffect(() => {
    lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0)
    const t = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(t)
  }, [lenis])
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.4 } }} exit={{ opacity: 1 }}>
        {/* Isolate page internals from the route-level presence, so their own
            layout/exit animations can never hold up (or block) the page transition. */}
        <PresenceContext.Provider value={null}>{children}</PresenceContext.Provider>
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-ink"
        initial={{ clipPath: 'inset(0 0 0% 0)' }}
        animate={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease: EASE, delay: 0.15 } }}
        exit={{ clipPath: 'inset(0% 0 0 0)', transition: { duration: 0.7, ease: EASE } }}
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      >
        <span className="h-display text-[clamp(2.5rem,8vw,7rem)] text-bone">{label}</span>
      </motion.div>
    </>
  )
}

export default function App() {
  const location = useLocation()
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    const base = location.pathname.startsWith('/work/') ? 'Case study' : TITLES[location.pathname]
    if (!location.pathname.startsWith('/work/')) document.title = base ? `${base} — Orbit Studio` : 'Orbit Studio — Brands, Websites & 3D Worlds That Move'
  }, [location.pathname])

  const label = location.pathname === '/' ? 'Orbit' : location.pathname.startsWith('/work/') ? 'Case study' : (TITLES[location.pathname] ?? 'Lost')

  return (
    <SmoothScroll>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-volt focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Preloader onDone={done} />
      <Cursor />
      <Nav />
      <AnimatePresence mode="wait" initial={false}>
        <Page key={location.pathname} label={label}>
          <main id="main">
            <Suspense fallback={<div className="min-h-screen bg-ink" />}>
              <Routes location={location}>
                <Route path="/" element={<Home ready={ready} />} />
                <Route path="/work" element={<Work />} />
                <Route path="/work/:slug" element={<CaseStudy />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </Page>
      </AnimatePresence>
    </SmoothScroll>
  )
}

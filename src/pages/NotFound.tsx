import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Lost in space — Orbit Studio'
  }, [])
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-bone">
      <p className="eyebrow text-ash">Error 404</p>
      <h1 className="h-display mt-4 text-[clamp(4rem,18vw,16rem)]">
        Lost in <span className="text-volt">space</span>
      </h1>
      <p className="mt-6 max-w-md text-bone/70">This page drifted out of orbit. Let’s get you back to somewhere with gravity.</p>
      <Link to="/" className="pill mt-10 border-bone/30 hover:border-volt hover:bg-volt hover:text-ink">
        Back to home
      </Link>
    </section>
  )
}

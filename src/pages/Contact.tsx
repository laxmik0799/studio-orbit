import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Info } from 'lucide-react'
import { Split, useScrollReveals } from '../lib/motion'
import { Magnetic } from '../components/Cursor'

const SERVICES = ['Branding', 'Website', '3D & WebGL', 'Motion', 'Campaign', 'Not sure yet']
const BUDGETS = ['Under ₹5L', '₹5L–15L', '₹15L–40L', '₹40L+']

type Errors = Partial<Record<'name' | 'email' | 'message' | 'services', string>>

export default function Contact() {
  const root = useRef<HTMLDivElement>(null)
  useScrollReveals(root)
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [services, setServices] = useState<string[]>([])
  const [budget, setBudget] = useState(BUDGETS[1])
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  const validate = (): Errors => {
    const e: Errors = {}
    if (form.name.trim().length < 2) e.name = 'Tell us your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = 'That email doesn’t look right'
    if (!services.length) e.services = 'Pick at least one'
    if (form.message.trim().length < 20) e.message = 'A sentence or two (20+ characters) helps us reply properly'
    return e
  }

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus()
      return
    }
    setStatus('sending')
    // Demo only: nothing is sent anywhere.
    setTimeout(() => setStatus('done'), 1200)
  }

  const field = (k: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="eyebrow text-ash">{label}</span>
      <input
        name={k}
        value={form[k]}
        onChange={(e) => {
          setForm((f) => ({ ...f, [k]: e.target.value }))
          setErrors((er) => ({ ...er, [k]: undefined }))
        }}
        aria-invalid={!!errors[k as keyof Errors]}
        aria-describedby={errors[k as keyof Errors] ? `${k}-err` : undefined}
        className={`mt-2 w-full border-b bg-transparent py-3 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-semibold outline-none transition-colors placeholder:text-ink/25 focus:border-ink ${errors[k as keyof Errors] ? 'border-[#e5484d]' : 'border-ink/25'}`}
        {...props}
      />
      {errors[k as keyof Errors] && (
        <span id={`${k}-err`} role="alert" className="mt-2 block text-sm text-[#e5484d]">
          {errors[k as keyof Errors]}
        </span>
      )}
    </label>
  )

  const chip = (on: boolean) => `pill ${on ? 'border-ink bg-ink text-volt' : 'border-ink/25 hover:border-ink'}`

  return (
    <div ref={root} className="min-h-screen bg-bone pb-28 pt-36 sm:pt-44">
      <div className="container-x">
        <h1 className="h-display text-[clamp(3.4rem,12vw,12rem)]" data-split>
          <Split text="Say hello" />
        </h1>
        <div className="mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-ink/15 bg-paper p-4 text-sm" role="note" data-reveal>
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden />
          <p>
            <strong className="font-semibold">Demo form.</strong> Orbit Studio is fictional, so submitting validates your details and shows a confirmation, but nothing is sent or stored.
          </p>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_340px]">
          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div key="done" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-start" role="status">
                <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-volt">
                  <Check size={34} />
                </motion.span>
                <h2 className="h-display mt-8 text-[clamp(2.6rem,6vw,5.5rem)]">Thanks, {form.name.trim().split(' ')[0]}!</h2>
                <p className="mt-4 max-w-lg text-lg text-ash">In a real studio we’d reply to {form.email.trim()} within two working days. This one is a demo, so no message was sent.</p>
                <button
                  type="button"
                  className="pill mt-8 border-ink/25 hover:border-ink"
                  onClick={() => {
                    setForm({ name: '', email: '', company: '', message: '' })
                    setServices([])
                    setStatus('idle')
                  }}
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0, y: -20 }} onSubmit={submit} noValidate className="space-y-12">
                <div className="grid gap-10 md:grid-cols-2">
                  {field('name', 'Your name', { autoComplete: 'name', placeholder: 'Ananya Rao' })}
                  {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'ananya@company.in' })}
                </div>
                {field('company', 'Company (optional)', { autoComplete: 'organization', placeholder: 'Company name' })}

                <fieldset>
                  <legend className="eyebrow text-ash">What do you need?</legend>
                  <div className="mt-4 flex flex-wrap gap-2" role="group">
                    {SERVICES.map((s) => {
                      const on = services.includes(s)
                      return (
                        <button
                          key={s}
                          type="button"
                          name={s === SERVICES[0] ? 'services' : undefined}
                          aria-pressed={on}
                          onClick={() => {
                            setServices((v) => (on ? v.filter((x) => x !== s) : [...v, s]))
                            setErrors((er) => ({ ...er, services: undefined }))
                          }}
                          className={chip(on)}
                        >
                          {s}
                        </button>
                      )
                    })}
                  </div>
                  {errors.services && (
                    <span role="alert" className="mt-2 block text-sm text-[#e5484d]">
                      {errors.services}
                    </span>
                  )}
                </fieldset>

                <fieldset>
                  <legend className="eyebrow text-ash">Budget</legend>
                  <div className="mt-4 flex flex-wrap gap-2" role="radiogroup">
                    {BUDGETS.map((b) => (
                      <button key={b} type="button" role="radio" aria-checked={budget === b} onClick={() => setBudget(b)} className={chip(budget === b)}>
                        {b}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="eyebrow text-ash">Tell us about it</span>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, message: e.target.value }))
                      setErrors((er) => ({ ...er, message: undefined }))
                    }}
                    placeholder="Goals, timelines, links, wild ideas…"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-err' : undefined}
                    className={`mt-2 w-full resize-none border-b bg-transparent py-3 text-xl outline-none transition-colors placeholder:text-ink/25 focus:border-ink ${errors.message ? 'border-[#e5484d]' : 'border-ink/25'}`}
                  />
                  {errors.message && (
                    <span id="message-err" role="alert" className="mt-2 block text-sm text-[#e5484d]">
                      {errors.message}
                    </span>
                  )}
                </label>

                <Magnetic>
                  <button type="submit" disabled={status === 'sending'} className="group relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-ink text-bone disabled:opacity-70" data-cursor="Send">
                    <span className="absolute inset-0 scale-0 rounded-full bg-volt transition-transform duration-500 group-hover:scale-100" aria-hidden />
                    <span className="relative flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] group-hover:text-ink">
                      {status === 'sending' ? 'Sending…' : 'Send'} <ArrowUpRight size={14} />
                    </span>
                  </button>
                </Magnetic>
              </motion.form>
            )}
          </AnimatePresence>

          <aside className="space-y-10 font-mono text-[12px] uppercase tracking-[0.14em]" data-reveal>
            <div>
              <p className="text-ash">New business</p>
              <p className="mt-2 normal-case tracking-normal">hello@orbit.studio.example</p>
            </div>
            <div>
              <p className="text-ash">Studio</p>
              <p className="mt-2 normal-case leading-relaxed tracking-normal">A made-up loft somewhere in Indiranagar, Bengaluru</p>
            </div>
            <div>
              <p className="text-ash">Response time</p>
              <p className="mt-2 normal-case tracking-normal">Two working days (in a real studio)</p>
            </div>
            <p className="normal-case leading-relaxed tracking-normal text-ash">The email address uses the reserved .example domain, so it cannot receive mail.</p>
          </aside>
        </div>
      </div>
    </div>
  )
}

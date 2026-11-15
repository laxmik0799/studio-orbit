import type { ArtStyle, Palette } from '../lib/art'

/**
 * Case studies for Orbit Studio, a fictional agency.
 * Clients, results and copy are invented for this portfolio project.
 */

export type Discipline = 'Branding' | 'Digital' | '3D & Motion' | 'Campaign'
export const DISCIPLINES: Discipline[] = ['Branding', 'Digital', '3D & Motion', 'Campaign']

export interface Project {
  slug: string
  client: string
  title: string
  year: number
  disciplines: Discipline[]
  sector: string
  summary: string
  challenge: string
  approach: string
  outcome: { value: string; label: string }[]
  services: string[]
  art: { style: ArtStyle; seed: number; palette: Palette; label?: string }
  variants: { style: ArtStyle; seed: number; palette?: Partial<Palette> }[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'kora-coffee',
    client: 'Kora Coffee',
    title: 'A ritual in every cup',
    year: 2026,
    disciplines: ['Branding', 'Digital'],
    sector: 'Food & drink',
    summary: 'Identity and e-commerce for a Bengaluru micro-roastery growing from one café to a national subscription brand.',
    challenge: 'Kora had loyal regulars but a look that felt like every other third-wave café. They needed a system that could stretch from a 60 ml sample sachet to a storefront in Indiranagar.',
    approach: 'We built the identity around the orbit of a cup seen from above: rings that change with each roast profile. The rings drive packaging, the subscription site and an animated roast tracker.',
    outcome: [
      { value: '3.4×', label: 'subscription sign-ups' },
      { value: '41%', label: 'repeat purchase rate' },
      { value: '12', label: 'roast rings, one system' },
    ],
    services: ['Brand strategy', 'Visual identity', 'Packaging', 'Shopify build'],
    art: { style: 'orbits', seed: 41, palette: { bg: '#1c1410', fg: '#f3e6d4', accent: '#e8603c', soft: '#a57b5a' } },
    variants: [
      { style: 'orbits', seed: 7 },
      { style: 'shapes', seed: 19 },
      { style: 'type', seed: 23 },
    ],
  },
  {
    slug: 'monsoon-records',
    client: 'Monsoon Records',
    title: 'Sound you can see',
    year: 2026,
    disciplines: ['3D & Motion', 'Campaign'],
    sector: 'Music',
    summary: 'Generative album artwork and launch films for an independent label releasing twelve records in twelve months.',
    challenge: 'Twelve releases, one tiny team, and a label that wanted every cover to feel handmade without hiring twelve illustrators.',
    approach: 'We wrote a generative system that turns each track’s waveform into a flow field. Every single, cover and canvas loop is unique, yet unmistakably Monsoon.',
    outcome: [
      { value: '2.1M', label: 'streams in launch month' },
      { value: '120+', label: 'unique assets generated' },
      { value: '1', label: 'designer needed' },
    ],
    services: ['Generative design', 'Motion', 'Social campaign', 'Creative tooling'],
    art: { style: 'flow', seed: 77, palette: { bg: '#0b1020', fg: '#9fb4ff', accent: '#d4ff3a', soft: '#3b4a8f' } },
    variants: [
      { style: 'flow', seed: 12 },
      { style: 'blobs', seed: 5 },
      { style: 'stripes', seed: 9 },
    ],
  },
  {
    slug: 'atlas-mobility',
    client: 'Atlas Mobility',
    title: 'The road, rendered',
    year: 2025,
    disciplines: ['Digital', '3D & Motion'],
    sector: 'Electric vehicles',
    summary: 'A real-time 3D configurator and launch site for an electric scooter built for Indian cities.',
    challenge: 'Riders wanted to see colours, range and accessories before visiting a showroom, on mid-range phones and patchy 4G.',
    approach: 'A WebGL configurator streams compressed models progressively and falls back to video on low-end devices. A synthwave route-planner shows real range on your own commute.',
    outcome: [
      { value: '68%', label: 'configurator completion' },
      { value: '1.8s', label: 'first render on 4G' },
      { value: '+29%', label: 'test-ride bookings' },
    ],
    services: ['Product design', 'WebGL development', '3D art direction', 'Performance'],
    art: { style: 'grid', seed: 12, palette: { bg: '#12051f', fg: '#ff4fd8', accent: '#ffb627', soft: '#3a0d63' } },
    variants: [
      { style: 'grid', seed: 30 },
      { style: 'orbits', seed: 44 },
      { style: 'flow', seed: 2 },
    ],
  },
  {
    slug: 'saffron-and-salt',
    client: 'Saffron & Salt',
    title: 'Louder than the kitchen',
    year: 2025,
    disciplines: ['Branding', 'Campaign'],
    sector: 'Hospitality',
    summary: 'A loud, typographic identity for a coastal-Indian restaurant group opening in Mumbai, Goa and Kochi.',
    challenge: 'Three cities, three menus, one name. The brand had to feel local everywhere without becoming three brands.',
    approach: 'Oversized type that bleeds off every surface, from menus to delivery bags, with a colour for each city’s spice. The signage alone stops traffic on Linking Road.',
    outcome: [
      { value: '3', label: 'cities, one system' },
      { value: '9 wks', label: 'concept to opening' },
      { value: '40K', label: 'organic social reach' },
    ],
    services: ['Naming support', 'Identity', 'Environmental graphics', 'Launch campaign'],
    art: { style: 'type', seed: 54, palette: { bg: '#f4b41a', fg: '#1a1a1a', accent: '#b5161b', soft: '#7a3e00' }, label: 'Saffron' },
    variants: [
      { style: 'type', seed: 8 },
      { style: 'shapes', seed: 61 },
      { style: 'stripes', seed: 14 },
    ],
  },
  {
    slug: 'helix-bio',
    client: 'Helix Bio',
    title: 'Science, softened',
    year: 2025,
    disciplines: ['Branding', 'Digital'],
    sector: 'Biotech',
    summary: 'Brand and website for a diagnostics start-up making genetic screening understandable for families.',
    challenge: 'Genetic testing sounds frightening. Helix needed to feel trustworthy to doctors and gentle to parents at the same time.',
    approach: 'Soft, living gradients replace sterile lab imagery, and every result is explained in plain language with motion that guides rather than alarms.',
    outcome: [
      { value: '−38%', label: 'support calls about results' },
      { value: '4.8/5', label: 'clarity rating in user tests' },
      { value: 'AA', label: 'WCAG conformance' },
    ],
    services: ['Brand identity', 'UX writing', 'Web design', 'Accessibility'],
    art: { style: 'blobs', seed: 31, palette: { bg: '#e9f0ff', fg: '#6c8cff', accent: '#ff9bd2', soft: '#7de2d1' } },
    variants: [
      { style: 'blobs', seed: 3 },
      { style: 'flow', seed: 66 },
      { style: 'orbits', seed: 15 },
    ],
  },
  {
    slug: 'paper-planes',
    client: 'Paper Planes',
    title: 'Learning that plays back',
    year: 2024,
    disciplines: ['Digital', 'Campaign'],
    sector: 'Education',
    summary: 'A playful learning app and brand for children aged 6–10, in English, Hindi and Tamil.',
    challenge: 'Kids’ apps are either joyful or educational. Paper Planes wanted both, plus a calm experience parents trust.',
    approach: 'A kit of 40 geometric shapes that children combine into creatures, letters and maps. The same kit builds the brand, the app UI and the classroom posters.',
    outcome: [
      { value: '500K', label: 'downloads in year one' },
      { value: '22 min', label: 'average daily session' },
      { value: '3', label: 'languages at launch' },
    ],
    services: ['Product strategy', 'App design', 'Illustration system', 'Brand'],
    art: { style: 'shapes', seed: 88, palette: { bg: '#fff6e5', fg: '#2b59ff', accent: '#ff5a36', soft: '#ffc93c' } },
    variants: [
      { style: 'shapes', seed: 4 },
      { style: 'type', seed: 32 },
      { style: 'orbits', seed: 50 },
    ],
  },
  {
    slug: 'northwind-museum',
    client: 'Northwind Museum',
    title: 'Interference patterns',
    year: 2024,
    disciplines: ['3D & Motion', 'Digital'],
    sector: 'Culture',
    summary: 'An exhibition identity and interactive microsite for a show about light, waves and perception.',
    challenge: 'How do you advertise an exhibition whose works only make sense in person?',
    approach: 'We used moiré, the illusion you get when two patterns overlap, so posters shift as you walk past them. Online, your cursor becomes the second pattern.',
    outcome: [
      { value: '+52%', label: 'ticket pre-sales' },
      { value: '6 min', label: 'average microsite visit' },
      { value: '1', label: 'very confused pigeon' },
    ],
    services: ['Exhibition identity', 'Interactive microsite', 'Print', 'Motion'],
    art: { style: 'stripes', seed: 21, palette: { bg: '#f1efe9', fg: '#0d0d0d', accent: '#2f5bff', soft: '#8a877f' } },
    variants: [
      { style: 'stripes', seed: 70 },
      { style: 'grid', seed: 13 },
      { style: 'blobs', seed: 90 },
    ],
  },
]

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)

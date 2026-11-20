---
name: Thodi
order: 7
icon: ../../assets/icons/thodi.svg
tagline: Farmers sell straight to their neighbours. Malayalam first.
status: Android, version 1.5
theme:
  bg: '#F7F3E8'
  fg: '#3A2E22'
  muted: '#7A6A58'
  accent: '#2F6B43'
  onAccent: '#F7F3E8'
  line: '#E3DCCB'
  display: "'Noto Sans Malayalam', system-ui, sans-serif"
  fonts: family=Noto+Sans+Malayalam:wght@500;700
stats:
  - { value: 'മ', label: Malayalam first, English second }
  - { value: 'Vetted', label: every seller approved before listing }
  - { value: '1.5', label: current Android release }
what: "A marketplace for rural Kerala. Farmers list what they've grown, neighbours order before a deadline, and every listing can be shared on WhatsApp. It should feel like a market stall, not a delivery app."
hardTitle: "Built for the people who'll use it"
links:
  - { label: Open thodi.vercel.app, href: 'https://thodi.vercel.app', primary: true }
notes:
  stack: [Expo, NativeWind, Reanimated, i18next, Supabase]
  tests: Database tests on PGlite
  platforms: Android and web
  when: 2026
---

The interface is Malayalam first. Sellers apply and are approved before they can list, orders have deadlines, and disputes and refunds have a proper flow with an admin screen.

Phone sign-in runs through a Supabase edge function, every table has row-level security, and the database tests run locally on PGlite. Razorpay escrow payments are built and switched off until they're needed. The whole apply, approve and sell loop also works offline in a demo mode.

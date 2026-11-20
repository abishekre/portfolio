---
name: ByTwo
order: 2
icon: ../../assets/icons/bytwo.svg
tagline: Split bills with friends and settle up over UPI. Encrypted before it leaves your phone.
status: Live on the web
theme:
  bg: '#FFFDF5'
  fg: '#111111'
  muted: '#5C5A52'
  accent: '#E0E722'
  onAccent: '#111111'
  line: '#111111'
  display: "'Space Grotesk', system-ui, sans-serif"
  body: "'Space Grotesk', system-ui, sans-serif"
  fonts: family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@700
stats:
  - { value: '0', label: bytes of plaintext on the server }
  - { value: '4', label: ways to split a bill }
  - { value: '64', label: commits in the rebuild }
what: An open-source Splitwise alternative made for India. Add a bill, see who owes whom, and settle up with a UPI hand-off. Friends join from a WhatsApp link without installing anything.
hardTitle: A ledger that can't disagree with itself
links:
  - { label: Open bytwo.vercel.app, href: 'https://bytwo.vercel.app', primary: true }
screens:
  - ../../assets/media/bytwo/live-1.png
  - ../../assets/media/bytwo/live-2.png
  - ../../assets/media/bytwo/live-3.png
screensAlt: ByTwo's welcome screens
notes:
  stack: [Expo, React Native, TypeScript, Supabase, '@noble crypto', Playwright]
  tests: Vitest, Playwright, a multi-device sync simulator
  platforms: Android and web (installable)
  when: Rebuilt October 2026
---

Every change in ByTwo is an operation, not an overwrite. Each one is stamped with a hybrid logical clock, and every phone replays and merges the same operations in the same order. Two people can edit the same bill offline and still end up with the same balances. A simulator runs many devices against each other in the tests to prove they converge.

The server never sees a bill. It stores ciphertext and checks who belongs to which group, and that's all. Bill photos are encrypted on the phone before upload, and a QR recovery code gets you back in on a new device.

This is the second ByTwo. The first one worked but grew too loud and too tangled, so I wrote down what went wrong and rebuilt it with every money rule in one pure TypeScript module.

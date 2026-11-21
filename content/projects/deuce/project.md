---
name: Deuce
tagline: The referee scores on a phone. The whole hall follows live.
status: Built · its live database is switched off for now
theme:
  bg: '#F3F1EB'
  fg: '#17191C'
  muted: '#62656B'
  accent: '#17191C'
  onAccent: '#F3F1EB'
  line: '#E0DDD3'
  display: "'Inter Tight', system-ui, sans-serif"
stats:
  - { value: 'BWF', label: group standings, to the letter }
  - { value: '0', label: scores stored. All rebuilt from rallies. }
  - { value: 'Live', label: public link for spectators }
what: "Tournament software for small badminton organisers. A referee taps point by point, spectators follow on a public link, and it keeps working when the sports-hall wifi doesn't."
hardTitle: "A score you can't corrupt"
github: https://github.com/abishekre/Deuce
screensAlt: Deuce's new-match screen
notes:
  stack: [Expo, React Native Web, Supabase Realtime, TanStack Query, expo-sqlite, Workbox]
  tests: Vitest with property-based tests
  platforms: Web (installable) and Android
  when: 2026, in progress
---

Deuce never stores the score. It keeps a log of rallies and rebuilds the score from it, so undo is just another entry and the audit trail stays intact.

The scoring rules are pure code with property-based tests, and group standings follow the official BWF regulations exactly, tie-breaks included. Side A is vermilion and side B is blue, chosen so colour-blind spectators can still tell them apart.

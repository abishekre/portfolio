---
name: Rally
order: 9
tagline: Fair doubles rotations for a weekend badminton group.
status: Installable web app
theme:
  bg: '#EBF1EC'
  fg: '#10231F'
  muted: '#5C716B'
  accent: '#0F5C52'
  onAccent: '#EBF1EC'
  line: '#D3DFD8'
  display: "'Barlow Semi Condensed', system-ui, sans-serif"
  fonts: family=Barlow+Semi+Condensed:wght@500;700
stats:
  - { value: '2×', label: cost for a repeat partner vs. a repeat opponent }
  - { value: '9', label: tests on the rotation engine }
  - { value: '0', label: servers. It works offline. }
what: Twelve people, two courts, and someone always ends up partnering the same friend. Rally decides who plays next so everyone gets fair games and new partners.
hardTitle: Fairness as a cost function
screensAlt: Rally's court and roster screens
notes:
  stack: [React, Vite, TypeScript, Tailwind, Zustand, Framer Motion]
  tests: Vitest
  platforms: Web (installable)
  when: 2026
---

The rotation engine scores every possible next match. Repeating a partner costs twice as much as facing the same opponent again, and players who have been resting move up the queue.

The engine is plain TypeScript with nine tests. Around it is a three-screen app (set up, play, summary) that installs to the home screen and works without a connection.

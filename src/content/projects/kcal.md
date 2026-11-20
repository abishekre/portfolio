---
name: Kcal
order: 3
icon: ../../assets/icons/kcal.png
tagline: A calorie tracker that knows puttu, appam and Bangalore biryani.
status: Live on the web and Android
theme:
  bg: '#0A0A0B'
  fg: '#F2F2EE'
  muted: '#8A8A85'
  accent: '#D4FF3A'
  onAccent: '#0A0A0B'
  line: '#232326'
  display: "'Geist', system-ui, sans-serif"
  fonts: family=Geist:wght@400;500;600;700
stats:
  - { value: 'IFCT', label: 2017 food tables behind every number }
  - { value: 'Offline', label: first, syncing in the background }
  - { value: '2', label: themes, contrast checked by tests }
what: Most calorie apps think dinner is a burger. Kcal starts from what people in Kerala and Bangalore actually eat, and tracks macros, water, weight and workouts without needing a connection.
hardTitle: Numbers you can check
links:
  - { label: Open kcal.abishekre.in, href: 'https://kcal.abishekre.in', primary: true }
notes:
  stack: [Expo, React Native, TypeScript, SQLite, Supabase, Zustand]
  tests: Vitest, including sync and colour-contrast tests
  platforms: Android and web (installable)
  when: Rebuilt 2026
---

Every nutrition value in Kcal cites its source: the Indian Food Composition Tables (IFCT 2017). Regional dishes are seeded from those tables, not guessed.

Your log lives in SQLite on the phone and syncs to Supabase in the background, and the sync logic has its own tests. Text contrast is tested in both themes, so a new colour can't quietly become unreadable. Reminders use exact alarms through a small custom native module.

This is the second Kcal. The first was a web app on a different stack; I kept the spec and rewrote everything else.

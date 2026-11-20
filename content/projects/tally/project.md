---
name: Tally
order: 1
tagline: An expense tracker that reads your bank SMS. No account, no server, no internet.
status: On Google Play
theme:
  bg: '#0A0A0B'
  fg: '#F2F2EE'
  muted: '#8A8A85'
  accent: '#D4FF3A'
  onAccent: '#0A0A0B'
  line: '#232326'
  display: "'Geist', system-ui, sans-serif"
  fonts: family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@500
stats:
  - { value: '149', label: real bank messages tested }
  - { value: '17', label: banks it can read }
  - { value: '96%', label: of transactions caught }
what: Tally opens straight onto a keypad, so logging a payment takes two taps. It reads the bank and UPI alerts already on your phone and books them itself, and it doesn't even have permission to use the internet.
hardTitle: Teaching a phone to read 17 banks
links:
  - { label: Get it on Google Play, href: 'https://play.google.com/store/apps/details?id=app.tally.client', primary: true }
screensAlt: Tally's Play Store screenshots
notes:
  stack: [Expo, React Native, TypeScript, Kotlin native module, SQLite, '@noble crypto']
  tests: Vitest, plus a parser corpus of 149 real SMS
  platforms: Android
  when: Shipped October 2026
---

Every Indian bank words its SMS alerts differently, and UPI apps add their own notifications on top. I collected 149 real messages from 17 banks and wrote the parser against them. It catches 96% of transactions, and on the 130 it should read, it got the amount and the direction right every time.

When a bank words something oddly, you teach Tally once and it reads that wording from then on. The same payment arriving from your bank and from Google Pay is booked once, not twice.

Money is stored as whole paise, never as floating point, so the totals never drift. A release-build plugin strips the internet permission out of the app entirely: nothing you do in Tally can leave your phone.

---
name: Kallan
order: 6
icon: ../../assets/icons/kallan.png
tagline: A Malayali pass-the-phone party game. Find the kallan before they find the word.
status: Coming to Google Play
theme:
  bg: '#FFCB47'
  fg: '#1A1411'
  muted: '#5A4632'
  accent: '#D6322A'
  onAccent: '#FFF6E0'
  line: '#1A1411'
  display: "'Bungee', system-ui, sans-serif"
  body: "'Archivo', system-ui, sans-serif"
  fonts: family=Bungee&family=Archivo:wght@400;500;700
stats:
  - { value: '265', label: word pairs }
  - { value: '14', label: Kerala-themed packs }
  - { value: '3–20', label: players on one phone }
what: Everyone gets the same word except the kallan. Take turns describing it, then vote. Kunjunni the mascot hosts, and the whole game works offline.
hardTitle: One drawing, everywhere
screens:
  - ../../assets/media/kallan/feature-graphic.png
screensAlt: Kallan's Play Store banner
screensWide: true
notes:
  stack: [Expo, React Native, Skia, Reanimated, Zustand]
  tests: Jest and fast-check
  platforms: Android
  when: October–November 2026
---

Kunjunni is drawn and rigged from a single data file, and the same file generates the app icon and the Play Store art. Change the drawing once and everything follows.

The look is a Mollywood film poster crossed with a Balarama comic: marigold, thick ink outlines, hard shadows. Motion carries the jokes, with tilting coins, a hologram role card, a theme wipe and rubber stamps, plus haptics and sound. Hold the mascot for three seconds.

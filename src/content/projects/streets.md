---
name: Silicon Streets
order: 4
label: Streets
icon: ../../assets/icons/streets.svg
tagline: Drive the real streets of Bengaluru in your browser.
status: Coming to the web
theme:
  bg: '#0E1116'
  fg: '#E9EDF2'
  muted: '#8B95A3'
  accent: '#F2C230'
  onAccent: '#0E1116'
  line: '#222A36'
  display: "'Space Grotesk', system-ui, sans-serif"
  fonts: family=Space+Grotesk:wght@400;500;700
stats:
  - { value: '82,000', label: real buildings from OpenStreetMap }
  - { value: '8 × 13', label: km of city, streamed in tiles }
  - { value: '4 PM', label: "rain, with flooding. It's Bengaluru." }
what: Pick an auto, a scooter or a car. Take delivery jobs for Swiggly and Zoomato, ride the metro, flip flats with Namma Broker and pitch startups to VCs in cafés, with a parody radio station playing.
hardTitle: A whole city in one browser tab
notes:
  stack: [Three.js, Rapier physics, Vite, JavaScript, Python]
  tests: node:test, Playwright smoke test in CI
  platforms: Web
  when: 2026
---

The map is real OpenStreetMap data for Bengaluru, turned into game geometry by Python scripts. About 82,000 buildings over 8 by 13 km is far too much to load at once, so the city streams in 220-metre tiles and the meshes are built in a web worker to keep driving smooth.

Flyovers are drivable, there are traffic signals and street dogs, and the weather comes live from Open-Meteo. Physics runs on Rapier, and every push runs the tests and a Playwright smoke test in GitHub Actions.

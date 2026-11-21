---
name: Lumen
tagline: Lossless films from a Windows laptop to Google TV. A lighter Plex for one house.
status: In development
theme:
  bg: '#0F0D0B'
  fg: '#F5EFE6'
  muted: '#BDB3A6'
  accent: '#E8D5B0'
  onAccent: '#17140F'
  line: '#2C2824'
  display: "'Schibsted Grotesk', system-ui, sans-serif"
  fonts: family=Schibsted+Grotesk:wght@400;500;700;800
stats:
  - { value: '363', label: tests across server and TV app }
  - { value: '1', label: Rust binary on the laptop }
  - { value: '6', label: digit code to pair a TV }
what: The laptop runs a single Rust server, the TV runs a Compose app, and films play exactly as they were encoded. No accounts, no cloud, nothing leaves the house.
hardTitle: "Don't touch the film"
# Real screenshots aren't ready yet, so the page shows the design system instead.
# When they are: drop them in screens/ (1.png, 2.png, …) and add `screensWide: true`.
design:
  title: '"Glow": the poster is the light in a dark room'
  swatches:
    - { name: Room, value: '#0F0D0B', note: Warm near-black, never pure black }
    - { name: Raised, value: '#1A1714', note: Panels and sheets }
    - { name: Ivory light, value: '#E8D5B0', note: The one accent. Only for live state. }
    - { name: Text, value: '#F5EFE6' }
    - { name: Meta, value: '#BDB3A6', note: 7:1 on Room }
    - { name: Hint, value: '#93897C', note: 4.5:1 on Room }
  type:
    - { name: Display, family: Schibsted Grotesk, weight: 700, sample: Tonight, size: 44 }
    - { name: Interface, family: Inter Tight, weight: 500, sample: Ends 11:49 PM · 55 min left, size: 17 }
  rules:
    - Colour comes from each title's poster. The accent never decorates.
    - Say it in time, not tech. "Ends 11:49 PM", never a bitrate.
    - One remote press for every common action.
    - Nothing on the TV smaller than 18px at 1080p, readable from 3 metres.
notes:
  stack: [Rust, axum, SQLite, ffmpeg, Kotlin, Compose for TV, Media3]
  tests: 221 server, 109 TV unit, 33 emulator end-to-end
  platforms: Windows and Google TV
  when: 2026
---

Lumen plays a file directly whenever the TV can decode it. If it can't, it repackages the stream without re-encoding, and only transcodes on the GPU as a last resort, after asking. Before trying a 4K file it checks whether the picture is too wide for the TV's decoder.

The TV finds the laptop over mDNS, pairs with a 6-digit code and can wake it over the network. Each title takes its colour from its own poster, and the player tells you "ends 11:49 PM" instead of a bitrate.

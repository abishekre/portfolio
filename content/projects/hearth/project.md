---
name: Hearth
order: 5
tagline: Lossless movies from a Windows laptop to Google TV.
status: Open source, runs at home
theme:
  bg: '#0F0D0B'
  fg: '#F5EFE6'
  muted: '#A39A8C'
  accent: '#E8D5B0'
  onAccent: '#0F0D0B'
  line: '#2A241E'
  display: "'Schibsted Grotesk', system-ui, sans-serif"
  fonts: family=Schibsted+Grotesk:wght@400;500;700;800
stats:
  - { value: '363', label: tests across server and TV app }
  - { value: '1', label: Rust binary on the laptop }
  - { value: '6', label: digit code to pair a TV }
what: A lighter Plex for one house. The laptop runs a single Rust server, the TV runs a Compose app, and films play exactly as they were encoded.
hardTitle: "Don't touch the film"
screensAlt: Hearth on a Google TV
screensWide: true
notes:
  stack: [Rust, axum, SQLite, ffmpeg, Kotlin, Compose for TV, Media3]
  tests: 221 server, 109 TV unit, 33 emulator end-to-end
  platforms: Windows and Google TV
  when: 2026
---

Hearth plays a file directly whenever the TV can decode it. If it can't, it repackages the stream without re-encoding, and only transcodes on the GPU as a last resort. Before trying a 4K file it checks whether the picture is too wide for the TV's decoder.

The TV finds the laptop over mDNS, pairs with a 6-digit code and can wake it over the network. Each title takes its colour from its own poster, and the player tells you "ends 11:49 PM" instead of a bitrate.

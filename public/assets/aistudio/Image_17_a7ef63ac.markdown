---
name: Suraksha Intel Command
colors:
  surface: '#0e131e'
  surface-dim: '#0e131e'
  surface-bright: '#343946'
  surface-container-lowest: '#090e19'
  surface-container-low: '#161b27'
  surface-container: '#1b1f2b'
  surface-container-high: '#252a36'
  surface-container-highest: '#303541'
  on-surface: '#dee2f2'
  on-surface-variant: '#bbc9cd'
  inverse-surface: '#dee2f2'
  inverse-on-surface: '#2b303d'
  outline: '#859397'
  outline-variant: '#3c494c'
  surface-tint: '#2fd9f4'
  primary: '#8aebff'
  on-primary: '#00363e'
  primary-container: '#22d3ee'
  on-primary-container: '#005763'
  inverse-primary: '#006877'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#61f6b9'
  on-tertiary: '#003825'
  tertiary-container: '#3dd99e'
  on-tertiary-container: '#005a3e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2eeff'
  primary-fixed-dim: '#2fd9f4'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#0e131e'
  on-background: '#dee2f2'
  surface-variant: '#303541'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-mono-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.25rem
  margin: 1rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system targets SecOps analysts, incident response commanders, and threat intelligence directors who operate in real-time, high-stakes environments. The emotional posture is calm vigilance, authoritative clarity, and surgical precision. 

The aesthetic blends **Modern Technical Minimalism** with **High-Density Tactical HUD** conventions:
- **Atmosphere:** Dark Security Operations Center (SOC) telemetry, prioritizing night-shift visual stamina and immediate signal recognition over decoration.
- **Visual Texture:** Faint technical coordinate grids, hairline separation rules (1px), subdued backdrop glows beneath critical incident clusters, and mono-spaced tracking accents.
- **Integrity Signals:** Persistent operational state indicators ("SIMULATED DATA", "DEGRADED TELEMETRY", "ACTIVE CONTAINMENT") styled as rigid, high-visibility tactile chips.

## Colors

The palette establishes an ultra-deep, navy-tinted void that prevents screen glare in dim command environments while preserving crisp contrast.

### Palette Architecture
- **Root Background:** `#080D18` (Canvas floor)
- **Sidebar & Rails:** `#0B1220` (Structural navigation boundary)
- **Panel Base:** `#111E30` (Standard card and analytical surface)
- **Elevated Surfaces:** `#16243A` (Flyouts, modals, and active triage inspectors)
- **Hairline Borders:** `#25364D` (Subtle boundary control)

### Semantic & Accent Spectrum
- **Electric Cyan (`#22D3EE`):** Primary interactive focus, active telemetry scans, network nodes, and high-priority crosshairs.
- **Electric Blue (`#3B82F6`):** Secondary controls, informational payloads, payload hashes, and verified safe endpoints.
- **Emerald Green (`#34D399`):** Operational normal, nominal services, resolved anomalies, and ingress verification.
- **Amber Caution (`#FBBF24`):** Elevated risk, credential spraying, anomalies under behavioral analysis, and rate-limiting warnings.
- **Rose / Red Threat (`#FB7185`):** Active breach, lateral movement indicators, uncontained C2 callbacks, and critical priority alerts.

### Typographic Contrast
- **Base Readable Text:** `#F1F5F9` (Optimal contrast against `#111E30`).
- **Muted / Metadatum Text:** `#94A3B8` (Telemetry labels, disabled properties, secondary headers).

## Typography

The typographic strategy pairs **Inter** for conversational clarity and dense structural readability with **JetBrains Mono** for absolute alignment of machine-generated telemetry.

### Hierarchy & Application Rules
- **Inter** governs primary dashboard headers, modal dialogs, analyst notes, and remediation workflow copy.
- **JetBrains Mono** is mandatory for IP addresses, CIDR blocks, SHA-256 hashes, CVE identifiers, system timestamps (UTC standard), and micro-badges.
- Keep numbers tabular across tables and real-time metric streams using `tnum` font features to eliminate layout jitter during high-frequency data refresh cycles.

## Layout & Spacing

A compact, high-density 12-column layout maximized for high-resolution displays (1080p, 1440p, 4K multi-monitor wall arrays).

### Layout Rules
- **Desktop (1440px+):** Collapsible 64px/240px utility rail, fixed analytical header (48px), and 12-column fluid grid with `1.25rem` (20px) gutters. Multiple nested panels may scroll independently (internal panel scroll) to keep the global viewport pinned.
- **Tablet (768px - 1439px):** 8-column layout. Sidebar collapses to icons only. Complex analytical charts stack above tabular log lists.
- **Mobile (<768px):** Single-column stacked stream. Secondary panels collapse into swipeable bottom sheets. Top banner locks critical system status indicators.
- **Density:** Spacing relies on compact steps (`0.25rem` to `0.75rem`) within cards to maximize visible metrics above the fold without causing visual crowding.

## Elevation & Depth

This design system avoids heavy drop shadows, relying instead on **chromatic zoning, translucent layering, and micro-luminance borders**.

### Layering Hierarchy
1. **Level 0 (Floor - `#080D18`):** Global viewport background, often accented with faint background grid lines (`rgba(37, 54, 77, 0.35)` spaced at 32px intervals).
2. **Level 1 (Docked Containers - `#111E30`):** Base telemetry monitors and event streams. Outlined with solid 1px `#25364D`.
3. **Level 2 (Active Inspections - `#16243A`):** Hovered logs, selected rows, or active side-drawers. Rendered with an outer soft glow: `0 0 16px rgba(34, 211, 238, 0.08)` and an edge border of `rgba(34, 211, 238, 0.3)`.
4. **Level 3 (Alert Overlays & Modals):** Background `#16243A` backed by `backdrop-filter: blur(12px)`. Casts a targeted radial shadow: `0 12px 32px rgba(8, 13, 24, 0.85), 0 0 1px 1px #25364D`.

### Radar & Node Glows
Nodes on topology maps and radar scopes utilize multi-layered ping halos:
- Target ping: `box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.4), 0 0 12px rgba(34, 211, 238, 0.6)`.
- Threat ping: `box-shadow: 0 0 0 2px rgba(251, 113, 133, 0.4), 0 0 12px rgba(251, 113, 133, 0.6)`.

## Shapes

The design language uses soft, engineered corners (`0.25rem` / 4px base radius) to evoke the feel of precision hardware consoles, military avionics, and rugged tactical equipment.

- **Containers & Panels:** `0.25rem` (4px). Clean, technical, and structural.
- **Interactive Buttons & Inputs:** `0.25rem` (4px) with crisp 1px borders.
- **Status Pills & Telemetry Chips:** Fully rounded capsule/pill shape (`9999px`) to immediately separate metadata tags from rectangular cards and panels.
- **Coordinate Crosshairs & Cut Corners:** Optional pseudo-element angled brackets (2px length) on top-left and bottom-right corners of primary tactical modules to reinforce the targeting HUD motif.

## Components

### Buttons
- **Primary Cyber:** Solid `#22D3EE` background with `#080D18` bold typography. Hover creates an electric cyan bloom (`box-shadow: 0 0 14px rgba(34, 211, 238, 0.45)`).
- **Secondary Outlined:** Background `transparent`, border 1px `#25364D`, text `#F1F5F9`. Hover switches border to `#3B82F6` with subtle fill `rgba(59, 130, 246, 0.1)`.
- **Destructive/Containment:** Background `rgba(251, 113, 133, 0.15)`, border 1px `#FB7185`, text `#FB7185`. Hover blooms with rose glow.

### Chips & Badges
- **Operational Status Chips:** Pill-shaped (`rounded-full`), padding `2px 8px`, `label-mono-sm`.
  - *Simulation Badge:* Amber background (`rgba(251, 191, 36, 0.12)`), text `#FBBF24`, border 1px `rgba(251, 191, 36, 0.4)`. Constant subtle pulse indicator on the leading dot.
  - *Critical Risk Chip:* Crimson background (`rgba(251, 113, 133, 0.15)`), text `#FB7185`, border 1px `rgba(251, 113, 133, 0.4)`.
- **Telemetry Hash Tags:** JetBrains Mono, muted `#94A3B8`, background `#0B1220`, border 1px `#25364D`.

### Input Fields & Search
- Low-profile inputs with background `#0B1220` and border 1px `#25364D`.
- Focus state switches border directly to `#22D3EE` with an inner hairline glow. Placeholder text in `#94A3B8` (40% opacity). Leading icons (magnifying lenses, terminal prompts `>_`) rendered in `#22D3EE`.

### Lists & Telemetry Tables
- Striped alternating row backgrounds using `#111E30` and `#0E1929`.
- Row height fixed at 36px for ultra-dense scannability.
- Selected rows gain a 2px left border accent in `#22D3EE` and background tint `rgba(34, 211, 238, 0.06)`.
- Dividers between columns: 1px dashed `#25364D` (low opacity).

### Checkboxes & Radios
- Square (`checkbox`) and circular (`radio`) elements with base border 1.5px `#25364D` and background `#080D18`.
- Checked state fills with `#22D3EE`, rendering an obsidian tick/dot inside.

### Cards & Analytical Panels
- Solid `#111E30` background with sharp 1px `#25364D` borders.
- Header bars within panels are visually segregated by a 1px border-bottom and slight darkening (`#0B1220`), featuring the section title in `Inter` semi-bold and a live refresh rate/timestamp in `JetBrains Mono` muted text.
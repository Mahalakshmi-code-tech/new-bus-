# SmartBus Design System — Kinetic Intelligence

Based on the Google Stitch project [8836868428118512142](https://stitch.withgoogle.com/projects/8836868428118512142).

---

## 1. Brand Concept & Aesthetic Vision

The **SmartBus** design system is built around the **"Kinetic Intelligence"** narrative, positioning urban transit as a seamless, high-tech flow. The visual identity merges **Modern Corporate Precision** with **Futuristic Glassmorphic Accents**.

- **Atmosphere**: Light, airy, high-contrast, and dynamic. Avoids heavy industrial tropes in favor of clean white surfaces, subtle cool tints, layered glass panels, and glowing cyan/electric-blue data accents.
- **Elevation**: Multi-layered ambient shadows and translucent glass backdrops (`backdrop-blur-md` and `backdrop-blur-xl`) with fine 1px light borders.
- **Geometry**: Hyper-rounded capsule styling (`rounded-full`, `rounded-3xl`, `rounded-[2rem]`, `rounded-[3rem]`).

---

## 2. Color Palette & Semantic Tokens

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| **`primary`** | `#0050cb` | Primary brand blue, headers, active states, key interactive buttons |
| **`primary-container`** | `#0066ff` | Electric blue for active card highlights, prominent badges, glow accents |
| **`primary-fixed`** | `#dae1ff` | Soft tinted blue background for hero glows and subtle tags |
| **`primary-fixed-dim`** | `#b3c5ff` | Secondary tinted blue accents |
| **`secondary`** | `#515f78` | Slate navy for secondary icons, data metrics, and subtitles |
| **`secondary-container`**| `#d2e0fe` | Muted cool-blue chip containers and status tags |
| **`tertiary`** | `#a33200` | Warm amber/burnt orange for live delays, maintenance alerts, warning badges |
| **`tertiary-container`** | `#cc4204` | Deep vibrant accent container for specific tools/features |
| **`tertiary-fixed`** | `#ffdbd0` | Soft warm accent container |
| **`background`** | `#faf8ff` | Global page background — cool white with soft lavender-blue undertone |
| **`surface`** | `#faf8ff` | Primary component background |
| **`surface-container-lowest`** | `#ffffff` | Pure white for cards, elevated modals, and input fields |
| **`surface-container-low`** | `#f2f3ff` | Subtle tinted container background |
| **`surface-container`** | `#ecedfa` | Neutral container background for secondary panels |
| **`surface-container-high`** | `#e6e7f4` | High container background |
| **`surface-container-highest`**| `#e1e2ee` | Deepest surface for footers and dark-surface elements |
| **`on-surface`** | `#191b24` | Deep charcoal primary text color |
| **`on-surface-variant`** | `#424656` | Slate gray for secondary body text and metadata |
| **`outline`** | `#727687` | Subtle border and icon default tone |
| **`outline-variant`** | `#c2c6d8` | Ultra-fine dividers and container outlines |
| **`surface-tint`** | `#0054d6` | Transit marker base tint |
| **`neon-cyan / live`** | `#00ffff` | Reserved exclusively for active transit states, glowing nodes, and pulsing live chips |
| **`error`** | `#ba1a1a` | Critical alerts, delays (>5m), error messages |
| **`error-container`** | `#ffdad6` | Error alert chip background |

---

## 3. Typography Hierarchy

Fonts imported from Google Fonts:
- **Headings & Body**: `Inter` (`wght@400;500;600;700;800;900`)
- **Labels & Data Visualization**: `Space Grotesk` (`wght@600;700`)

| Style | Font Family | Size | Weight | Line Height | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `headline-xl` | Inter | `48px` (desktop `64px`) | 800 (ExtraBold) | `1.1` | `-0.04em` | Hero titles & major page headers |
| `headline-lg` | Inter | `32px` | 700 (Bold) | `1.2` | `-0.02em` | Section headers & card titles |
| `headline-lg-mobile` | Inter | `28px` | 700 (Bold) | `1.2` | `-0.02em` | Mobile headings |
| `body-md` | Inter | `16px` | 400 (Regular) / 500 | `1.6` | `0` | Standard body prose and descriptions |
| `label-caps` | Space Grotesk | `12px` | 600 (SemiBold) | `1.0` | `0.1em` | Metadata chips, ETA timestamps, uppercase badges |

---

## 4. Spacing & Grid Layout

- **Base Unit**: `8px` rhythmic spacing system.
- **Max Container Width**: `1280px` (`max-w-container-max`).
- **Margins**:
  - Desktop: `40px` (`px-margin-desktop` / `px-10`)
  - Mobile: `16px` (`px-margin-mobile` / `px-4`)
- **Gutter**: `24px` (`gap-gutter` / `gap-6`)
- **Grid Models**:
  - 12-column Bento Grid on desktop (`grid-cols-12`)
  - 4-column responsive reflow on mobile (`grid-cols-1` to `grid-cols-4`)

---

## 5. Elevation, Shadows & Glassmorphism

1. **Level 0 (Base)**: Solid background `#faf8ff`.
2. **Level 1 (Cards)**: White/tinted container with soft shadow `box-shadow: 0 4px 24px rgba(0, 80, 203, 0.08)`.
3. **Level 2 (Glass Panels & Navbars)**: 
   ```css
   background: rgba(255, 255, 255, 0.65);
   backdrop-filter: blur(20px);
   border: 1px solid rgba(255, 255, 255, 0.4);
   box-shadow: 0 4px 30px rgba(0, 80, 203, 0.06);
   ```
4. **Level 3 (Pop-overs, Glows & Modals)**:
   ```css
   box-shadow: 0 10px 40px rgba(0, 102, 255, 0.2);
   ```

---

## 6. Components & UI Elements

### Buttons
- **Primary**: Electric Blue (`#0050cb` / `#0066ff`), `rounded-full`, white text, padding `px-6 py-2.5` to `px-8 py-3.5`. On hover: cyan/blue glow `box-shadow: 0 0 20px rgba(0, 102, 255, 0.5)` with micro scale `hover:-translate-y-0.5`.
- **Ghost / Outline**: Transparent background with 2px primary border, `rounded-full`, primary text. On hover: `bg-primary/10`.
- **Pill Badges**: `rounded-full`, font `Space Grotesk` uppercase `text-[12px] tracking-widest`.

### Cards & Bento Modules
- Rounded corners `rounded-3xl` (24px) or `rounded-[2rem]` (32px).
- Translucent backdrop with subtle border gradients.
- Hover lift: smooth transition `transform hover:-translate-y-1 hover:shadow-xl duration-300`.

### Form Fields & Inputs
- Background `#F1F5F9` (or `surface-container-low`).
- Rounded `rounded-xl` or `rounded-full`.
- Focus state: `border-primary` with `ring-4 ring-primary/20` and soft blue outer glow.

### Transit Chips & Nodes
- **Live Status Chip**: Neon Cyan `#00ffff` background with `#001849` midnight navy text and pulsing cyan dot.
- **Bus Marker Pulse Node**: Pulsing cyan glow radar wave animation.
- **Route Visualizer**: Glowing blue-to-cyan gradient line with stop timeline nodes.

---

## 7. Animation & Micro-Interactions Specification

- **Page Load**: Hero elements fade in and slide up `opacity-0 translate-y-4` to `opacity-100 translate-y-0` with staggered card entrance.
- **Interactive Map**: Real-time simulated vehicle movements, clickable stops, interactive zoom & center controls.
- **Route Inspector**: Switching active routes smoothly animates route details, stops timeline, and live assigned buses.
- **AI Assistant**: Realistic interactive prompt responses with live typing effect and prompt chip selectors.
- **Dashboard Charts**: Smooth animated line graphs for passenger traffic and dynamic utilization meters.
- **Reduced Motion**: Respect `prefers-reduced-motion: reduce` for accessibility.

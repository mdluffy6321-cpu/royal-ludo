---
name: "Imperial Obsidian & Royal Gold"
version: "1.0.0"
category: "Luxury Dark Gaming & High-Stakes Arena"
description: "Official visual identity, design tokens, and aesthetic rules for ROYAL LUDO — a premium online multiplayer gaming platform."

colors:
  # Base Canvases
  canvas-default: "#070B19"          # Deep obsidian navy (primary page background)
  canvas-darker: "#040710"           # True obsidian black (deep container bases)
  canvas-accent: "#180D2B"           # Imperial royal purple base glow

  # Surfaces & Cards (Glassmorphism)
  surface-card: "#0E162E"            # Primary card fill with 80% opacity blur
  surface-hover: "#142042"           # Hovered interactive card fill
  surface-elevated: "#18264F"        # Modal dialogs & elevated popovers
  surface-input: "#0A1021"           # Recessed input field background

  # Structural & Metallic Borders
  border-subtle: "#23325D"           # Standard card and divider border (opacity 0.6)
  border-muted: "#1B284A"            # Inactive border
  border-gold: "rgba(245, 158, 11, 0.4)" # Sovereign gold accent border
  border-gold-bright: "#F59E0B"      # Active gold highlight border

  # Sovereign Royal Gold Accents
  gold-primary: "#F59E0B"            # Amber Gold (crowns, coins, primary CTAs)
  gold-hover: "#D97706"              # Darker gold for pressed/hover button states
  gold-light: "#FDE68A"              # Champagne gold highlights & shimmer text
  gold-dim: "rgba(245, 158, 11, 0.15)" # Subtle gold pill and chip backgrounds

  # Imperial Purple Accents
  purple-royal: "#7C3AED"            # Vibrant royal purple for special tournament states
  purple-dark: "#1E0F38"             # Velvet purple background gradient blend
  purple-dim: "rgba(124, 58, 237, 0.18)"

  # Official Ludo Quadrant Colors (High-Vibrancy)
  ludo-red: "#EF4444"                # Ruby Red (Quadrant 1)
  ludo-red-dark: "#991B1B"
  ludo-red-glow: "rgba(239, 68, 68, 0.4)"
  ludo-green: "#10B981"              # Emerald Green (Quadrant 2)
  ludo-green-dark: "#065F46"
  ludo-green-glow: "rgba(16, 185, 129, 0.4)"
  ludo-yellow: "#F59E0B"             # Amber Gold (Quadrant 3)
  ludo-yellow-dark: "#B45309"
  ludo-yellow-glow: "rgba(245, 158, 11, 0.4)"
  ludo-blue: "#3B82F6"               # Sapphire Blue (Quadrant 4)
  ludo-blue-dark: "#1D4ED8"
  ludo-blue-glow: "rgba(59, 130, 246, 0.4)"

  # Text & Content
  text-primary: "#F8FAFC"            # Pure crisp headline and title text
  text-secondary: "#CBD5E1"          # Slate body text (high readability)
  text-muted: "#94A3B8"              # Metadata, timestamps, captions
  text-gold: "#FDE68A"               # Gold shimmer text highlights

typography:
  display:
    fontFamily: "'Cinzel', 'Trajan Pro', Georgia, serif"
    letterSpacing: "0.04em"
    weights: [700, 800, 900]
  body:
    fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif"
    letterSpacing: "-0.01em"
    weights: [400, 500, 600, 700]
  mono:
    fontFamily: "'JetBrains Mono', 'SF Mono', Consolas, monospace"
    letterSpacing: "0.02em"
    weights: [500, 700]

shapes:
  radius-sm: "8px"                   # Chips, small badge pills
  radius-md: "12px"                  # Inputs, sub-actions, dropdown items
  radius-lg: "16px"                  # Primary buttons, small cards
  radius-xl: "24px"                  # Main gaming cards, modal dialogs
  radius-2xl: "32px"                 # Hero containers, Ludo board outer shell
  radius-pill: "9999px"              # Round chips, player status indicators

shadows:
  gold-glow: "0 0 25px -5px rgba(245, 158, 11, 0.45)"
  purple-glow: "0 0 25px -5px rgba(124, 58, 237, 0.45)"
  card-elevation: "0 8px 32px 0 rgba(0, 0, 0, 0.4)"
  modal-elevation: "0 20px 50px -10px rgba(0, 0, 0, 0.85)"
---

# ROYAL LUDO — Design System Specification

## 1. Overview & Brand Philosophy
**Royal Ludo** is designed to look like a sovereign royal gaming club—not a toy. The interface blends the prestige of classical royalty (serif typography, gold seals, regal heraldry) with the precision of a modern competitive esports arena.

The visual mood evokes an exclusive high-stakes salon in Monaco or Macau: deep midnight blue walls, velvet purple undertones, warm gold lighting, and razor-sharp digital telemetry.

---

## 2. Color Usage Rules & Discipline

### A. The "Gold Standard" Rule
- **Gold (`#F59E0B`, `#FDE68A`)** is the primary royal asset. It must be treated as a **rare metal**, not a broad paint:
  - **USE FOR:** Crowns, trophy icons, coin balances, active turn glows, winner podiums, and the single highest-priority CTA on a view (*e.g., "Set Battle"*, *"Spin the Wheel"*).
  - **NEVER:** Fill full screen backgrounds with gold or use gold text over white backgrounds.

### B. Glassmorphism Hierarchy
All primary cards utilize a semi-translucent glass effect with backdrop blur:
```css
.glass-panel {
  background: rgba(14, 22, 46, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(35, 50, 93, 0.8);
}

.glass-panel-gold {
  background: rgba(14, 22, 46, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 0 20px -5px rgba(245, 158, 11, 0.2);
}
```

---

## 3. Typography Hierarchy

| Style Role | Font Family | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | `Cinzel` | 900 Black | `0.04em` | "ROYAL LUDO", Grand Championship banners |
| **Section Header** | `Cinzel` | 700 Bold | `0.02em` | "Battle Arena", "Game Modes", "Leaderboard" |
| **Card Title** | `Cinzel` | 700 Bold | Normal | Mode titles, tournament match labels |
| **Body / Prose** | `Outfit` | 400 Regular | `-0.01em` | Descriptions, rules, helper tooltips |
| **Interface Buttons** | `Cinzel` / `Outfit` | 700 Bold | `0.05em` | All-caps uppercase action buttons |
| **Data & Financial** | `JetBrains Mono` | 700 Bold | Normal | Coin counts (`🪙 5,000`), Player tags (`#RL-10001`), Room codes |

---

## 4. Components & Interactive Elements

### Buttons
1. **Primary Sovereign CTA:**
   - Background: `linear-gradient(to right, #F59E0B, #D97706)`
   - Text: `#070B19` (Jet black for maximum legibility and contrast)
   - Font: `Cinzel`, Bold, Uppercase, Tracking-wider
   - Shadow: `shadow-gold-glow`
   - Active: `scale-95` tap feedback

2. **Secondary Slate Action:**
   - Background: `rgba(30, 41, 59, 0.8)` with `border: 1px solid #334155`
   - Text: `#F8FAFC`
   - Hover: `background: rgba(51, 65, 85, 0.9)`

3. **Danger / Resign Button:**
   - Background: `#DC2626` with red glow, white text.

### Badges & Status Chips
- **Live Match Pulse:** Crimson pill with animated pulsing dot (`● LIVE`).
- **Escrow Chip:** Amber pill displaying coin stake (`🪙 100`).
- **Verified Winner:** Emerald green badge with checkmark (`✓ Champion`).

---

## 5. Game Interface Specifications

### The 15×15 Ludo Board
- **Outer Shell:** Deep navy container with 32px rounded corners and a 2px royal border.
- **Yard Bases:** Rich quadrant gradients with glossy inner pads and metallic rings.
- **Perimeter Path:** 52 dark track cells with 1px borders.
- **8 Safe Stars:** Rendered as crisp 5-pointed golden SVG stars on starting and checkpoint coordinates.
- **Center Home:** 4 meeting triangles with the golden royal crown seal in the dead center.
- **Token Pieces:** 3D-styled SVG circles with radial specular highlights, drop shadows, and active turn pulsing rings.

### The 3D Dice Roller
- 20×20 to 24×24 tactile die matching the current player's color.
- CSS 3D tumble animation during roll phase with procedural sound synthesis.
- Pulsing gold ring surrounding the die when it is the local player's turn to roll.

### Circular Turn Timer (15 Seconds)
- **15s to 9s:** Emerald green ring (Safe).
- **8s to 4s:** Amber yellow ring (Warning).
- **3s to 0s:** Ruby red pulsing ring with audible countdown clicks (Critical).

---

## 6. Do's and Don'ts for AI Agents & Developers

### Do's:
- **DO** use the designated font pairing (`Cinzel` for headings + `Outfit` for body text + `JetBrains Mono` for stats).
- **DO** maintain responsive touch-friendly padding (minimum 44×44px touch targets on mobile).
- **DO** verify that all coin transactions display the non-monetary currency symbol (`🪙`) alongside numeric values.
- **DO** keep the dark mode palette intact across all screens.

### Don'ts:
- **DON'T** introduce generic bright white cards or light-mode themes that break the immersive luxury salon aesthetic.
- **DON'T** use cheap neon rainbow buttons; adhere strictly to the gold, purple, and quadrant color definitions.
- **DON'T** create buttons or cards that lack hover, active, or disabled states.
- **DON'T** display fake or random multiplayer results—always route moves through the authoritative game engine.


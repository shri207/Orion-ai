---
name: Obsidian Emerald
colors:
  surface: '#081615'
  surface-dim: '#081615'
  surface-bright: '#2e3c3b'
  surface-container-lowest: '#041010'
  surface-container-low: '#101e1d'
  surface-container: '#142221'
  surface-container-high: '#1f2d2b'
  surface-container-highest: '#293736'
  on-surface: '#d6e6e3'
  on-surface-variant: '#b9cac4'
  inverse-surface: '#d6e6e3'
  inverse-on-surface: '#253332'
  outline: '#84948f'
  outline-variant: '#3a4a46'
  surface-tint: '#00dfc0'
  primary: '#dafff4'
  on-primary: '#00382f'
  primary-container: '#21f5d4'
  on-primary-container: '#006c5c'
  inverse-primary: '#006b5b'
  secondary: '#44e9ce'
  on-secondary: '#00382f'
  secondary-container: '#00cdb3'
  on-secondary-container: '#005146'
  tertiary: '#fff6e7'
  on-tertiary: '#3c2f00'
  tertiary-container: '#ffd754'
  on-tertiary-container: '#745d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#34fddc'
  primary-fixed-dim: '#00dfc0'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#005144'
  secondary-fixed: '#5bfbdf'
  secondary-fixed-dim: '#31dec3'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#005045'
  tertiary-fixed: '#ffe084'
  tertiary-fixed-dim: '#e9c341'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#081615'
  on-background: '#d6e6e3'
  surface-variant: '#293736'
  surface-card: '#0B1B1A'
  surface-elevated: '#102322'
  text-primary: '#F6F6F3'
  text-muted: '#8CA5A1'
  border-glass: rgba(255, 255, 255, 0.06)
  glow-teal: rgba(33, 245, 212, 0.15)
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 84px
    fontWeight: '400'
    lineHeight: 92px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: EB Garamond
    fontSize: 60px
    fontWeight: '400'
    lineHeight: 68px
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 24px
---

## Brand & Style

The design system is a high-end, cinematic framework designed for "Interview Agent." It evokes the prestige of a luxury editorial publication combined with the precision of futuristic AI technology. The aesthetic is "Emerald Minimalism"—a deep, atmospheric environment that prioritizes focus, quiet confidence, and layered depth.

The style is a sophisticated blend of **Glassmorphism** and **Cinematic Dark Mode**. It utilizes soft volumetric lighting (glows) to guide the eye, grain textures to add organic warmth to digital surfaces, and high-contrast editorial typography to establish an authoritative voice. The interface should feel less like a tool and more like an immersive experience.

## Colors

The palette is anchored in a near-black emerald (`#071514`), providing a dense, ink-like canvas. The primary neon teal (`#21F5D4`) is used sparingly as a "light source" rather than a fill color, appearing in active states, focus indicators, and subtle data visualizations.

Transitions between surfaces are handled through slight shifts in value and the addition of transparency. Gradients should be used to simulate light hitting a surface from the top-left, rather than flat color fills. Always maintain high contrast for typography against the dark background, using the off-white `#F6F6F3` for maximum readability without the harshness of pure white.

## Typography

This design system utilizes a high-contrast typographic pairing. **EB Garamond** (as a premium alternative to Canela) serves as the display face, bringing an intellectual, editorial quality to headings. It should be set with tight tracking in display sizes to emphasize its elegant ligatures.

**Inter** provides a functional, neutral counterpoint for body text and interface labels. For data-heavy views or interview transcripts, Inter’s legibility ensures the focus remains on the content. Large headers should use the "Display" roles to create a sense of scale and importance, often centered or used in asymmetrical layouts.

## Layout & Spacing

The layout philosophy is based on a **fixed-center grid** for desktop, allowing for generous white space that emphasizes the premium nature of the brand. We use a 12-column grid with wide gutters (`32px`) to prevent content density.

Spacing follows a strict 8px linear scale. Large-scale components (like hero sections) should lean into "oversized" margins to create a cinematic feel. Content should "breathe"—avoid cluttering the interface with too many secondary actions. On mobile, the system collapses to a single-column flow with reduced margins, while keeping typography relatively large to maintain the editorial impact.

## Elevation & Depth

Depth is achieved through **Glassmorphism** and **Backdrop Blurs** rather than traditional drop shadows. Surfaces are layered using a "stacking" logic:
1.  **Background:** The deepest emerald-black layer with a subtle grain texture overlay.
2.  **Floating Cards:** Semi-transparent containers (`#0B1B1A` at 80% opacity) with a `20px` backdrop blur.
3.  **Glow Borders:** A `1px` inner stroke using `rgba(255,255,255,0.06)` simulates a highlight on the edge of a glass pane.
4.  **Volumetric Accents:** Soft radial gradients of teal (`#21F5D4`) placed behind primary cards to create a "halo" effect, suggesting the card is a light source or is being illuminated from behind.

## Shapes

The design system uses a **Soft (1)** roundedness profile. This subtle `4px` - `12px` corner radius maintains a professional, sharp look that aligns with high-end architecture and editorial design, avoiding the "bubbly" appearance of consumer apps. 

Buttons and input fields should utilize a `4px` radius, while larger glass containers and cards should use `8px` or `12px` to feel more structural. Interactive elements should never be fully rounded (pills) unless they are status indicators or small tags.

## Components

- **Buttons:** Primary buttons use a solid teal fill with dark text. Secondary buttons are "Ghost" style with the `border-glass` stroke and teal text on hover. Use a subtle `inner-shadow` to give buttons a slightly pressed, tactile feel.
- **Floating Cards:** The centerpiece of the UI. Must have a backdrop blur of at least `20px` and a thin `1px` border. Cards should appear to "hover" via the volumetric glow behind them.
- **Input Fields:** Minimalist. Only a bottom border in the default state; transforms into a full glass container on focus with a soft teal outer glow.
- **Chips/Tags:** Small, capitalized Inter labels with a subtle background tint and high letter spacing.
- **Lists:** Use generous vertical padding (`24px`) between items with a thin separator line. 
- **Grain Texture:** A global noise overlay (low opacity, ~3%) should be applied to the entire viewport or specifically to glass surfaces to break up digital gradients and add a "filmic" quality.
- **Interactions:** All transitions should be slow and ease-in-out (e.g., `400ms`), mimicking the movement of a camera lens or a physical sliding of glass.
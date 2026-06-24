---
name: Proscenium Editorial
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is engineered for high-density information environments that require an authoritative yet elegant presence. It draws from **Modern Editorial Minimalism**, prioritizing legibility and visual hierarchy to ensure a frictionless reading experience.

The system targets an informed, professional audience that values speed, accuracy, and depth. By utilizing generous whitespace and a refined typographic scale, the UI evokes a sense of calm and clarity amidst the 24-hour news cycle. The emotional response is one of trust and sophistication, avoiding the "loud" or "cluttered" visual tropes of traditional news portals in favor of a curated, premium digital experience.

## Colors

The palette is anchored by **Deep Navy (#0F172A)**, used for primary branding, navigation bars, and high-level headings to establish an immediate sense of institutional authority. **Cerulean Blue (#3B82F6)** serves as the strategic accent, reserved for interactive elements, links, and categorical indicators to guide the user's eye without overwhelming the content.

Backgrounds utilize a crisp, absolute white to maximize contrast, while a scale of **Slate Grays** (from #1E293B for body text to #94A3B8 for metadata) ensures that secondary information is clearly differentiated. This high-contrast approach maintains accessibility and mimics the clarity of premium print publications.

## Typography

This design system employs a classic serif/sans-serif pairing to balance tradition with modernity. **Playfair Display** is used for headlines to convey editorial prestige and a literary tone. The serif weight is kept slightly heavier to ensure "bite" against the digital white background.

**Inter** is the workhorse for body copy and UI labels. Its neutral, systematic nature provides excellent legibility at smaller sizes and high densities. For long-form reading (body-lg), the line-height is intentionally expanded to 1.6x to reduce eye fatigue. Labels and metadata use uppercase styling with increased letter-spacing to provide a clear visual distinction from narrative text.

## Layout & Spacing

The layout follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The system emphasizes vertical rhythm through an 8px base unit, ensuring consistent spacing between article components.

Editorial layouts should prioritize a "center-well" for long-form articles (approx. 720px wide) to optimize reading speed, while the news portal index utilizes an asymmetrical layout to highlight featured stories. Use the `stack-lg` (48px) unit to separate major content sections, allowing the design to breathe and preventing the "information wall" effect common in digital news.

## Elevation & Depth

To maintain a sophisticated and flat editorial feel, elevation is used sparingly. Hierarchy is primarily achieved through **Tonal Layers**—using the light slate neutrals (#F8FAFC) to create subtle background blocks for sidebars or "trending" sections.

Where depth is required (such as in hover states for article cards or dropdown menus), the system utilizes **Ambient Shadows**. These shadows are highly diffused (20px-40px blur) with very low opacity (5-8%) and a subtle navy tint to maintain color harmony with the primary brand. No harsh borders or solid drop shadows are permitted; the goal is to make elements appear to softly float rather than sit on a physical plane.

## Shapes

The design system utilizes **Rounded (8px)** corners as the standard. This choice softens the professional rigidity of the typography without appearing "bubbly" or overly casual. 

- **Standard Elements:** Buttons, input fields, and article thumbnails use the base 8px (0.5rem) radius.
- **Large Containers:** Hero cards and featured section backgrounds may scale up to 16px (1rem) to create a more prominent visual framing.
- **Interactive States:** Soften the corners slightly on active/pressed states to provide tactile feedback.

## Components

### Buttons & Interactivity
Primary buttons are solid Deep Navy with white text. Secondary buttons use a ghost style with a subtle Slate-200 border. All interactive elements should feature a transition period of 200ms for hover states.

### Article Cards
Cards should be "borderless" on the portal home, using whitespace and typography to define boundaries. Use a 16:9 aspect ratio for lead imagery with 8px rounded corners. Metadata (Author, Time) should be set in `label-md` using Slate-500.

### Input Fields
Search and newsletter signup fields use a white background with a 1px border in Slate-200. On focus, the border transitions to Cerulean Blue with a soft 4px outer glow.

### Chips & Tags
Used for category labeling (e.g., "Politics", "Technology"). These should be low-contrast: light slate backgrounds with dark slate text, or a subtle cerulean tint for "live" or "breaking" updates.

### Lists & Dividers
Use horizontal rules sparingly; prefer using whitespace (stack-md) to separate list items. When a divider is necessary, use a 1px stroke in Slate-100 to maintain a delicate, high-end feel.
---
name: Logistics & Moving Marketplace
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fc'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1eb'
  on-surface: '#1a1b22'
  on-surface-variant: '#444653'
  inverse-surface: '#2f3037'
  inverse-on-surface: '#f1f0fa'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#611e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#872d00'
  on-tertiary-container: '#ffa583'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1eb'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-columns: '12'
  gutter-desktop: 24px
  gutter-mobile: 16px
  margin-desktop: 32px
  margin-mobile: 16px
  space-unit: 8px
---

## Brand & Style

This design system establishes a clean, professional, and reliable digital ecosystem for a logistics and moving marketplace. The brand personality is rooted in dependability, precision, and efficiency, engineered to build immediate trust between users and vetted transport providers. 

The aesthetic style is **Corporate / Modern**, prioritizing high legibility, structured layouts, and systematic feedback loops. The visual language evokes calmness and absolute operational competence, reducing the inherent anxiety of moving high-value goods through transparent tracking, clear pricing structures, and unmistakable calls to action.

## Colors

The color palette is deliberately restrained to maximize clarity and functional hierarchy. 

- **Primary (Deep Trust Blue - `#1E40AF`):** Commands authority and reliability, applied to primary navigation, key actions, and anchor elements.
- **Secondary (Amber/Orange - `#F59E0B`):** Signals urgency, ratings, and time-sensitive alerts, drawing the eye to crucial marketplace actions such as quote expiration or driver availability.
- **Neutrals (`#F8FAFC` surfaces, `#0F172A` text):** Crisp white and soft gray backgrounds establish a breathable canvas, while near-black text ensures WCAG AAA compliance for readability across data-dense tables and inventory lists.

## Typography

Powered by **Inter**, the typographic hierarchy is built for absolute legibility in complex operational dashboards and transactional flows. 

Headlines utilize tighter tracking (`-0.01em` to `-0.02em`) to present massive data points, dates, and locations with structural impact. Body text maintains generous line heights to prevent fatigue when users review lengthy inventory itemization lists, shipping manifests, or terms of service. Always pair font weight shifts strictly with size changes to preserve the utilitarian grid rhythm.

## Layout & Spacing

The layout relies on a strict **12-column fluid grid system** anchored by an 8px base spacing unit. This ensures that dense tabular data, multi-step booking wizards, and split-screen map views align predictably.

- **Desktop:** Utilizes 32px outer margins with 24px gutters, allowing complex side-by-side interfaces (e.g., shipment details alongside live route mapping).
- **Tablet:** Adapts to a fluid 8-column layout with 20px gutters.
- **Mobile:** Collapses to a single-column stacked layout with 16px margins, ensuring touch targets remain thumb-reachable and full-width where appropriate.

## Elevation & Depth

Depth is communicated through **tonal layers** combined with subtle **ambient shadows** to delineate interactive marketplace elements from the background canvas. 

Cards representing individual moving quotes or vehicle assignments sit on crisp white surfaces (`#FFFFFF`) against the soft gray background (`#F8FAFC`). Elevation levels are restricted to three tiers: base (flat surfaces), raised (interactive cards and dropdown menus with soft, diffused shadows), and overlay (modals and sticky bottom action bars with pronounced shadow casting). Avoid heavy or colored drop shadows to maintain a clean, enterprise-grade feel.

## Shapes

The shape language employs a **soft** roundedness profile (`0.25rem` base, `0.5rem` for `rounded-lg`, and `0.75rem` for `rounded-xl`). 

This restrained curvature softens the inherent rigidity of data-heavy logistics software without sacrificing professional rigor. Inputs, buttons, and standard cards utilize `0.5rem` corners to guide touch targets naturally while maintaining crisp, predictable alignment within table rows and grid containers.

## Components

- **Buttons:** Primary actions utilize deep trust blue (`#1E40AF`) with white text and `rounded-lg` corners. Secondary actions employ ghost outlines, while urgent callouts (e.g., "Confirm Booking") leverage the secondary amber tone.
- **Chips:** Used for filter states (e.g., "Truck Size: 26ft", "Instant Book"), featuring neutral gray backgrounds that invert to primary blue when active.
- **Lists:** Designed for itemized moving inventories and route waypoints, featuring high-contrast text, alternating micro-borders, and clear status indicators.
- **Checkboxes & Radio Buttons:** Built with crisp borders and high-contrast checked states to ensure zero ambiguity in multi-step inventory declarations.
- **Input Fields:** Generous padding with clear floating labels, error states bound to high-contrast red warnings, and integrated validation icons.
- **Cards:** Used for carrier profiles and quote comparisons, featuring subtle surface elevation, clear pricing typography, and prominent secondary-colored rating badges.
- **Marketplace-Specific Additions:** Include interactive route map containers, driver availability status pills, and step-by-step progress trackers for multi-day moves.
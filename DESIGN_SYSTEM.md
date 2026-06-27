# Design System

## Typography

| Level | Size | Weight | Font |
|---|---|---|---|
| Page Title | 24px (text-2xl) | Bold (700) | Geist Sans |
| Section Title | 14px (text-sm) | Semibold (600) | Geist Sans |
| KPI Value | 24px (text-2xl) | Bold (700) | Geist Sans |
| KPI Label | 12px (text-xs) | Medium (500) | Geist Sans |
| Body | 14px (text-sm) | Normal (400) | Geist Sans |
| Small Text | 12px (text-xs) | Normal (400) | Geist Sans |
| Monospace | 12-14px | — | Geist Mono |
| Table Header | 12px (text-xs) | Medium (500) | Geist Sans |

## Spacing

```css
--spacing-unit: 4px; /* 4px base grid */
```

| Token | Value | Usage |
|---|---|---|
| space-1 | 4px | Tiny gaps |
| space-2 | 8px | Tight spacing |
| space-3 | 12px | Button padding |
| space-4 | 16px | Standard padding |
| space-5 | 20px | Card padding |
| space-6 | 24px | Section spacing |
| space-8 | 32px | Large gaps |
| space-10 | 40px | Page sections |

## Icons

- Library: Lucide React
- Size: 16px (w-4 h-4) standard, 20px (w-5 h-5) for nav items, 24px+ for emphasis
- Color: Inherits from parent text color or utility classes

## Colors

### Theme

```css
--color-background: #0a0e17;
--color-foreground: #e8edf5;
--color-muted: #8892a8;
```

### Primary

```css
--color-primary: #3b82f6;
--color-primary-foreground: #ffffff;
--color-primary-hover: #2563eb;
--color-primary-muted: rgba(59, 130, 246, 0.1);
```

### Semantic

```css
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-destructive: #ef4444;
--color-info: #3b82f6;
--color-accent: #06b6d4;
```

### Status Colors

| Status | Color | Usage |
|---|---|---|
| Operational | `#22c55e` | Green glow, badge background |
| Warning | `#f59e0b` | Amber glow, badge background |
| Critical | `#ef4444` | Red glow, badge background |
| Offline | `#8892a8` | Gray, no glow |
| Maintenance | `#3b82f6` | Blue, subtle glow |

## Dark Theme

The application uses a forced dark theme. No light theme is provided.

```css
body {
  background: #0a0e17;
  color: #e8edf5;
}
```

CSS classes for status colors include text-shadow glow effects:

```css
.status-ok { color: #22c55e; text-shadow: 0 0 8px rgba(34, 197, 94, 0.3); }
.status-warning { color: #f59e0b; text-shadow: 0 0 8px rgba(245, 158, 11, 0.3); }
.status-critical { color: #ef4444; text-shadow: 0 0 8px rgba(239, 68, 68, 0.3); }
```

## Cards

### Glass Card (default)

```css
background: rgba(15, 23, 42, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(59, 130, 246, 0.12);
border-radius: 12px;
```

### Glass Panel (lighter)

```css
background: rgba(15, 23, 42, 0.6);
backdrop-filter: blur(16px);
border: 1px solid rgba(59, 130, 246, 0.1);
border-radius: 16px;
```

## Charts

| Element | Style |
|---|---|
| Grid lines | `rgba(59, 130, 246, 0.08)` |
| Axis labels | `rgba(136, 146, 168, 0.7)`, 10px |
| Line stroke | 2px width |
| Gradient fill | Linear from line color (0.3 opacity) to transparent |
| Tooltip bg | `rgba(15, 23, 42, 0.95)` |
| Tooltip border | `rgba(59, 130, 246, 0.2)` |

## Buttons

| Variant | Style |
|---|---|
| Primary | `bg-primary/20 text-primary border border-primary/30` |
| Secondary | `text-muted border border-glass-border hover:bg-sidebar-hover` |
| Action | `bg-success/20 text-success` / `bg-destructive/20 text-destructive` |

## Tables

| Element | Style |
|---|---|
| Header | 12px uppercase, muted color, tracking-wider |
| Row hover | `bg-sidebar-hover` |
| Dividers | `border-card-border` |
| Stripes | None (clean design) |

# Void Glass — Design System

## Couleurs

```css
--fos-bg       : #06070C                   /* Background principal */
--fos-accent   : #5EEAD4                   /* Accent primaire (turquoise) */
--fos-card-bg  : rgba(255,255,255,.025)    /* Cards/surfaces */
--fos-border   : rgba(255,255,255,.055)    /* Borders/dividers */
--fos-text     : rgba(255,255,255,.88)     /* Texte principal */
--fos-muted    : rgba(255,255,255,.42)     /* Texte secondaire */
```

## Orbs (effets de fond)

```css
--fos-orb-1    : rgba(94,234,212,.09)      /* Turquoise blur(80px) */
--fos-orb-2    : rgba(167,139,250,.09)     /* Purple blur(80px) */
--fos-orb-3    : rgba(59,130,246,.09)      /* Blue blur(80px) */
```

## Typographie

```css
--fos-font-ui   : 'Figtree', system-ui, sans-serif
--fos-font-mono : 'JetBrains Mono', 'Fira Code', monospace
```

Weights : 400, 500, 600, 700, 800

## Border Radius

```css
--fos-radius-card  : 12px    /* Cards principales */
--fos-radius-pill  : 8px     /* Pills/badges */
--fos-radius-input : 6px     /* Inputs/controls */
```

## Animations

```css
--fos-anim-duration : 0.25s
--fos-anim-easing   : ease
--fos-anim-stagger  : 40ms
```

## Interdictions

- #0A0A0B ou #08080A (toujours #06070C)
- Outfit, Inter, system-ui seul (toujours Figtree en premier)
- Borders droits (minimum 6px radius)
- Couleurs hardcodees (toujours variables CSS)

## Figma Mapping

| Figma Variable | Token | Valeur |
|----------------|-------|--------|
| color/background/primary | --fos-bg | #06070C |
| color/accent/primary | --fos-accent | #5EEAD4 |
| color/surface/card | --fos-card-bg | rgba(255,255,255,.025) |
| color/border/default | --fos-border | rgba(255,255,255,.055) |
| typography/family/ui | --fos-font-ui | Figtree |
| typography/family/mono | --fos-font-mono | JetBrains Mono |
| spacing/radius/card | --fos-radius-card | 12px |
| spacing/radius/pill | --fos-radius-pill | 8px |

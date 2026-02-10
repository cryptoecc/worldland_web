# Design System: Sharp & Solid

WorldLand 에코시스템 전체(Landing, Cloud, Docs)에 적용되는 통합 디자인 시스템입니다.

## Core Principles

**Digital Brutalism**과 **Swiss Style**에서 영감을 받은 디자인으로, 날카롭고 단단한 시각적 정체성을 제공합니다.

### 1. No-Round (Zero Radius)

모든 컴포넌트에 `border-radius: 0` 정책을 적용합니다.

- **Buttons**: 모든 버튼은 직각
- **Cards**: 모든 카드 컴포넌트는 직각
- **Inputs**: 입력 필드 및 모달도 직각
- **Dropdowns**: 드롭다운 메뉴도 직각

```css
* {
  border-radius: 0 !important;
}
```

### 2. Color Palette

| Color                   | Hex Code  | Usage                          |
| ----------------------- | --------- | ------------------------------ |
| **Solid Black**         | `#000000` | Primary background             |
| **Deep Black**          | `#050505` | Navigation, sidebar            |
| **Dark Gray**           | `#111111` | Card backgrounds               |
| **Solid White**         | `#FFFFFF` | Primary text, headings         |
| **Light Gray**          | `#A1A1AA` | Secondary text                 |
| **Border Gray**         | `#27272A` | Subtle borders                 |
| **WorldLand Red**       | `#D32F2F` | Primary accent (logo match)    |
| **WorldLand Red Light** | `#E53935` | Hover states, highlights       |
| **WorldLand Red Dark**  | `#B71C1C` | Active states, pressed buttons |

### 3. Hard Borders

그림자(shadow) 대신 시각적 무게감과 타이포그래피로 계층을 표현합니다.

- Subtle `1px` borders (`#27272A`)
- Typography-driven hierarchy
- No drop shadows

## Framework Implementation

### Next.js (Landing & Cloud)

Tailwind v4 변수를 통해 관리:

```css
:root {
  --radius: 0rem;
  --primary: oklch(0.6 0.22 25); /* WorldLand Red */
}
```

Global CSS reset:

```css
* {
  border-radius: 0 !important;
}
```

### VitePress (Docs)

`.vitepress/theme/custom.css`에서 오버라이드:

```css
:root {
  --vp-radius: 0px;
  --vp-radius-sm: 0px;
  --vp-radius-md: 0px;
  --vp-c-bg: #000000;
  --vp-c-bg-alt: #050505;
}
```

## Typography

- **Font Family**: Inter (Google Fonts)
- **Heading Style**: Pure White (`#FFFFFF`) on Solid Black
- **Heading Gradient**: `linear-gradient(to right, #ffffff, #999999)` with `background-clip: text`

## UI Components

### Navigation Bar

- Height: `96px` (matches `h-24` Tailwind class)
- Background: `backdrop-filter: blur(16px)` with 0.05 opacity border
- Style: Translucent glass effect over Solid Black

### Sidebar (Docs)

- Background: `#050505`
- Border: `1px solid #27272A`
- Active state: WorldLand Red (`#E53935`) with `font-weight: 700`

### Buttons

- Primary: Solid WorldLand Red background
- No gradients, no rounded corners
- High contrast text

### Scrollbars

- Width: `8px`
- Hover color: WorldLand Red (`#E53935`)

## Dark Mode Only

Light/Dark 토글은 비활성화되어 있습니다. 항상 Dark Mode만 사용합니다.

```css
.VPSwitchAppearance {
  display: none !important;
}
```

VitePress config:

```js
export default {
  appearance: 'dark',
};
```

## Content Guidelines

### Visual De-cluttering

- No emojis in technical tables and headers
- No decorative elements that break the "Solid" aesthetic
- Minimal, purposeful icons only

### Branding Consistency

- Token name: **WorldLand Token ($WL)**
- Logo: High-resolution `logo.png` in `/public`
- English-only for global developer audience

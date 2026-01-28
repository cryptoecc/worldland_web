# 🧩 WorldLand 컴포넌트 디자인 가이드 v2.0

> **버전**: 2.0  
> **작성일**: 2026-01-27  
> **레퍼런스**: Sui.io  
> **코어 컬러**: Red (#E53935) + Black (#09090B)

---

## 📋 목차

1. [디자인 토큰](#1-디자인-토큰)
2. [버튼](#2-버튼)
3. [카드](#3-카드)
4. [네비게이션](#4-네비게이션)
5. [폼 요소](#5-폼-요소)
6. [데이터 표시](#6-데이터-표시)
7. [피드백](#7-피드백)
8. [Web3 컴포넌트](#8-web3-컴포넌트)

---

## 1. 디자인 토큰

### 1.1 Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Primary - WorldLand Red
        wld: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
          DEFAULT: '#E53935',  // WorldLand Signature Red
        },

        // Neutral - Dark Theme
        dark: {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
          950: '#09090B',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        hero: ['clamp(48px, 10vw, 120px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        display: ['clamp(40px, 8vw, 80px)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        xl: ['20px', { lineHeight: '1.4' }],
        lg: ['18px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.5' }],
        xs: ['12px', { lineHeight: '1.5' }],
      },
      spacing: {
        'section': 'clamp(80px, 15vh, 160px)',
        'container': 'clamp(20px, 5vw, 80px)',
      },
      maxWidth: {
        'container': '1400px',
      },
      borderRadius: {
        '4xl': '32px',
      },
      boxShadow: {
        'glow-red': '0 0 40px rgba(229, 57, 53, 0.3)',
        'glow-red-lg': '0 0 80px rgba(229, 57, 53, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse at 50% 0%, rgba(229, 57, 53, 0.15) 0%, transparent 50%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### 1.2 CSS Variables

```css
/* globals.css */
@layer base {
  :root {
    --wld-red: #E53935;
    --wld-red-rgb: 229, 57, 53;
    
    --background: #000000;
    --foreground: #FFFFFF;
    --muted: #71717A;
    --border: #27272A;
    --card: #18181B;
    --card-hover: #27272A;
  }
}

@layer utilities {
  .text-gradient-red {
    background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .bg-glow-red {
    background: radial-gradient(
      circle at center,
      rgba(229, 57, 53, 0.3) 0%,
      rgba(229, 57, 53, 0.1) 40%,
      transparent 70%
    );
  }
}
```

---

## 2. 버튼

### 2.1 Button Variants

```
┌─────────────────────────────────────────────────────────────────────┐
│ Button Variants (Sui Style + Red Theme)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Primary                                                            │
│  ┌─────────────────────────────────────┐                           │
│  │ ████████ Get Started ████████████  │                           │
│  └─────────────────────────────────────┘                           │
│  - bg: wld (#E53935)                                                │
│  - text: white                                                      │
│  - hover: wld-400 (#F87171) + shadow-glow-red                      │
│  - active: wld-600 (#DC2626)                                        │
│                                                                     │
│  Secondary (Outline)                                                │
│  ┌─────────────────────────────────────┐                           │
│  │ ──────── Read Docs ────────────────│                           │
│  └─────────────────────────────────────┘                           │
│  - bg: transparent                                                  │
│  - border: dark-700                                                 │
│  - text: white                                                      │
│  - hover: bg dark-800, border dark-600                             │
│                                                                     │
│  Ghost                                                              │
│  ┌─────────────────────────────────────┐                           │
│  │         Learn more →                │                           │
│  └─────────────────────────────────────┘                           │
│  - text: dark-400                                                   │
│  - hover: text white, → 오른쪽 이동                                 │
│                                                                     │
│  Icon                                                               │
│  ┌─────┐                                                            │
│  │  →  │  - 정사각형, 호버 시 bg 변경                               │
│  └─────┘                                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Button Component

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wld focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-wld text-white hover:bg-wld-400 hover:shadow-glow-red active:bg-wld-600',
        secondary:
          'border border-dark-700 bg-transparent text-white hover:bg-dark-800 hover:border-dark-600',
        ghost:
          'text-dark-400 hover:text-white group',
        destructive:
          'bg-red-600 text-white hover:bg-red-500',
        link:
          'text-wld underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-lg',
        lg: 'h-12 px-6 text-lg rounded-lg',
        xl: 'h-14 px-8 text-lg rounded-xl',
        icon: 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4" fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
      {variant === 'ghost' && (
        <span className="transition-transform group-hover:translate-x-1">→</span>
      )}
    </button>
  );
}
```

---

## 3. 카드

### 3.1 Card Variants

```
┌─────────────────────────────────────────────────────────────────────┐
│ Card Variants (Sui Style)                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Feature Card                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  ⛏️                                                         │   │
│  │                                                             │   │
│  │  True Decentralization                                      │   │
│  │                                                             │   │
│  │  ASIC-resistant mining with ECCPoW ensures                  │   │
│  │  fair and equal access to block rewards.                    │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  - bg: dark-900/50                                                  │
│  - border: dark-800                                                 │
│  - hover: border-wld/30, shadow-glow-red (subtle)                  │
│  - radius: xl (12px)                                                │
│  - padding: 24px                                                    │
│                                                                     │
│  Link Card (Clickable)                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                         →   │   │
│  │  Start Mining                                               │   │
│  │                                                             │   │
│  │  Run a node and earn WLC tokens by contributing            │   │
│  │  to network security.                                       │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  - 전체 영역 클릭 가능                                               │
│  - 호버 시 → 아이콘 이동                                             │
│  - 커서: pointer                                                    │
│                                                                     │
│  Stat Card                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  1,234                                                      │   │
│  │  ──────                                                     │   │
│  │  Active Mining Nodes                                        │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  - 숫자: font-display, text-4xl, white                             │
│  - 레이블: text-sm, dark-500                                        │
│                                                                     │
│  Glass Card (Hero/Overlay)                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  │ ░░                                                      ░░ │   │
│  │ ░░  Content with backdrop blur                          ░░ │   │
│  │ ░░                                                      ░░ │   │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  - bg: dark-950/80                                                  │
│  - backdrop-blur: lg                                                │
│  - border: dark-800/50                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Card Component

```tsx
// components/ui/card.tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-xl transition-all duration-300',
  {
    variants: {
      variant: {
        default:
          'bg-dark-900/50 border border-dark-800 p-6',
        feature:
          'bg-dark-900/50 border border-dark-800 p-6 ' +
          'hover:border-wld/30 hover:shadow-[0_0_40px_rgba(229,57,53,0.1)]',
        link:
          'bg-dark-900/50 border border-dark-800 p-6 cursor-pointer group ' +
          'hover:border-wld/30 hover:bg-dark-800/50',
        stat:
          'bg-transparent p-4',
        glass:
          'bg-dark-950/80 backdrop-blur-lg border border-dark-800/50 p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

// Feature Card
export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card variant="feature">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-dark-400">{description}</p>
    </Card>
  );
}

// Link Card
export function LinkCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a href={href}>
      <Card variant="link" className="relative">
        <span className="absolute top-6 right-6 text-dark-500 transition-transform group-hover:translate-x-1 group-hover:text-white">
          →
        </span>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-dark-400 pr-8">{description}</p>
      </Card>
    </a>
  );
}

// Stat Card
export function StatCard({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <Card variant="stat" className="text-center">
      <div className="font-display text-4xl text-white mb-1">{value}</div>
      <div className="text-sm text-dark-500">{label}</div>
    </Card>
  );
}
```

---

## 4. 네비게이션

### 4.1 Header with Mega Menu

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header (Sui Style Mega Menu)                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Default State                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔴 worldland   Platform▾  Solutions▾  Developers▾  [Start] │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  - position: fixed                                                  │
│  - bg: transparent → scrolled: dark-950/95 + blur                   │
│  - height: 80px                                                     │
│  - z-index: 50                                                      │
│                                                                     │
│  Mega Menu (Platform Hover)                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔴 worldland   Platform▾  Solutions▾  Developers▾  [Start] │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ ┌─────────────────────────────────────────────────────────┐ │   │
│  │ │                                                         │ │   │
│  │ │  TECHNOLOGY           TOKEN ECONOMICS                   │ │   │
│  │ │                                                         │ │   │
│  │ │  ECCPoW Consensus     WLC Tokenomics                    │ │   │
│  │ │  ASIC-resistant       Supply schedule                   │ │   │
│  │ │  mining algorithm     and distribution                  │ │   │
│  │ │                                                         │ │   │
│  │ │  Post-Quantum         Staking                           │ │   │
│  │ │  Future-proof         Earn rewards by                   │ │   │
│  │ │  cryptography         staking WLC                       │ │   │
│  │ │                                                         │ │   │
│  │ │  Mining Guide         ─────────────────                 │ │   │
│  │ │  Start mining                                           │ │   │
│  │ │  with our guide       INFRASTRUCTURE                    │ │   │
│  │ │                                                         │ │   │
│  │ │  ─────────────────    Node Network                      │ │   │
│  │ │                       View active nodes                 │ │   │
│  │ │  EVM Compatible                                         │ │   │
│  │ │  Deploy Solidity      Block Explorer                    │ │   │
│  │ │  smart contracts      Explore the chain                 │ │   │
│  │ │                                                         │ │   │
│  │ └─────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  - animation: fadeIn + slideDown (200ms)                            │
│  - bg: dark-950/95 + backdrop-blur-xl                               │
│  - border-bottom: dark-800                                          │
│  - 섹션 구분: 컬럼 레이아웃                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Header Component Structure

```tsx
// components/layout/header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

const menuItems = [
  {
    label: 'Platform',
    sections: [
      {
        title: 'TECHNOLOGY',
        items: [
          { label: 'ECCPoW Consensus', description: 'ASIC-resistant mining algorithm', href: '/eccpow' },
          { label: 'Post-Quantum', description: 'Future-proof cryptography', href: '/post-quantum' },
          { label: 'Mining Guide', description: 'Start mining with our guide', href: '/mining' },
          { label: 'EVM Compatible', description: 'Deploy Solidity smart contracts', href: '/evm' },
        ],
      },
      {
        title: 'TOKEN ECONOMICS',
        items: [
          { label: 'WLC Tokenomics', description: 'Supply schedule and distribution', href: '/tokenomics' },
          { label: 'Staking', description: 'Earn rewards by staking WLC', href: '/staking' },
        ],
      },
      {
        title: 'INFRASTRUCTURE',
        items: [
          { label: 'Node Network', description: 'View active nodes', href: '/nodes' },
          { label: 'Block Explorer', description: 'Explore the chain', href: '/explorer' },
        ],
      },
    ],
  },
  {
    label: 'Solutions',
    sections: [
      {
        title: 'USE CASES',
        items: [
          { label: 'DeFi', description: 'Decentralized finance apps', href: '/defi' },
          { label: 'Bridge', description: 'Cross-chain transfers', href: '/bridge' },
          { label: 'Developers', description: 'Build on WorldLand', href: '/developers' },
        ],
      },
    ],
  },
  {
    label: 'Developers',
    sections: [
      {
        title: 'RESOURCES',
        items: [
          { label: 'Documentation', description: 'Complete guides and API reference', href: '/docs' },
          { label: 'SDK', description: 'Development tools and libraries', href: '/sdk' },
          { label: 'Faucet', description: 'Get testnet WLC', href: '/faucet' },
        ],
      },
      {
        title: 'COMMUNITY',
        items: [
          { label: 'Discord', description: 'Join the discussion', href: 'https://discord.gg/worldland' },
          { label: 'GitHub', description: 'View source code', href: 'https://github.com/worldland' },
        ],
      },
    ],
  },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-dark-950/95 backdrop-blur-xl border-b border-dark-800'
          : 'bg-transparent'
      )}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="max-w-container mx-auto px-container">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8" />
          </Link>

          {/* Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.label)}
              >
                <button className="flex items-center gap-1 text-dark-400 hover:text-white transition-colors py-2">
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button size="md">Get Started</Button>
        </nav>

        {/* Mega Menu */}
        {activeMenu && (
          <MegaMenu
            sections={menuItems.find((m) => m.label === activeMenu)?.sections || []}
            onClose={() => setActiveMenu(null)}
          />
        )}
      </div>
    </header>
  );
}

function MegaMenu({
  sections,
  onClose,
}: {
  sections: typeof menuItems[0]['sections'];
  onClose: () => void;
}) {
  return (
    <div
      className="absolute left-0 right-0 bg-dark-950/95 backdrop-blur-xl border-b border-dark-800 animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseLeave={onClose}
    >
      <div className="max-w-container mx-auto px-container py-8">
        <div className="grid grid-cols-3 gap-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group block"
                      onClick={onClose}
                    >
                      <span className="text-white group-hover:text-wld transition-colors">
                        {item.label}
                      </span>
                      <span className="block text-sm text-dark-500">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 5. 폼 요소

### 5.1 Input

```
┌─────────────────────────────────────────────────────────────────────┐
│ Input (Dark Theme)                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Default                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Email address                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  - bg: dark-900                                                     │
│  - border: dark-800                                                 │
│  - text: white                                                      │
│  - placeholder: dark-500                                            │
│  - focus: ring-2 ring-wld/50, border-wld/50                        │
│                                                                     │
│  Error                                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Invalid email                                               │   │
│  │ ⚠ Please enter a valid email address                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  - border: wld                                                      │
│  - error message: wld, text-sm                                      │
│                                                                     │
│  With Icon                                                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔍  Search...                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Input Component

```tsx
// components/ui/input.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-dark-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-10 px-4 rounded-lg',
              'bg-dark-900 border border-dark-800',
              'text-white placeholder:text-dark-500',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-wld/50 focus:border-wld/50',
              icon && 'pl-10',
              error && 'border-wld ring-1 ring-wld/30',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-wld flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
```

---

## 6. 데이터 표시

### 6.1 Statistics Section

```
┌─────────────────────────────────────────────────────────────────────┐
│ Statistics Section (Sui Style)                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │           NETWORK STATISTICS                                │   │
│  │                                                             │   │
│  │   1,234           40.9M          99.9%         3,500       │   │
│  │   ─────           ─────          ─────         ─────       │   │
│  │   Active          Total          Network       Active      │   │
│  │   Nodes           Supply         Uptime        Wallets     │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  - 레이아웃: 가로 4열 그리드                                         │
│  - 숫자: font-display, text-4xl~5xl                                 │
│  - 레이블: 언더라인 구분, text-sm, dark-500                          │
│  - 배경: subtle gradient or glass                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Chart (Node Activity)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Chart Section                                                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                                              [1D][7D][1M]  │    │
│  │                                                            │    │
│  │  1.5k  ┤                         ╭────╮                    │    │
│  │        │                    ╭────╯░░░░╰────╮              │    │
│  │  1.0k  ┤    ╭──────────────╯░░░░░░░░░░░░░░╰────          │    │
│  │        │╭───╯░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░          │    │
│  │  0.5k  ┤░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░          │    │
│  │        ├────────────────────────────────────────          │    │
│  │        Jan    Feb    Mar    Apr    May    Jun             │    │
│  │                                                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Style:                                                             │
│  - 차트 영역: 레드 그라디언트 fill                                   │
│  - 라인: wld (#E53935)                                              │
│  - 그리드: dark-800, 점선                                           │
│  - 축 레이블: dark-500                                              │
│  - 배경: dark-900/50                                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. 피드백

### 7.1 Toast

```
┌─────────────────────────────────────────────────────────────────────┐
│ Toast Notifications                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Success                                                            │
│  ┌───────────────────────────────────────────────────────┐         │
│  │ ✓  Transaction confirmed                         ✕   │         │
│  │    View on explorer →                                │         │
│  └───────────────────────────────────────────────────────┘         │
│  - 좌측 아이콘: green                                               │
│                                                                     │
│  Error                                                              │
│  ┌───────────────────────────────────────────────────────┐         │
│  │ ✕  Transaction failed                            ✕   │         │
│  │    Insufficient balance                              │         │
│  └───────────────────────────────────────────────────────┘         │
│  - 좌측 아이콘: wld (red)                                           │
│                                                                     │
│  Loading                                                            │
│  ┌───────────────────────────────────────────────────────┐         │
│  │ ◠◡◠  Confirming transaction...                        │         │
│  └───────────────────────────────────────────────────────┘         │
│                                                                     │
│  - Position: bottom-right                                           │
│  - Animation: slide in from right                                   │
│  - bg: dark-900, border: dark-800                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.2 Modal

```
┌─────────────────────────────────────────────────────────────────────┐
│ Modal                                                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ Backdrop ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      │
│  ▓▓                                                           ▓▓   │
│  ▓▓    ┌─────────────────────────────────────────────────┐   ▓▓   │
│  ▓▓    │                                             ✕   │   ▓▓   │
│  ▓▓    │  Confirm Transaction                            │   ▓▓   │
│  ▓▓    │                                                 │   ▓▓   │
│  ▓▓    │  ─────────────────────────────────────────────  │   ▓▓   │
│  ▓▓    │                                                 │   ▓▓   │
│  ▓▓    │  You are about to swap                          │   ▓▓   │
│  ▓▓    │  100 WLC → 0.05 ETH                             │   ▓▓   │
│  ▓▓    │                                                 │   ▓▓   │
│  ▓▓    │  ─────────────────────────────────────────────  │   ▓▓   │
│  ▓▓    │                                                 │   ▓▓   │
│  ▓▓    │                 [Cancel]  [██ Confirm ██]       │   ▓▓   │
│  ▓▓    │                                                 │   ▓▓   │
│  ▓▓    └─────────────────────────────────────────────────┘   ▓▓   │
│  ▓▓                                                           ▓▓   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│                                                                     │
│  - Backdrop: dark-950/80 + blur                                     │
│  - Modal: dark-900, border: dark-800                                │
│  - Animation: scale up + fade                                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Web3 컴포넌트

### 8.1 Wallet Connect Button

```
┌─────────────────────────────────────────────────────────────────────┐
│ Wallet Connection                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Disconnected                                                       │
│  ┌─────────────────────────────────────┐                           │
│  │ ██████ Connect Wallet █████████████│                           │
│  └─────────────────────────────────────┘                           │
│                                                                     │
│  Connected                                                          │
│  ┌─────────────────────────────────────┐                           │
│  │ 🎨  0x1234...5678             ▾    │                           │
│  └─────────────────────────────────────┘                           │
│  - 🎨 = Blockies/Jazzicon                                           │
│  - 호버 시 드롭다운                                                  │
│                                                                     │
│  Dropdown                                                           │
│  ┌─────────────────────────────────────┐                           │
│  │  Balance: 1,234.56 WLC             │                           │
│  │  ─────────────────────────────────  │                           │
│  │  Copy Address                       │                           │
│  │  View on Explorer                   │                           │
│  │  ─────────────────────────────────  │                           │
│  │  Disconnect                         │                           │
│  └─────────────────────────────────────┘                           │
│                                                                     │
│  Wrong Network                                                      │
│  ┌─────────────────────────────────────┐                           │
│  │ ⚠ Wrong Network                    │                           │
│  │ [Switch to WorldLand]               │                           │
│  └─────────────────────────────────────┘                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Token Amount Input

```
┌─────────────────────────────────────────────────────────────────────┐
│ Token Input (Swap Style)                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │  You Pay                                                    │   │
│  │                                                             │   │
│  │  ┌───────────────────────────────────────────────────────┐│   │
│  │  │                                                       ││   │
│  │  │  100.00                     [🔴 WLC ▾]               ││   │
│  │  │                                                       ││   │
│  │  │  ≈ $234.56                   Balance: 1,234.56       ││   │
│  │  │                                                       ││   │
│  │  │  [25%] [50%] [75%] [MAX]                              ││   │
│  │  │                                                       ││   │
│  │  └───────────────────────────────────────────────────────┘│   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  - 숫자 입력: font-display, text-3xl                                │
│  - 토큰 선택: 드롭다운                                               │
│  - USD 환산: text-sm, dark-500                                      │
│  - 퍼센트 버튼: 빠른 선택                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📌 구현 체크리스트

### Week 1: 기본 컴포넌트
- [ ] Button (4 variants)
- [ ] Card (4 variants)
- [ ] Input
- [ ] Logo

### Week 2: 레이아웃
- [ ] Header (Mega Menu)
- [ ] Footer
- [ ] Container
- [ ] Section

### Week 3: 피드백
- [ ] Toast (sonner)
- [ ] Modal
- [ ] Tooltip
- [ ] Skeleton

### Week 4: Web3
- [ ] Wallet Connect
- [ ] Token Input
- [ ] Transaction Status
- [ ] Network Switch

---

*레드/블랙 테마와 Sui.io 스타일을 결합한 컴포넌트 가이드입니다.*

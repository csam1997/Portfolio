'use client';

import { useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type GlowColor = 'blue' | 'green' | 'orange' | 'purple' | 'red';
type GlowSize = 'sm' | 'md' | 'lg';

type GlowCardProps = {
  children?: ReactNode;
  className?: string;
  customSize?: boolean;
  glowColor?: GlowColor;
  height?: number | string;
  size?: GlowSize;
  width?: number | string;
};

const glowColorMap: Record<GlowColor, { base: number; spread: number }> = {
  blue: { base: 220, spread: 200 },
  green: { base: 120, spread: 200 },
  orange: { base: 30, spread: 200 },
  purple: { base: 280, spread: 300 },
  red: { base: 0, spread: 200 },
};

const sizeMap: Record<GlowSize, string> = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
};

function toCssLength(value: number | string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

let activeGlowCards = 0;
let removeGlobalPointerSync: (() => void) | null = null;

function ensureGlobalPointerSync() {
  if (typeof document === 'undefined' || removeGlobalPointerSync) {
    return;
  }

  const root = document.documentElement;
  const syncPointer = (event: PointerEvent) => {
    const { clientX, clientY } = event;
    root.style.setProperty('--x', clientX.toFixed(2));
    root.style.setProperty('--xp', (clientX / window.innerWidth).toFixed(2));
    root.style.setProperty('--y', clientY.toFixed(2));
    root.style.setProperty('--yp', (clientY / window.innerHeight).toFixed(2));
  };

  document.addEventListener('pointermove', syncPointer, { passive: true });
  removeGlobalPointerSync = () => {
    document.removeEventListener('pointermove', syncPointer);
  };
}

export function GlowCard({
  children,
  className = '',
  customSize = false,
  glowColor = 'blue',
  height,
  size = 'md',
  width,
}: GlowCardProps) {
  useEffect(() => {
    activeGlowCards += 1;
    ensureGlobalPointerSync();

    return () => {
      activeGlowCards -= 1;

      if (activeGlowCards === 0 && removeGlobalPointerSync) {
        removeGlobalPointerSync();
        removeGlobalPointerSync = null;
      }
    };
  }, []);

  const { base, spread } = glowColorMap[glowColor];
  const style = {
    '--backdrop': 'hsl(0 0% 60% / 0.12)',
    '--backup-border': 'var(--backdrop)',
    '--base': base,
    '--border': '3',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    '--outer': '1',
    '--radius': '14',
    '--size': '200',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--spread': spread,
    backgroundAttachment: 'fixed',
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px)
      calc(var(--y, 0) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)),
      transparent
    )`,
    backgroundPosition: '50% 50%',
    backgroundSize:
      'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    border: 'var(--border-size) solid var(--backup-border)',
    height: toCssLength(height),
    position: 'relative',
    width: toCssLength(width),
  } as CSSProperties;

  const sizeClasses = customSize ? '' : sizeMap[size];

  return (
    <div
      data-glow
      style={style}
      className={`${sizeClasses} ${customSize ? '' : 'aspect-[3/4]'} relative grid grid-rows-[1fr_auto] gap-4 rounded-2xl p-4 shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[5px] ${className}`}
    >
      <div data-glow />
      {children}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Only show custom cursor on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    let animFrame: number;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      cancelAnimationFrame(animFrame);
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

      const animate = () => {
        currentX = lerp(currentX, e.clientX, 0.12);
        currentY = lerp(currentY, e.clientY, 0.12);
        setRingPos({ x: currentX, y: currentY });
        if (Math.abs(currentX - e.clientX) > 0.5 || Math.abs(currentY - e.clientY) > 0.5) {
          animFrame = requestAnimationFrame(animate);
        }
      };
      animFrame = requestAnimationFrame(animate);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor]')) {
        setIsHovering(true);
      }
    };

    const onMouseOut = () => setIsHovering(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Dot */}
      <div
        className="fixed pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-brand-navy mix-blend-multiply hidden lg:block"
        style={{
          left: pos.x - 3,
          top: pos.y - 3,
          transition: 'none',
        }}
      />
      {/* Ring */}
      <div
        className={`fixed pointer-events-none z-[9998] rounded-full border-2 border-brand-navy/40 mix-blend-multiply transition-[width,height] duration-150 hidden lg:block ${
          isHovering ? 'w-12 h-12' : 'w-8 h-8'
        }`}
        style={{
          left: ringPos.x - (isHovering ? 24 : 16),
          top: ringPos.y - (isHovering ? 24 : 16),
        }}
      />
    </>
  );
}

'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    setIsTouchDevice(isTouch)
    if (isTouch) return

    document.body.classList.add('custom-cursor-active');

    let mouseX = 0, mouseY = 0
    let circleX = 0, circleY = 0
    let animFrameId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      circleX += (mouseX - circleX) * 0.18
      circleY += (mouseY - circleY) * 0.18
      
      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${circleX - (isHovering ? 24 : 16)}px, ${circleY - (isHovering ? 24 : 16)}px)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`
      }
      animFrameId = requestAnimationFrame(animate)
    }
    animFrameId = requestAnimationFrame(animate)

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const hoverable = target.closest('a, button, [data-cursor], .card')
      setIsHovering(!!hoverable)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseover', onMouseOver)

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', onMouseOver)
      document.body.classList.remove('custom-cursor-active');
    }
  }, [isHovering])

  if (isTouchDevice) return null

  return (
    <>
      {/* Small dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999]"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#0F2557',
          opacity: 0.7,
          left: 0,
          top: 0,
        }}
      />
      {/* Larger circle */}
      <div
        ref={circleRef}
        className="fixed pointer-events-none z-[9998] transition-all duration-150"
        style={{
          width: isHovering ? '48px' : '32px',
          height: isHovering ? '48px' : '32px',
          borderRadius: '50%',
          border: '1.5px solid #0F2557',
          backgroundColor: 'transparent',
          opacity: 0.7,
          left: 0,
          top: 0,
        }}
      />
    </>
  )
}

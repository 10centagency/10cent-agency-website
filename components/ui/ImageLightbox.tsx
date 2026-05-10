'use client'

import { useState, useEffect } from 'react'
import { X, ZoomIn } from 'lucide-react'

interface ImageLightboxProps {
  src: string
  alt: string
  caption?: string
  className?: string
}

export default function ImageLightbox({ 
  src, alt, caption, className 
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Clickable image with hover overlay */}
      <div
        className="relative group cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full rounded-xl shadow-md transition-transform duration-300 group-hover:brightness-95 ${className || ''}`}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-xl bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <ZoomIn className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <p className="text-sm text-center text-brand-textMid italic mt-2">
          {caption}
        </p>
      )}

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-[1000] bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image container */}
          <div
            className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="object-contain max-h-[85vh] w-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* Caption in lightbox */}
          {caption && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-4 py-2 rounded-full">
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  )
}

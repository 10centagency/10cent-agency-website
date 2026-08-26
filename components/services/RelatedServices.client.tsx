'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { getRelatedServices, RelatedServiceItem } from './relatedServicesData';
import styles from './RelatedServices.module.css';

interface RelatedServicesProps {
  currentSlug: string;
  className?: string;
}

export default function RelatedServices({ currentSlug, className }: RelatedServicesProps) {
  const relatedServices: RelatedServiceItem[] = getRelatedServices(currentSlug);
  const itemCount = relatedServices.length; // 6

  // 3 copies: prefix clones (0..5), real items (6..11), suffix clones (12..17)
  const realStartIndex = itemCount; // 6
  const [currentIndex, setCurrentIndex] = useState(realStartIndex);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isAnimatingRef = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    isAnimatingRef.current = false;

    // If we reached suffix clones (>= 12), snap back to real items (6..11)
    if (currentIndex >= realStartIndex + itemCount) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev - itemCount);
    }
    // If we reached prefix clones (< 6), snap forward to real items (6..11)
    else if (currentIndex < realStartIndex) {
      setEnableTransition(false);
      setCurrentIndex((prev) => prev + itemCount);
    }
  }, [currentIndex, itemCount, realStartIndex]);

  // Touch swipe support for tablet/desktop track
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // Build extended items: prefix clones + real items + suffix clones
  const extendedItems: { service: RelatedServiceItem; isClone: boolean; key: string; realIndex: number }[] = [
    ...relatedServices.map((service, idx) => ({
      service,
      isClone: true,
      key: `prefix-${service.id}-${idx}`,
      realIndex: idx,
    })),
    ...relatedServices.map((service, idx) => ({
      service,
      isClone: false,
      key: `real-${service.id}-${idx}`,
      realIndex: idx,
    })),
    ...relatedServices.map((service, idx) => ({
      service,
      isClone: true,
      key: `suffix-${service.id}-${idx}`,
      realIndex: idx,
    })),
  ];

  return (
    <div className={`${styles.carouselContainer} ${className || ''}`}>
      {/* Navigation Arrows (Always enabled for infinite wrap) */}
      <button
        type="button"
        className={`${styles.arrowButton} ${styles.arrowPrev}`}
        onClick={handlePrev}
        aria-label="Show previous services"
      >
        <FaChevronLeft aria-hidden="true" />
      </button>

      <button
        type="button"
        className={`${styles.arrowButton} ${styles.arrowNext}`}
        onClick={handleNext}
        aria-label="Show next services"
      >
        <FaChevronRight aria-hidden="true" />
      </button>

      {/* Viewport & Track */}
      <div
        className={styles.viewport}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`${styles.track} ${enableTransition ? styles.trackTransition : ''}`}
          style={{ '--active-index': currentIndex } as React.CSSProperties}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedItems.map((item) => {
            const { service, isClone, key, realIndex } = item;
            const Icon = service.icon;

            // Mobile visibility logic (applies only to real items; clones are hidden via CSS on mobile)
            const isExtraOnMobile = realIndex >= 4;
            const mobileVisibilityClass = !isClone && isMounted
              ? isExtraOnMobile
                ? isExpanded
                  ? styles.revealed
                  : styles.mobileHidden
                : ''
              : '';

            const cloneClass = isClone ? styles.desktopClone : '';
            const cardClasses = `${styles.card} ${cloneClass} ${mobileVisibilityClass}`.trim();

            return (
              <Link
                key={key}
                href={service.href}
                className={cardClasses}
                tabIndex={isClone ? -1 : undefined}
                aria-hidden={isClone ? true : undefined}
              >
                <div className={styles.cardContent}>
                  <div className={styles.iconWrapper}>
                    <Icon aria-hidden="true" />
                  </div>
                  <h4 className={styles.title}>{service.name}</h4>
                  <p className={styles.description}>{service.description}</p>
                </div>
                <span className={styles.linkText}>
                  Learn More <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Load More Button */}
      {isMounted && !isExpanded && (
        <div className={styles.loadMoreWrapper}>
          <button
            type="button"
            className={styles.loadMoreBtn}
            onClick={() => setIsExpanded(true)}
            aria-expanded={false}
            aria-label="Load more related services"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaFolderOpen,
  FaMagnifyingGlass,
  FaTableCells,
  FaFolder,
  FaCircleInfo,
  FaFileContract,
  FaChevronRight,
  FaPenNib,
  FaVectorSquare,
  FaFilePdf,
  FaImage,
  FaFileImage,
  FaCode,
  FaCircle,
} from 'react-icons/fa6';
import styles from './GraphicDesign.module.css';
import { fileDeliveryData } from './graphicDesignData';

const fileIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaPenNib,
  FaVectorSquare,
  FaFilePdf,
  FaImage,
  FaFileImage,
  FaCode,
};

export default function GdFileDelivery() {
  const deliveryRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (deliveryRef.current) {
      observer.observe(deliveryRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const animatedState = !isClient || isVisible;

  return (
    <div ref={deliveryRef} className={styles.fdWindow}>
      {/* Titlebar */}
      <div className={styles.fdTitlebar}>
        <div className={styles.fdDots}>
          <span className={styles.psDotRed} />
          <span className={styles.psDotYellow} />
          <span className={styles.psDotGreen} />
        </div>
        <div className={styles.fdPath}>
          <FaFolderOpen className={styles.fdPathIcon} aria-hidden="true" />
          <span>10 Cent Agency</span>
          <span className={styles.fdPathSep}>/</span>
          <span>Client Delivery</span>
          <span className={styles.fdPathSep}>/</span>
          <span className={styles.fdPathCurrent}>BrandIdentity_Final</span>
        </div>
        <div className={styles.fdTitlebarRight}>
          <FaMagnifyingGlass aria-hidden="true" />
          <FaTableCells aria-hidden="true" />
        </div>
      </div>

      <div className={styles.fdBody}>
        {/* Sidebar */}
        <div className={styles.fdSidebar}>
          <div className={styles.fdSidebarLabel}>Delivery Folders</div>
          <div className={`${styles.fdFolder} ${styles.fdFolderActive}`}>
            <FaFolder className={styles.fdFolderIcon} aria-hidden="true" />
            <span>All Final Files</span>
          </div>
          <div className={styles.fdFolder}>
            <FaFolder className={styles.fdFolderIcon} aria-hidden="true" />
            <span>Master Source</span>
          </div>
          <div className={styles.fdFolder}>
            <FaFolder className={styles.fdFolderIcon} aria-hidden="true" />
            <span>Print Ready</span>
          </div>
          <div className={styles.fdFolder}>
            <FaFolder className={styles.fdFolderIcon} aria-hidden="true" />
            <span>Web &amp; Social</span>
          </div>

          <div className={styles.fdSidebarLabel}>Quick Info</div>
          <div className={styles.fdFolder}>
            <FaCircleInfo className={styles.fdFolderIcon} aria-hidden="true" />
            <span>Usage Guide</span>
          </div>
          <div className={styles.fdFolder}>
            <FaFileContract className={styles.fdFolderIcon} aria-hidden="true" />
            <span>License Terms</span>
          </div>
        </div>

        {/* File Grid */}
        <div className={styles.fdMain}>
          <div className={styles.fdMainHead}>
            <h4>6 files · Final Delivery</h4>
            <span>Sorted by format</span>
          </div>

          <div className={styles.fdFileGrid}>
            {fileDeliveryData.map((file, idx) => {
              const IconComponent = fileIconMap[file.iconKey] || FaPenNib;
              return (
                <div
                  key={file.id}
                  className={`${styles.fdFile} ${
                    animatedState ? styles.fdFileVisible : styles.fdFileHidden
                  }`}
                  style={
                    {
                      '--fc': file.color,
                      '--fc-bg': file.bgColor,
                      transitionDelay: animatedState ? `${idx * 80}ms` : '0ms',
                    } as React.CSSProperties
                  }
                >
                  <FaChevronRight className={styles.fdFileArrow} aria-hidden="true" />
                  <div className={styles.fdFileIcon}>
                    <IconComponent aria-hidden="true" />
                  </div>
                  <span className={styles.fdFileExt}>{file.ext}</span>
                  <div className={styles.fdFileName}>{file.name}</div>
                  <p className={styles.fdFileHint}>{file.hint}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className={styles.fdStatusbar}>
        <FaCircle className={styles.fdStatusbarDot} aria-hidden="true" />
        <span>
          All files delivered via organized Google Drive folder — nothing scattered, nothing
          missing.
        </span>
      </div>
    </div>
  );
}

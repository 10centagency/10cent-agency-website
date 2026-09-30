"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaFileImage,
  FaCloud,
  FaShareNodes,
  FaMagnifyingGlass,
  FaArrowPointer,
  FaSquareCheck,
  FaMagnifyingGlassPlus,
  FaSquare,
  FaCropSimple,
  FaEyeDropper,
  FaPaintbrush,
  FaEraser,
  FaFont,
  FaShapes,
  FaHand,
  FaPalette,
  FaCircle,
  FaEllipsis,
  FaPlus,
  FaFolder,
  FaLayerGroup,
  FaTags,
  FaAlignLeft,
  FaLock,
  FaCircleInfo,
  FaEye,
} from 'react-icons/fa6';
import styles from './GraphicDesign.module.css';

export default function GdPhotoshopMockup() {
  const mockupRef = useRef<HTMLDivElement>(null);
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

    if (mockupRef.current) {
      observer.observe(mockupRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const animatedState = !isClient || isVisible;

  return (
    <div className={styles.container}>
      <div ref={mockupRef} className={styles.psAppWrap}>
        {/* Title bar */}
        <div className={styles.psTitlebar}>
          <div className={styles.psDots}>
            <span className={styles.psDotRed} />
            <span className={styles.psDotYellow} />
            <span className={styles.psDotGreen} />
          </div>
          <div className={styles.psDoctab}>
            <FaFileImage className={styles.psDoctabIcon} aria-hidden="true" />
            <span>BrandIdentity_QuickAnswer.psd</span>
            <span className={styles.psDotUnsaved} />
          </div>
          <div className={styles.psTitlebarRight}>
            <span>
              <FaCloud aria-hidden="true" /> Cloud Document
            </span>
            <span>
              <FaShareNodes aria-hidden="true" /> Share
            </span>
          </div>
        </div>

        {/* Menu bar */}
        <div className={styles.psMenubar}>
          <div className={styles.psMenuItems}>
            <span>File</span>
            <span>Edit</span>
            <span>Image</span>
            <span>Layer</span>
            <span>Type</span>
            <span>Select</span>
            <span>Filter</span>
            <span>View</span>
            <span>Window</span>
            <span>Help</span>
          </div>
          <div className={styles.psMenuRight}>
            <FaMagnifyingGlass aria-hidden="true" />
            <span>10 Cent Agency — Design Workspace</span>
          </div>
        </div>

        {/* Options bar */}
        <div className={styles.psOptionsbar}>
          <div className={styles.psOptTool}>
            <FaArrowPointer aria-hidden="true" /> Move Tool
          </div>
          <div className={styles.psOptGroup}>
            <FaSquareCheck className={styles.psOptGroupIcon} aria-hidden="true" /> Auto-Select
          </div>
          <div className={styles.psOptGroup}>
            <FaSquareCheck className={styles.psOptGroupIcon} aria-hidden="true" /> Show Transform Controls
          </div>
          <div className={styles.psOptZoom}>
            <span>100%</span>
            <FaMagnifyingGlassPlus aria-hidden="true" />
          </div>
        </div>

        {/* Main Work Area */}
        <div className={styles.psMain}>
          {/* Left toolbar */}
          <div className={styles.psToolbar}>
            <div className={`${styles.psTool} ${styles.psToolActive}`}>
              <FaArrowPointer aria-hidden="true" />
            </div>
            <div className={styles.psTool}>
              <FaSquare aria-hidden="true" />
            </div>
            <div className={styles.psTool}>
              <FaCropSimple aria-hidden="true" />
            </div>
            <div className={styles.psToolSep} />
            <div className={styles.psTool}>
              <FaEyeDropper aria-hidden="true" />
            </div>
            <div className={styles.psTool}>
              <FaPaintbrush aria-hidden="true" />
            </div>
            <div className={styles.psTool}>
              <FaEraser aria-hidden="true" />
            </div>
            <div className={styles.psToolSep} />
            <div className={styles.psTool}>
              <FaFont aria-hidden="true" />
            </div>
            <div className={styles.psTool}>
              <FaShapes aria-hidden="true" />
            </div>
            <div className={styles.psToolSep} />
            <div className={styles.psTool}>
              <FaHand aria-hidden="true" />
            </div>
            <div className={styles.psTool}>
              <FaMagnifyingGlass aria-hidden="true" />
            </div>
            <div className={styles.psFgBgSwatch}>
              <span className={styles.psSwatchBg} />
              <span className={styles.psSwatchFg} />
            </div>
          </div>

          {/* Canvas */}
          <div className={styles.psCanvasWrap}>
            <div className={styles.psRulerTop} />
            <div className={styles.psRulerRow}>
              <div className={styles.psRulerLeft} />
              <div className={styles.psCanvas}>
                <div className={styles.psArtboardOuter}>
                  <span className={styles.psArtboardLabel}>
                    Artboard — Quick Answer (1200 × 628)
                  </span>
                  <div className={styles.psArtboard}>
                    <div
                      className={`${styles.psQaIconBadge} ${
                        animatedState ? styles.psCanvasItemVisible : styles.psCanvasItemHidden
                      }`}
                      style={{ transitionDelay: animatedState ? '100ms' : '0ms' }}
                    >
                      <FaPalette aria-hidden="true" />
                    </div>
                    <h3
                      className={
                        animatedState ? styles.psCanvasItemVisible : styles.psCanvasItemHidden
                      }
                      style={{ transitionDelay: animatedState ? '200ms' : '0ms' }}
                    >
                      What is Graphic Design service?
                    </h3>
                    <p
                      className={
                        animatedState ? styles.psCanvasItemVisible : styles.psCanvasItemHidden
                      }
                      style={{ transitionDelay: animatedState ? '300ms' : '0ms' }}
                    >
                      Graphic Design is the art of visual communication — combining color,
                      typography, imagery, and layout to represent your brand consistently across
                      every touchpoint. 10 Cent Agency creates logos, brand identities, social
                      media graphics, and marketing materials that make your business look polished
                      and trustworthy.
                    </p>
                    <div
                      className={`${styles.psQaTags} ${
                        animatedState ? styles.psCanvasItemVisible : styles.psCanvasItemHidden
                      }`}
                      style={{ transitionDelay: animatedState ? '400ms' : '0ms' }}
                    >
                      <span
                        className={styles.psQaTag}
                        style={{ background: '#ffe8d6', color: '#c9622b' }}
                      >
                        Logo Design
                      </span>
                      <span
                        className={styles.psQaTag}
                        style={{ background: '#dff3e6', color: '#1f9d55' }}
                      >
                        Brand Identity
                      </span>
                      <span
                        className={styles.psQaTag}
                        style={{ background: '#e6ecff', color: '#3556d1' }}
                      >
                        Social Media Kits
                      </span>
                      <span
                        className={styles.psQaTag}
                        style={{ background: '#fde6f2', color: '#c22b7f' }}
                      >
                        Print Materials
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.psStatusbar}>
              <span>Zoom: 100%</span>
              <span>Doc: 2.4M / 2.4M</span>
              <span className={styles.psStatusSaved}>
                <FaCircle className={styles.psStatusSavedDot} aria-hidden="true" />
                Auto-Saved to Creative Cloud
              </span>
            </div>
          </div>

          {/* Right dock */}
          <div className={styles.psRightdock}>
            <div className={styles.psPanel}>
              <div className={styles.psPanelHeader}>
                <span>Character</span>
                <FaEllipsis aria-hidden="true" />
              </div>
              <div className={styles.psPanelBody}>
                <div className={styles.psPropRow}>
                  <label>Font</label>
                  <div className={styles.psPropField}>Poppins SemiBold</div>
                </div>
                <div className={styles.psPropRow}>
                  <label>Size</label>
                  <div className={styles.psPropField}>19 px</div>
                </div>
                <div className={styles.psPropRow}>
                  <label>Color</label>
                  <div className={styles.psColorChip}>
                    <span style={{ background: '#0f2547' }} />
                    <span style={{ background: '#1f5fb0' }} />
                    <span style={{ background: '#ffffff' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className={`${styles.psPanel} ${styles.psLayersPanel}`}>
              <div className={styles.psPanelHeader}>
                <span>Layers</span>
                <FaPlus aria-hidden="true" />
              </div>
              <div className={styles.psLayersToolbar}>
                <select disabled defaultValue="Normal">
                  <option value="Normal">Normal</option>
                </select>
                <span>Opacity: 100%</span>
              </div>
              <div className={styles.psLayersList}>
                <div className={`${styles.psLayerRow} ${styles.psLayerGroup}`}>
                  <FaFolder className={styles.psLayerEye} aria-hidden="true" />
                  <div className={styles.psLayerThumb}>
                    <FaLayerGroup aria-hidden="true" />
                  </div>
                  <span className={styles.psLayerName}>Quick Answer Group</span>
                </div>
                <div className={`${styles.psLayerRow} ${styles.psLayerRowIndent} ${styles.psLayerRowSelected}`}>
                  <FaEye className={styles.psLayerEye} aria-hidden="true" />
                  <div className={styles.psLayerThumb}>
                    <FaTags aria-hidden="true" />
                  </div>
                  <span className={styles.psLayerName}>Tag Group</span>
                </div>
                <div className={`${styles.psLayerRow} ${styles.psLayerRowIndent}`}>
                  <FaEye className={styles.psLayerEye} aria-hidden="true" />
                  <div className={styles.psLayerThumb}>
                    <FaAlignLeft aria-hidden="true" />
                  </div>
                  <span className={styles.psLayerName}>Body Copy</span>
                </div>
                <div className={`${styles.psLayerRow} ${styles.psLayerRowIndent}`}>
                  <FaEye className={styles.psLayerEye} aria-hidden="true" />
                  <div className={styles.psLayerThumb}>
                    <FaFont aria-hidden="true" />
                  </div>
                  <span className={styles.psLayerName}>Headline Text</span>
                </div>
                <div className={`${styles.psLayerRow} ${styles.psLayerRowIndent}`}>
                  <FaEye className={styles.psLayerEye} aria-hidden="true" />
                  <div className={styles.psLayerThumb}>
                    <FaPalette aria-hidden="true" />
                  </div>
                  <span className={styles.psLayerName}>Icon Badge</span>
                </div>
                <div className={styles.psLayerRow}>
                  <FaEye className={styles.psLayerEye} aria-hidden="true" />
                  <div className={styles.psLayerThumb} style={{ background: '#ffffff' }} />
                  <span className={styles.psLayerName} style={{ fontStyle: 'italic' }}>
                    Background
                  </span>
                  <FaLock className={styles.psLayerLock} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.psCaption}>
        <FaCircleInfo className={styles.psCaptionIcon} aria-hidden="true" />
        <span>
          This is exactly how we approach every project — structured layers, consistent brand colors,
          and a clear message, before a single pixel goes live.
        </span>
      </p>
    </div>
  );
}

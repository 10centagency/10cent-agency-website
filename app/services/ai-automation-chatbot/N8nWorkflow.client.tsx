"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  FaPlus,
  FaShareNodes,
  FaGithub,
  FaHouse,
  FaFolderPlus,
  FaUser,
  FaGear,
  FaLayerGroup,
  FaCode,
  FaChartLine,
  FaCircleQuestion,
  FaFacebookMessenger,
  FaRobot,
  FaFilter,
  FaTable,
  FaClock,
  FaFileLines,
  FaAtom,
  FaDatabase,
  FaExpand,
  FaMinus,
  FaRotateLeft,
  FaFlask,
  FaArrowsUpDown,
  FaCircleInfo,
} from 'react-icons/fa6';
import styles from './AIAutomation.module.css';

export default function N8nWorkflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dScale, setDScale] = useState<number>(0.9);
  const [mScale, setMScale] = useState<number>(0.85);
  const [pathsAnimated, setPathsAnimated] = useState<boolean>(false);

  // Desktop zoom handlers
  const handleDZoomIn = () => {
    setDScale((prev) => Math.min(1.3, Number((prev + 0.1).toFixed(2))));
  };
  const handleDZoomOut = () => {
    setDScale((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(2))));
  };
  const handleDZoomReset = () => {
    setDScale(0.9);
  };
  const handleDZoomFit = () => {
    setDScale(0.9);
  };

  // Mobile zoom handlers
  const handleMZoomIn = () => {
    setMScale((prev) => Math.min(1.3, Number((prev + 0.1).toFixed(2))));
  };
  const handleMZoomOut = () => {
    setMScale((prev) => Math.max(0.5, Number((prev - 0.1).toFixed(2))));
  };
  const handleMZoomReset = () => {
    setMScale(0.85);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPathsAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setPathsAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const NATURAL_DW = 1700;
  const NATURAL_DH = 460;
  const NATURAL_MW = 600;
  const NATURAL_MH = 1600;

  return (
    <>
      <div className={styles.n8nApp} ref={containerRef}>
      {/* Topbar */}
      <div className={styles.n8nTopbar}>
        <div className={styles.n8nTopbarLeft}>
          <div className={styles.n8nLogoMark}>
            <span className={styles.n8nLogoDotRed} />
            <span className={styles.n8nLogoDotYellow} />
            <span className={styles.n8nLogoDotGreen} />
            n8n
          </div>
          <div className={styles.n8nAddSquare} aria-hidden="true">
            <FaPlus />
          </div>
          <div className={styles.n8nWorkflowName}>
            Messenger Sales Chatbot Workflow
          </div>
          <div className={styles.n8nAddTag}>
            <FaPlus aria-hidden="true" /> Add tag
          </div>
        </div>

        <div className={styles.n8nTopbarCenter}>
          <div className={`${styles.n8nTab} ${styles.n8nTabActive}`}>Editor</div>
          <div className={styles.n8nTab}>Executions</div>
        </div>

        <div className={styles.n8nTopbarRight}>
          <div className={styles.n8nInactiveToggle}>
            Inactive <span className={styles.n8nTogglePill} />
          </div>
          <button type="button" className={styles.n8nBtnShare}>
            <FaShareNodes aria-hidden="true" /> <span>Share</span>
          </button>
          <button type="button" className={styles.n8nBtnSave}>
            Save
          </button>
          <div className={styles.n8nStar}>
            <FaGithub className={styles.n8nStarIcon} aria-hidden="true" />{' '}
            <span>Star</span> 98,457
          </div>
        </div>
      </div>

      {/* ============ DESKTOP VIEW (Horizontal Canvas) ============ */}
      <div className={styles.n8nDesktopBody}>
        {/* Sidebar */}
        <div className={styles.n8nSidebar}>
          <div className={styles.n8nSideItem}>
            <FaHouse aria-hidden="true" /> Overview
          </div>
          <div className={styles.n8nSideItem}>
            <FaFolderPlus aria-hidden="true" /> Projects
          </div>
          <div className={`${styles.n8nSideItem} ${styles.n8nSideItemActive} ${styles.n8nSideSub}`}>
            <FaUser aria-hidden="true" /> Personal
          </div>
          <div className={`${styles.n8nSideItem} ${styles.n8nSideSub}`}>
            <FaUser aria-hidden="true" /> My project
          </div>
          <div className={styles.n8nSideDivider} />
          <div className={styles.n8nSideItem}>
            <FaGear aria-hidden="true" /> Admin Panel
          </div>
          <div className={styles.n8nSideItem}>
            <FaLayerGroup aria-hidden="true" /> Templates
          </div>
          <div className={styles.n8nSideItem}>
            <FaCode aria-hidden="true" /> Variables
          </div>
          <div className={styles.n8nSideItem}>
            <FaChartLine aria-hidden="true" /> Insights
          </div>
          <div className={styles.n8nSideItem}>
            <FaCircleQuestion aria-hidden="true" /> Help
          </div>
          <div className={styles.n8nSideUser}>
            <div className={styles.n8nSideAvatar}>10</div>
            <span>10 Cent Agency</span>
          </div>
        </div>

        {/* Canvas Wrap */}
        <div className={styles.n8nCanvasWrap}>
          <div className={styles.n8nCanvasAddBtn} aria-label="Add node">
            <FaPlus />
          </div>

          <div className={styles.n8nCanvasScroll}>
            <div
              className={styles.n8nFlowCanvasWrap}
              style={{
                width: `${NATURAL_DW * dScale}px`,
                height: `${NATURAL_DH * dScale}px`,
              }}
            >
              <div
                className={styles.n8nFlowCanvas}
                style={{
                  transform: `scale(${dScale})`,
                }}
              >
                {/* SVG Connections */}
                <svg
                  className={styles.n8nFlowSvg}
                  width="1700"
                  height="460"
                  viewBox="0 0 1700 460"
                  aria-hidden="true"
                >
                  <defs>
                    <marker
                      id="arrowBlueD"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill="#4a7fd6" />
                    </marker>
                    <marker
                      id="arrowGreenD"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill="#4ade80" />
                    </marker>
                    <marker
                      id="arrowRedD"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M0,0 L10,5 L0,10 z" fill="#f87171" />
                    </marker>
                  </defs>

                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowBlueD)"
                    d="M127,62 L265,55"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowBlueD)"
                    d="M455,55 L603,62"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowBlueD)"
                    d="M667,62 L843,62"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathGreen} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowGreenD)"
                    d="M907,62 L1083,62"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathRed} ${styles.pathDashed} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowRedD)"
                    d="M875,94 L875,220"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowBlueD)"
                    d="M1147,62 L1323,62"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowBlueD)"
                    d="M1387,62 L1563,62"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowBlueD)"
                    d="M1595,94 L1595,190"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowBlueD)"
                    d="M1595,254 L1595,330"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                      pathsAnimated ? styles.flowAnimate : ''
                    }`}
                    markerEnd="url(#arrowBlueD)"
                    d="M1563,362 L1387,362"
                  />

                  {/* Sub-node dashed lines */}
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${styles.pathDashed}`}
                    d="M288,100 L255,230"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${styles.pathDashed}`}
                    d="M345,100 L455,230"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathBlue} ${styles.pathDashed}`}
                    d="M402,100 L655,230"
                  />
                  <path
                    className={`${styles.n8nFlowPath} ${styles.pathRed} ${styles.pathDashed}`}
                    markerEnd="url(#arrowRedD)"
                    d="M875,284 L875,350 L402,350 L402,100"
                  />

                  {/* Flow animation dots */}
                  {pathsAnimated && (
                    <>
                      <circle r="4" fill="#4a7fd6">
                        <animateMotion dur="1.6s" begin="0s" repeatCount="indefinite" path="M127,62 L265,55" />
                      </circle>
                      <circle r="4" fill="#4a7fd6">
                        <animateMotion dur="1.6s" begin="0.2s" repeatCount="indefinite" path="M455,55 L603,62" />
                      </circle>
                      <circle r="4" fill="#4a7fd6">
                        <animateMotion dur="1.6s" begin="0.4s" repeatCount="indefinite" path="M667,62 L843,62" />
                      </circle>
                      <circle r="4" fill="#4ade80">
                        <animateMotion dur="1.6s" begin="0.6s" repeatCount="indefinite" path="M907,62 L1083,62" />
                      </circle>
                      <circle r="4" fill="#4a7fd6">
                        <animateMotion dur="1.6s" begin="0.8s" repeatCount="indefinite" path="M1147,62 L1323,62" />
                      </circle>
                      <circle r="4" fill="#4a7fd6">
                        <animateMotion dur="1.6s" begin="1s" repeatCount="indefinite" path="M1387,62 L1563,62" />
                      </circle>
                      <circle r="4" fill="#4a7fd6">
                        <animateMotion dur="1.6s" begin="1.2s" repeatCount="indefinite" path="M1595,94 L1595,190" />
                      </circle>
                      <circle r="4" fill="#4a7fd6">
                        <animateMotion dur="1.6s" begin="1.4s" repeatCount="indefinite" path="M1595,254 L1595,330" />
                      </circle>
                      <circle r="4" fill="#4a7fd6">
                        <animateMotion dur="1.6s" begin="1.6s" repeatCount="indefinite" path="M1563,362 L1387,362" />
                      </circle>
                      <circle r="3.5" fill="#f87171">
                        <animateMotion dur="2.2s" begin="0s" repeatCount="indefinite" path="M875,94 L875,220" />
                      </circle>
                    </>
                  )}
                </svg>

                {/* Branch Tags */}
                <div
                  className={`${styles.n8nBranchTag} ${styles.n8nBranchTagTrue}`}
                  style={{ left: '940px', top: '40px' }}
                >
                  TRUE
                </div>
                <div
                  className={`${styles.n8nBranchTag} ${styles.n8nBranchTagFalse}`}
                  style={{ left: '892px', top: '140px' }}
                >
                  FALSE
                </div>

                {/* Flow Nodes */}
                <div className={styles.n8nFlowNode} style={{ left: '20px', top: '30px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaFacebookMessenger style={{ color: '#00b2ff' }} />
                  </div>
                  <h5>1. Messenger Trigger</h5>
                  <span>Updates: messages</span>
                </div>

                <div
                  className={`${styles.n8nFlowNode} ${styles.n8nFlowNodeAiAgent}`}
                  style={{ left: '250px', top: '10px' }}
                >
                  <div className={styles.n8nFlowBox}>
                    <FaRobot style={{ color: '#fff' }} />
                    <small>Tools Agent</small>
                  </div>
                  <div className={styles.aiConnectorLabels}>
                    <span style={{ left: '38px' }}>Chat Model</span>
                    <span style={{ left: '95px' }}>Memory</span>
                    <span style={{ left: '152px' }}>Tool</span>
                  </div>
                  <h5>2. AI Agent (Chatbot)</h5>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '560px', top: '30px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaCode style={{ color: '#ff9f43' }} />
                  </div>
                  <h5>3. Extract Lead / Sales Info</h5>
                  <span>manual</span>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '800px', top: '30px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaFilter style={{ color: '#4ade80' }} />
                  </div>
                  <h5>4. Validate Info</h5>
                  <span>manual</span>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '1040px', top: '30px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaTable style={{ color: '#22c55e' }} />
                  </div>
                  <h5>5. Add Row in Google Sheets</h5>
                  <span>append: sheet</span>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '1280px', top: '30px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaFacebookMessenger style={{ color: '#00b2ff' }} />
                  </div>
                  <h5>6. Success Response</h5>
                  <span>sendMessage</span>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '1520px', top: '30px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaClock style={{ color: '#c084fc' }} />
                  </div>
                  <h5>8. Wait (Before Follow Up)</h5>
                  <span>wait</span>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '1520px', top: '190px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaFacebookMessenger style={{ color: '#00b2ff' }} />
                  </div>
                  <h5>9. Follow Up Message</h5>
                  <span>sendMessage</span>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '1520px', top: '330px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaTable style={{ color: '#22c55e' }} />
                  </div>
                  <h5>10. Update Follow Up Status in Sheets</h5>
                  <span>update: sheet</span>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '1280px', top: '330px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaFileLines style={{ color: '#9aa3b5' }} />
                  </div>
                  <h5>11. Log Workflow Execution</h5>
                </div>

                <div className={styles.n8nFlowNode} style={{ left: '800px', top: '220px' }}>
                  <div className={styles.n8nFlowBox}>
                    <FaFacebookMessenger style={{ color: '#00b2ff' }} />
                  </div>
                  <h5>7. Ask Missing Info</h5>
                  <span>sendMessage</span>
                </div>

                {/* Sub-Nodes */}
                <div
                  className={`${styles.n8nFlowNode} ${styles.n8nFlowNodeSub}`}
                  style={{ left: '180px', top: '230px' }}
                >
                  <div className={styles.n8nFlowBox}>
                    <FaAtom style={{ color: '#10a37f' }} />
                  </div>
                  <h5>OpenAI Chat Model</h5>
                </div>
                <div
                  className={`${styles.n8nFlowNode} ${styles.n8nFlowNodeSub}`}
                  style={{ left: '380px', top: '230px' }}
                >
                  <div className={styles.n8nFlowBox}>
                    <FaDatabase style={{ color: '#5b9bf0' }} />
                  </div>
                  <h5>Simple Memory</h5>
                </div>
                <div
                  className={`${styles.n8nFlowNode} ${styles.n8nFlowNodeSub}`}
                  style={{ left: '580px', top: '230px' }}
                >
                  <div className={styles.n8nFlowBox}>
                    <FaFileLines style={{ color: '#9aa3b5' }} />
                  </div>
                  <h5>FAQ / Product Info (knowledge base)</h5>
                  <span>get: document</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Footer Controls */}
          <div className={styles.n8nCanvasFooter}>
            <div className={styles.n8nZoomControls}>
              <button
                type="button"
                onClick={handleDZoomFit}
                title="Fit to view"
                aria-label="Fit to view"
              >
                <FaExpand />
              </button>
              <button
                type="button"
                onClick={handleDZoomOut}
                title="Zoom out"
                aria-label="Zoom out"
              >
                <FaMinus />
              </button>
              <span className={styles.n8nZoomPct}>
                {Math.round(dScale * 100)}%
              </span>
              <button
                type="button"
                onClick={handleDZoomIn}
                title="Zoom in"
                aria-label="Zoom in"
              >
                <FaPlus />
              </button>
              <button
                type="button"
                onClick={handleDZoomReset}
                title="Reset zoom"
                aria-label="Reset zoom"
              >
                <FaRotateLeft />
              </button>
            </div>
            <button type="button" className={styles.n8nExecuteBtn}>
              <FaFlask aria-hidden="true" /> Execute workflow
            </button>
          </div>
        </div>
      </div>

      {/* ============ MOBILE VIEW (Vertical Flow with zoom & scroll) ============ */}
      <div className={styles.n8nMobileBody}>
        <div className={styles.n8nMobileCanvasScroll}>
          <div
            className={styles.mobileCanvasSpacer}
            style={{
              width: `${NATURAL_MW * mScale}px`,
              height: `${NATURAL_MH * mScale}px`,
            }}
          >
            <div
              className={`${styles.mobileCanvasInner} ${styles.n8nFlowCanvas} ${styles.n8nMobileCanvas}`}
              style={{
                width: '600px',
                height: '1600px',
                transform: `scale(${mScale})`,
              }}
            >
              <svg
                className={styles.n8nFlowSvg}
                width="600"
                height="1600"
                viewBox="0 0 600 1600"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="arrowBlueM"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill="#4a7fd6" />
                  </marker>
                  <marker
                    id="arrowGreenM"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill="#4ade80" />
                  </marker>
                  <marker
                    id="arrowRedM"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill="#f87171" />
                  </marker>
                </defs>

                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowBlueM)"
                  d="M290,72 L290,170"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${styles.pathDashed}`}
                  d="M370,202 L425,172"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${styles.pathDashed}`}
                  d="M370,202 L425,232"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${styles.pathDashed}`}
                  d="M370,202 L425,292"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowBlueM)"
                  d="M290,234 L290,400"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowBlueM)"
                  d="M290,452 L290,550"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathGreen} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowGreenM)"
                  d="M290,602 L290,700"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathRed} ${styles.pathDashed}`}
                  markerEnd="url(#arrowRedM)"
                  d="M290,602 L480,602 L480,700"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathRed} ${styles.pathDashed}`}
                  markerEnd="url(#arrowRedM)"
                  d="M480,752 L480,820 L20,820 L20,202 L210,202"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowBlueM)"
                  d="M290,752 L290,850"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowBlueM)"
                  d="M290,902 L290,1000"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowBlueM)"
                  d="M290,1052 L290,1150"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowBlueM)"
                  d="M290,1202 L290,1300"
                />
                <path
                  className={`${styles.n8nFlowPath} ${styles.pathBlue} ${
                    pathsAnimated ? styles.flowAnimate : ''
                  }`}
                  markerEnd="url(#arrowBlueM)"
                  d="M290,1352 L290,1450"
                />

                {pathsAnimated && (
                  <>
                    <circle r="4" fill="#4a7fd6">
                      <animateMotion dur="1.6s" begin="0s" repeatCount="indefinite" path="M290,72 L290,170" />
                    </circle>
                    <circle r="4" fill="#4a7fd6">
                      <animateMotion dur="1.6s" begin="0.3s" repeatCount="indefinite" path="M290,234 L290,400" />
                    </circle>
                    <circle r="4" fill="#4a7fd6">
                      <animateMotion dur="1.6s" begin="0.6s" repeatCount="indefinite" path="M290,452 L290,550" />
                    </circle>
                    <circle r="4" fill="#4ade80">
                      <animateMotion dur="1.6s" begin="0.9s" repeatCount="indefinite" path="M290,602 L290,700" />
                    </circle>
                    <circle r="4" fill="#4a7fd6">
                      <animateMotion dur="1.6s" begin="1.2s" repeatCount="indefinite" path="M290,752 L290,850" />
                    </circle>
                    <circle r="4" fill="#4a7fd6">
                      <animateMotion dur="1.6s" begin="1.5s" repeatCount="indefinite" path="M290,902 L290,1000" />
                    </circle>
                    <circle r="4" fill="#4a7fd6">
                      <animateMotion dur="1.6s" begin="1.8s" repeatCount="indefinite" path="M290,1052 L290,1150" />
                    </circle>
                    <circle r="4" fill="#4a7fd6">
                      <animateMotion dur="1.6s" begin="2.1s" repeatCount="indefinite" path="M290,1202 L290,1300" />
                    </circle>
                    <circle r="4" fill="#4a7fd6">
                      <animateMotion dur="1.6s" begin="2.4s" repeatCount="indefinite" path="M290,1352 L290,1450" />
                    </circle>
                    <circle r="3.5" fill="#f87171">
                      <animateMotion dur="2.2s" begin="0s" repeatCount="indefinite" path="M290,602 L480,602 L480,700" />
                    </circle>
                  </>
                )}
              </svg>

              <div
                className={`${styles.n8nBranchTag} ${styles.n8nBranchTagTrue}`}
                style={{ left: '270px', top: '660px' }}
              >
                TRUE
              </div>
              <div
                className={`${styles.n8nBranchTag} ${styles.n8nBranchTagFalse}`}
                style={{ left: '395px', top: '610px' }}
              >
                FALSE
              </div>
              <div className={styles.n8nLoopLabel} style={{ left: '5px', top: '500px' }}>
                <FaRotateLeft aria-hidden="true" /> Loops until info complete
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '20px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaFacebookMessenger style={{ color: '#00b2ff' }} />
                </div>
                <h5>1. Messenger Trigger</h5>
                <span>Updates: messages</span>
              </div>

              <div
                className={`${styles.n8nFlowNode} ${styles.n8nFlowNodeAiAgent}`}
                style={{ left: '210px', top: '170px' }}
              >
                <div className={styles.n8nFlowBox}>
                  <FaRobot style={{ color: '#fff' }} />
                  <small>Tools Agent</small>
                </div>
                <h5>2. AI Agent (Chatbot)</h5>
              </div>

              <div
                className={`${styles.n8nFlowNode} ${styles.n8nFlowNodeSub}`}
                style={{ left: '425px', top: '150px' }}
              >
                <div className={styles.n8nFlowBox}>
                  <FaAtom style={{ color: '#10a37f' }} />
                </div>
                <h5>OpenAI Chat Model</h5>
              </div>
              <div
                className={`${styles.n8nFlowNode} ${styles.n8nFlowNodeSub}`}
                style={{ left: '425px', top: '210px' }}
              >
                <div className={styles.n8nFlowBox}>
                  <FaDatabase style={{ color: '#5b9bf0' }} />
                </div>
                <h5>Simple Memory</h5>
              </div>
              <div
                className={`${styles.n8nFlowNode} ${styles.n8nFlowNodeSub}`}
                style={{ left: '425px', top: '270px' }}
              >
                <div className={styles.n8nFlowBox}>
                  <FaFileLines style={{ color: '#9aa3b5' }} />
                </div>
                <h5>FAQ Knowledge Base</h5>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '400px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaCode style={{ color: '#ff9f43' }} />
                </div>
                <h5>3. Extract Lead / Sales Info</h5>
                <span>manual</span>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '550px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaFilter style={{ color: '#4ade80' }} />
                </div>
                <h5>4. Validate Info</h5>
                <span>manual</span>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '700px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaTable style={{ color: '#22c55e' }} />
                </div>
                <h5>5. Add Row in Google Sheets</h5>
                <span>append: sheet</span>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '420px', top: '700px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaFacebookMessenger style={{ color: '#00b2ff' }} />
                </div>
                <h5>7. Ask Missing Info</h5>
                <span>sendMessage</span>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '850px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaFacebookMessenger style={{ color: '#00b2ff' }} />
                </div>
                <h5>6. Success Response</h5>
                <span>sendMessage</span>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '1000px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaClock style={{ color: '#c084fc' }} />
                </div>
                <h5>8. Wait (Before Follow Up)</h5>
                <span>wait</span>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '1150px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaFacebookMessenger style={{ color: '#00b2ff' }} />
                </div>
                <h5>9. Follow Up Message</h5>
                <span>sendMessage</span>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '1300px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaTable style={{ color: '#22c55e' }} />
                </div>
                <h5>10. Update Follow Up Status</h5>
                <span>update: sheet</span>
              </div>

              <div className={styles.n8nFlowNode} style={{ left: '230px', top: '1450px' }}>
                <div className={styles.n8nFlowBox}>
                  <FaFileLines style={{ color: '#9aa3b5' }} />
                </div>
                <h5>11. Log Workflow Execution</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Zoom Footer */}
        <div className={styles.n8nMobileZoomFooter}>
          <div className={styles.n8nZoomControls}>
            <button
              type="button"
              onClick={handleMZoomOut}
              title="Zoom out"
              aria-label="Zoom out"
            >
              <FaMinus />
            </button>
            <span className={styles.n8nZoomPct}>
              {Math.round(mScale * 100)}%
            </span>
            <button
              type="button"
              onClick={handleMZoomIn}
              title="Zoom in"
              aria-label="Zoom in"
            >
              <FaPlus />
            </button>
            <button
              type="button"
              onClick={handleMZoomReset}
              title="Reset zoom"
              aria-label="Reset zoom"
            >
              <FaRotateLeft />
            </button>
          </div>
        </div>
        <p className={styles.n8nMobileHint}>
          <FaArrowsUpDown aria-hidden="true" /> Scroll to explore · Pinch or use +/- to zoom
        </p>
      </div>
    </div>

    <p className={styles.workflowNote}>
      <FaCircleInfo className={styles.workflowNoteIcon} aria-hidden="true" />
      This is a real workflow structure we build for clients — we design custom automation based on your exact business process.
    </p>
  </>
  );
}

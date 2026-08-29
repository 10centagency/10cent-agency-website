'use client';

import { useState, useEffect, useRef, useId } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './CTABanner.module.css';

const LINE_1 = 'Ready to Grow Your';
const LINE_2 = 'Business Online?';

interface FormDataState {
  name: string;
  business: string;
  email: string;
  phone: string;
  topic: string;
  budget: string;
  message: string;
}

const initialFormData: FormDataState = {
  name: '',
  business: '',
  email: '',
  phone: '',
  topic: '',
  budget: '',
  message: '',
};

export default function CTABannerInteractive() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [displayedLine1, setDisplayedLine1] = useState(LINE_1);
  const [displayedLine2, setDisplayedLine2] = useState(LINE_2);
  const [caretPos, setCaretPos] = useState<0 | 1 | 2>(0);

  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const flipBtnRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const isFlippedRef = useRef(false);

  // Accessible unique IDs for form fields
  const nameId = useId();
  const businessId = useId();
  const emailId = useId();
  const phoneId = useId();
  const topicId = useId();
  const budgetId = useId();
  const messageId = useId();

  // Sync ref with state
  useEffect(() => {
    isFlippedRef.current = isFlipped;
  }, [isFlipped]);

  // AI Typing effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayedLine1(LINE_1);
      setDisplayedLine2(LINE_2);
      setCaretPos(0);
      return;
    }

    let cancelled = false;
    let hasStarted = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => resolve(), ms);
        if (cancelled) clearTimeout(timer);
      });

    const typeDelay = () => 50 + Math.random() * 50;

    async function typeOnce() {
      // Clear lines and place caret on line 1
      setDisplayedLine1('');
      setDisplayedLine2('');
      setCaretPos(1);

      // Type line 1
      for (const ch of LINE_1) {
        if (cancelled) return;
        while (isFlippedRef.current && !cancelled) {
          await wait(200);
        }
        if (cancelled) return;
        setDisplayedLine1((prev) => prev + ch);
        await wait(ch === ' ' ? 45 : typeDelay());
      }

      if (cancelled) return;
      // Move caret to line 2
      setCaretPos(2);

      // Type line 2
      for (const ch of LINE_2) {
        if (cancelled) return;
        while (isFlippedRef.current && !cancelled) {
          await wait(200);
        }
        if (cancelled) return;
        setDisplayedLine2((prev) => prev + ch);
        await wait(ch === ' ' ? 45 : typeDelay());
      }

      if (cancelled) return;
      // Hold with blinking caret at end of line 2
      await wait(2400);

      if (cancelled) return;
      // Hide caret
      setCaretPos(0);
      // Clear both lines
      setDisplayedLine1('');
      setDisplayedLine2('');
      await wait(420);
    }

    async function loop() {
      while (!cancelled) {
        while (isFlippedRef.current && !cancelled) {
          await wait(200);
        }
        if (cancelled) break;
        await typeOnce();
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !hasStarted) {
          hasStarted = true;
          observer.disconnect();
          loop();
        }
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const handleFlipToBack = () => {
    setIsFlipped(true);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  const handleFlipToFront = () => {
    setIsFlipped(false);
    setTimeout(() => {
      flipBtnRef.current?.focus();
    }, 100);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (
      !formData.name.trim() ||
      !formData.business.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.topic.trim() ||
      !formData.message.trim()
    ) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        full_name: formData.name.trim(),
        business_name: formData.business.trim(),
        email: formData.email.trim(),
        whatsapp: formData.phone.trim(),
        service_interested: formData.topic.trim(),
        budget_range: formData.budget.trim() || null,
        message: formData.message.trim(),
      });

      setLoading(false);

      if (error) {
        setErrorMessage('Something went wrong. Please try again.');
        return;
      }

      setIsSuccess(true);

      // Meta Pixel + CAPI Lead tracking
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        const eventId = crypto.randomUUID();
        window.fbq(
          'track',
          'Lead',
          {
            content_name: 'CTA Banner Form Submit',
          },
          { eventID: eventId }
        );

        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'Lead',
            eventId: eventId,
            eventSourceUrl: window.location.href,
            contentName: 'CTA Banner Form Submit',
          }),
        }).catch(() => {
          // Non-blocking catch
        });
      }
    } catch {
      setLoading(false);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleSendAnother = () => {
    setFormData(initialFormData);
    setErrorMessage('');
    setIsSuccess(false);
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  return (
    <div className={styles.ctaFlip} ref={containerRef}>
      <div className={`${styles.ctaFlipInner} ${isFlipped ? styles.flipped : ''}`}>
        {/* ============ FRONT ============ */}
        <div className={`${styles.ctaFace} ${styles.ctaFaceFront}`}>
          <div className={`${styles.ctaRing} ${styles.ctaRingOuter}`} aria-hidden="true" />
          <div className={`${styles.ctaRing} ${styles.ctaRingInner}`} aria-hidden="true" />

          <button
            ref={flipBtnRef}
            className={styles.flipBtn}
            type="button"
            onClick={handleFlipToBack}
            aria-label="Open contact form"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 4.1 12 6" />
              <path d="m5.1 8-2.9-.8" />
              <path d="m6 12-1.9 2" />
              <path d="M7.2 2.2 8 5.1" />
              <path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" />
            </svg>
            Let&apos;s Talk
          </button>

          <h2 className={styles.ctaTitle}>
            <span className={styles.tline}>
              {displayedLine1}
              {caretPos === 1 && <span className={styles.caret} aria-hidden="true" />}
            </span>
            <span className={styles.tline}>
              {displayedLine2}
              {caretPos === 2 && <span className={styles.caret} aria-hidden="true" />}
            </span>
          </h2>

          <p className={styles.ctaDesc}>
            Let us build a smarter, stronger digital presence for your brand. Book a free consultation
            today — no commitment required.
          </p>

          <div className={styles.ctaActions}>
            <Link
              className={`${styles.ctaBtn} ${styles.ctaBtnPrimary}`}
              href="https://calendly.com/10centagency/free-consultation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Free Consultation
            </Link>
            <a
              className={`${styles.ctaBtn} ${styles.ctaBtnGhost}`}
              href="https://wa.me/8801615144114"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>

          <p className={styles.ctaEmail}>
            <a href="mailto:hello@10centagency.com">hello@10centagency.com</a>
          </p>
        </div>

        {/* ============ BACK (CONTACT FORM) ============ */}
        <div className={`${styles.ctaFace} ${styles.ctaFaceBack}`}>
          {!isSuccess ? (
            <div>
              <div className={styles.formHead}>
                <div>
                  <h3 className={styles.formTitle}>Contact Us</h3>
                  <p className={styles.formSub}>
                    Fill in your details — we&apos;ll get back within 24 hours.
                  </p>
                </div>
                <button
                  className={styles.flipBack}
                  type="button"
                  onClick={handleFlipToFront}
                  aria-label="Flip back"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m3 7 5 5-5 5V7" />
                    <path d="m21 7-5 5 5 5V7" />
                    <path d="M12 20v2" />
                    <path d="M12 14v2" />
                    <path d="M12 8v2" />
                    <path d="M12 2v2" />
                  </svg>
                </button>
              </div>

              {errorMessage && (
                <div className={styles.formError} role="alert">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.formGrid}>
                  <label className={styles.field} htmlFor={nameId}>
                    <span className={styles.flabel}>Full Name *</span>
                    <input
                      ref={nameInputRef}
                      id={nameId}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      autoComplete="name"
                    />
                  </label>
                  <label className={styles.field} htmlFor={businessId}>
                    <span className={styles.flabel}>Business Name *</span>
                    <input
                      id={businessId}
                      type="text"
                      name="business"
                      value={formData.business}
                      onChange={handleChange}
                      required
                      placeholder="Your Company"
                      autoComplete="organization"
                    />
                  </label>
                  <label className={styles.field} htmlFor={emailId}>
                    <span className={styles.flabel}>Email *</span>
                    <input
                      id={emailId}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      autoComplete="email"
                    />
                  </label>
                  <label className={styles.field} htmlFor={phoneId}>
                    <span className={styles.flabel}>Phone Number *</span>
                    <input
                      id={phoneId}
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+880 1X XX-XXXXXX"
                      autoComplete="tel"
                    />
                  </label>
                  <label className={styles.field} htmlFor={topicId}>
                    <span className={styles.flabel}>Topic *</span>
                    <select
                      id={topicId}
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="Facebook & Meta Marketing">Facebook &amp; Meta Marketing</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Website Development">Website Development</option>
                      <option value="AI Automation & Chatbot">AI Automation &amp; Chatbot</option>
                      <option value="Social Media Management">Social Media Management</option>
                      <option value="SEO, AEO & GEO">SEO, AEO &amp; GEO</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className={styles.field} htmlFor={budgetId}>
                    <span className={styles.flabel}>
                      Budget <em>(optional)</em>
                    </span>
                    <select
                      id={budgetId}
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select budget</option>
                      <option value="BDT 5,000 – 10,000">BDT 5,000 – 10,000</option>
                      <option value="BDT 10,000 – 20,000">BDT 10,000 – 20,000</option>
                      <option value="BDT 20,000 – 40,000">BDT 20,000 – 40,000</option>
                      <option value="BDT 40,000+">BDT 40,000+</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </label>
                </div>

                <label className={styles.field} htmlFor={messageId}>
                  <span className={styles.flabel}>Message *</span>
                  <textarea
                    id={messageId}
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your business and goals..."
                  />
                </label>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Success Area */
            <div className={styles.success}>
              <div className={styles.sicon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h3>Message Sent!</h3>
              <p>
                Thank you for reaching out.
                <br />
                We&apos;ll get back to you within 24 hours.
              </p>
              <div className={styles.srow}>
                <button className={styles.btnOutline} type="button" onClick={handleSendAnother}>
                  Send Another
                </button>
                <button className={styles.btnOutline} type="button" onClick={handleFlipToFront}>
                  Back to Banner
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { CircleCheck as CheckCircle2, ChevronDown, ChartBar as BarChart2, Monitor, Bot } from 'lucide-react';

const words = ['Grow', 'Your', 'Business', 'Online', 'Without', 'Breaking', 'the', 'Bank'];

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-bg to-brand-bgAlt">
      {/* Background rings */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full border-2 border-brand-navy opacity-[0.06] animate-spin-slow"
        />
        <div
          className="absolute top-[-20%] right-[-20%] w-[900px] h-[900px] rounded-full border-2 border-brand-navy opacity-[0.04] animate-spin-slow-reverse"
        />
      </div>
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #00346D 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
              Social Media Marketing Agency in Bangladesh
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-textDark leading-tight mb-6"
              variants={prefersReducedMotion ? {} : containerVariants}
              initial="hidden"
              animate="visible"
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  variants={prefersReducedMotion ? {} : wordVariants}
                  className="inline-block mr-3 mb-1"
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-brand-textMid text-lg leading-relaxed mb-8 max-w-xl"
            >
              From Facebook &amp; Instagram marketing to professional websites and AI automation — we help small and medium businesses across Bangladesh build a powerful digital presence at a price that makes sense.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-brand-navy text-white font-semibold rounded-xl px-8 py-4 hover:bg-brand-blue transition-colors duration-200 w-full sm:w-auto"
                >
                  Get Free Consultation
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center border-2 border-brand-navy text-brand-navy font-semibold rounded-xl px-8 py-4 hover:bg-brand-navy hover:text-white transition-all duration-200 w-full sm:w-auto"
                >
                  Explore Our Services
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center gap-5"
            >
              {['Meta Certified Strategies', 'Affordable Pricing', 'Fast Delivery'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-brand-textMid">
                  <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual — Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block h-[520px]"
          >
            {/* Glow */}
            <div className="absolute inset-8 bg-brand-blue/10 blur-3xl rounded-full" />

            {/* Card 1 — Facebook Ads */}
            <div className={`absolute top-8 left-4 w-[260px] bg-white rounded-2xl shadow-card p-4 border border-brand-border ${prefersReducedMotion ? '' : 'animate-float'}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-[#1877F2] flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <span className="text-xs font-semibold text-brand-textDark">Facebook Ads</span>
                <span className="ml-auto text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-end gap-1 mb-3 h-12">
                {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-brand-blue/20 rounded-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="text-xs text-brand-textMid">Reach</div>
              <div className="text-lg font-bold text-brand-textDark">24,500+</div>
            </div>

            {/* Card 2 — Website Live */}
            <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-[240px] bg-white rounded-2xl shadow-card p-4 border border-brand-border ${prefersReducedMotion ? '' : 'animate-float-delay-1'}`}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="bg-brand-bgAlt rounded px-2 py-1 text-xs text-brand-textMid mb-3 truncate">
                www.yourclient.com
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="h-2 bg-brand-blue/20 rounded w-3/4" />
                <div className="h-2 bg-brand-accent/40 rounded w-full" />
                <div className="h-2 bg-brand-blue/10 rounded w-2/3" />
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-brand-blue" />
                <span className="text-xs font-semibold text-brand-textDark">Website Live</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
              </div>
            </div>

            {/* Card 3 — AI Chatbot */}
            <div className={`absolute bottom-8 left-8 w-[250px] bg-white rounded-2xl shadow-card p-4 border border-brand-border ${prefersReducedMotion ? '' : 'animate-float-delay-2'}`}>
              <div className="space-y-2 mb-3">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-brand-blue" />
                  </div>
                  <div className="bg-brand-bgAlt rounded-xl rounded-tl-sm px-3 py-2 text-xs text-brand-textDark max-w-[160px]">
                    Hi! How can I help you?
                  </div>
                </div>
                <div className="flex gap-2 flex-row-reverse">
                  <div className="w-6 h-6 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[9px] font-bold">U</span>
                  </div>
                  <div className="bg-brand-navy rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white max-w-[160px]">
                    I want to place an order
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-brand-border">
                <Bot className="w-3.5 h-3.5 text-brand-blue" />
                <span className="text-xs font-semibold text-brand-textDark">AI Bot Active</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center mt-12"
        >
          <div className="flex flex-col items-center gap-2 text-brand-textMid">
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 animate-bounce-arrow" />
          </div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#EEF6FF"/>
        </svg>
      </div>
    </section>
  );
}

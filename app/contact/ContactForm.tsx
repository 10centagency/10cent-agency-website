'use client';

import { useState, useRef, useEffect } from 'react';
import { CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react';
import Turnstile, { TurnstileRef } from '@/components/Turnstile';

interface FormData {
  fullName: string;
  businessName: string;
  email: string;
  whatsapp: string;
  service: string;
  budget: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const initialData: FormData = {
  fullName: '',
  businessName: '',
  email: '',
  whatsapp: '',
  service: '',
  budget: '',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [website, setWebsite] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const turnstileRef = useRef<TurnstileRef>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.focus();
    }
  }, [submitted]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Phone/WhatsApp number is required.';
    if (!formData.service) newErrors.service = 'Please select a service.';
    if (!formData.budget) newErrors.budget = 'Please select a budget range.';
    if (!formData.message.trim()) newErrors.message = 'Please tell us about your business.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (errors.submit) setErrors((prev) => ({ ...prev, submit: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          businessName: formData.businessName.trim(),
          email: formData.email.trim(),
          whatsapp: formData.whatsapp.trim(),
          service: formData.service,
          budget: formData.budget,
          message: formData.message.trim(),
          website: website,
          hp_field: website,
          turnstileToken,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        // Reset Turnstile on error so a new challenge is ready
        turnstileRef.current?.reset();
        setTurnstileToken('');

        const newErrors: FormErrors = {};
        if (data.fieldErrors && typeof data.fieldErrors === 'object') {
          Object.assign(newErrors, data.fieldErrors);
        }
        newErrors.submit =
          data.error || 'Something went wrong. Please check your inputs and try again.';
        setErrors(newErrors);

        if (errorAlertRef.current) {
          errorAlertRef.current.focus();
        }
        return;
      }

      setSubmitted(true);

      // Meta Pixel Lead tracking (only when fbq is active)
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        const eventId = crypto.randomUUID();
        window.fbq(
          'track',
          'Lead',
          { content_name: 'Contact Form Submit' },
          { eventID: eventId }
        );

        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventName: 'Lead',
            eventId: eventId,
            eventSourceUrl: window.location.href,
            contentName: 'Contact Form Submit',
          }),
        }).catch(() => {});
      }
    } catch {
      setLoading(false);
      turnstileRef.current?.reset();
      setTurnstileToken('');
      setErrors({
        submit: 'Network error. Please check your internet connection and try again.',
      });
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-brand-textDark placeholder:text-brand-textMid bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all ${
      errors[field] ? 'border-red-500 focus:border-red-500' : 'border-brand-border focus:border-brand-blue'
    }`;

  if (submitted) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="bg-brand-bgAlt rounded-2xl border border-brand-border p-12 flex flex-col items-center justify-center text-center min-h-[400px] outline-none"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="w-16 h-16 text-brand-blue mb-6" aria-hidden="true" />
        <h3 className="text-2xl font-bold text-brand-textDark mb-3">Message Sent!</h3>
        <p className="text-brand-textMid leading-relaxed max-w-sm">
          Thank you! We received your message and will get back to you within 24 hours. Check your WhatsApp or email.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-2xl border border-brand-border shadow-card p-8 space-y-5"
    >
      <h3 className="text-xl font-bold text-brand-textDark mb-2">Send Us a Message</h3>

      {/* Honeypot field: Visually hidden off-screen, excluded from keyboard/screen reader flow */}
      <div
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        aria-hidden="true"
      >
        <label htmlFor="contact_website">Do not fill this field</label>
        <input
          id="contact_website"
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
        />
      </div>

      {/* Accessible Live Error Region */}
      <div aria-live="assertive">
        {errors.submit && (
          <div
            ref={errorAlertRef}
            tabIndex={-1}
            className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 outline-none"
            role="alert"
          >
            {errors.submit}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-brand-textDark mb-1.5">
            Full Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            aria-required="true"
            aria-invalid={errors.fullName ? 'true' : 'false'}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputClass('fullName')}
          />
          {errors.fullName && (
            <p id="fullName-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-brand-textDark mb-1.5">
            Business Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            aria-required="true"
            aria-invalid={errors.businessName ? 'true' : 'false'}
            aria-describedby={errors.businessName ? 'businessName-error' : undefined}
            autoComplete="organization"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Your business name"
            className={inputClass('businessName')}
          />
          {errors.businessName && (
            <p id="businessName-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.businessName}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-textDark mb-1.5">
            Email Address <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass('email')}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-brand-textDark mb-1.5">
            WhatsApp Number <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            required
            aria-required="true"
            aria-invalid={errors.whatsapp ? 'true' : 'false'}
            aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined}
            autoComplete="tel"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+880 1XXXXXXXXX"
            className={inputClass('whatsapp')}
          />
          {errors.whatsapp && (
            <p id="whatsapp-error" className="mt-1 text-xs text-red-500" role="alert">
              {errors.whatsapp}
            </p>
          )}
        </div>
      </div>

      {/* Service */}
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-brand-textDark mb-1.5">
          Service Interested In <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          aria-required="true"
          aria-invalid={errors.service ? 'true' : 'false'}
          aria-describedby={errors.service ? 'service-error' : undefined}
          value={formData.service}
          onChange={handleChange}
          className={inputClass('service')}
        >
          <option value="">Select a service...</option>
          <option value="Facebook & Meta Marketing">Facebook &amp; Meta Marketing</option>
          <option value="Google Ads">Google Ads</option>
          <option value="Website Development">Website Development</option>
          <option value="AI Automation & Chatbot">AI Automation &amp; Chatbot</option>
          <option value="Social Media Management">Social Media Management</option>
          <option value="SEO, AEO & GEO">SEO, AEO &amp; GEO</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Multiple Services">Multiple Services</option>
          <option value="Not Sure Yet">Not Sure Yet</option>
        </select>
        {errors.service && (
          <p id="service-error" className="mt-1 text-xs text-red-500" role="alert">
            {errors.service}
          </p>
        )}
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-brand-textDark mb-1.5">
          Budget Range <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="budget"
          name="budget"
          required
          aria-required="true"
          aria-invalid={errors.budget ? 'true' : 'false'}
          aria-describedby={errors.budget ? 'budget-error' : undefined}
          value={formData.budget}
          onChange={handleChange}
          className={inputClass('budget')}
        >
          <option value="">Select your budget...</option>
          <option value="Under 5,000 BDT">Under 5,000 BDT</option>
          <option value="5,000–15,000 BDT">5,000–15,000 BDT</option>
          <option value="15,000–30,000 BDT">15,000–30,000 BDT</option>
          <option value="30,000 BDT and above">30,000 BDT and above</option>
        </select>
        {errors.budget && (
          <p id="budget-error" className="mt-1 text-xs text-red-500" role="alert">
            {errors.budget}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brand-textDark mb-1.5">
          Tell Us About Your Business <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-required="true"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'message-error' : undefined}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your business, your goals, and what you are looking for..."
          className={inputClass('message')}
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-xs text-red-500" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Cloudflare Turnstile Verification */}
      <Turnstile ref={turnstileRef} action="contact_form" onSuccess={(token) => setTurnstileToken(token)} />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-navy text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-brand-blue transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>Sending...</span>
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}

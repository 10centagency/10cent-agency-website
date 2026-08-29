'use client';

import { useState } from 'react';
import { CircleCheck as CheckCircle2, Loader as Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { trackContact } from '@/lib/pixel';

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email.';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required.';
    if (!formData.service) newErrors.service = 'Please select a service.';
    if (!formData.budget) newErrors.budget = 'Please select a budget range.';
    if (!formData.message.trim()) newErrors.message = 'Please tell us about your business.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { error } = await supabase.from('contact_submissions').insert({
      full_name: formData.fullName,
      business_name: formData.businessName,
      email: formData.email,
      whatsapp: formData.whatsapp,
      service_interested: formData.service,
      budget_range: formData.budget,
      message: formData.message,
    });

    setLoading(false);

    if (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
      return;
    }

    setSubmitted(true);

    // Browser Pixel tracking
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      const eventId = crypto.randomUUID();
      window.fbq('track', 'Lead', {
        content_name: 'Contact Form Submit',
      }, { eventID: eventId });

      // CAPI tracking
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Lead',
          eventId: eventId,
          eventSourceUrl: window.location.href,
          contentName: 'Contact Form Submit',
        }),
      });
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-brand-textDark placeholder:text-brand-textMid bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 transition-all ${
      errors[field] ? 'border-red-400' : 'border-brand-border focus:border-brand-blue'
    }`;

  if (submitted) {
    return (
      <div className="bg-brand-bgAlt rounded-2xl border border-brand-border p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <CheckCircle2 className="w-16 h-16 text-brand-blue mb-6" />
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

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {errors.submit}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-brand-textDark mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputClass('fullName')}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-brand-textDark mb-1.5">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            id="businessName"
            name="businessName"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Your business name"
            className={inputClass('businessName')}
          />
          {errors.businessName && <p className="mt-1 text-xs text-red-500">{errors.businessName}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-textDark mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* WhatsApp */}
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-brand-textDark mb-1.5">
            WhatsApp Number <span className="text-red-500">*</span>
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+880 1XXXXXXXXX"
            className={inputClass('whatsapp')}
          />
          {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
        </div>
      </div>

      {/* Service */}
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-brand-textDark mb-1.5">
          Service Interested In <span className="text-red-500">*</span>
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={inputClass('service')}
        >
          <option value="">Select a service...</option>
          <option>Facebook & Meta Marketing</option>
          <option>Google Ads</option>
          <option>Website Development</option>
          <option>AI Automation & Chatbot</option>
          <option>Social Media Management</option>
          <option>SEO, AEO & GEO</option>
          <option>Graphic Design</option>
          <option>Multiple Services</option>
          <option>Not Sure Yet</option>
        </select>
        {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-brand-textDark mb-1.5">
          Budget Range <span className="text-red-500">*</span>
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className={inputClass('budget')}
        >
          <option value="">Select your budget...</option>
          <option>Under 5,000 BDT</option>
          <option>5,000–15,000 BDT</option>
          <option>15,000–30,000 BDT</option>
          <option>30,000 BDT and above</option>
        </select>
        {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-brand-textDark mb-1.5">
          Tell Us About Your Business <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your business, your goals, and what you are looking for..."
          className={inputClass('message')}
        />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-navy text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-brand-blue transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | 10 Cent Agency',
  description: 'Read the Privacy Policy of 10 Cent Agency to understand how we collect, use, and protect your information.',
  alternates: {
    canonical: 'https://www.10centagency.com/privacy-policy',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/privacy-policy',
    title: 'Privacy Policy | 10 Cent Agency',
    description: 'Read the Privacy Policy of 10 Cent Agency to understand how we collect, use, and protect your information.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-brand-bgAlt pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-6">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-textDark font-medium">Privacy Policy</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-brand-textDark">
            Privacy Policy
          </h1>
          <p className="text-brand-textMid mt-3">
            Effective Date: January 1, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Introduction</h2>
            <p className="text-brand-textMid leading-relaxed">
              Welcome to 10 Cent Agency. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              By using our website and services, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Information We Collect</h2>
            <p className="text-brand-textMid leading-relaxed">
              We collect several types of information from and about users of our website and services:
            </p>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Contact Form Data</h3>
              <p className="text-brand-textMid leading-relaxed">
                When you submit our contact form, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>Your full name</li>
                <li>Business name</li>
                <li>Email address</li>
                <li>WhatsApp number</li>
                <li>Service interest</li>
                <li>Budget information</li>
                <li>Message content</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Payment Information</h3>
              <p className="text-brand-textMid leading-relaxed">
                When you make a payment for our services, we collect payment-related information through secure third-party payment processors. We do not directly store your complete credit card or banking information on our servers.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Analytics Data</h3>
              <p className="text-brand-textMid leading-relaxed">
                We automatically collect certain information about your device and how you interact with our website, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Geographic location</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">AI Chatbot Interactions</h3>
              <p className="text-brand-textMid leading-relaxed">
                Our AI chatbot is designed to assist you with inquiries. Please note that conversation data from the chatbot is <strong>not stored</strong> on our servers. Interactions are processed in real-time and are not retained after the session ends.
              </p>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">How We Use Your Information</h2>
            <p className="text-brand-textMid leading-relaxed">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li>To respond to your inquiries and provide customer support</li>
              <li>To deliver the digital marketing services you have requested</li>
              <li>To process payments and manage billing</li>
              <li>To send you service-related communications and updates</li>
              <li>To improve our website, services, and user experience</li>
              <li>To analyze website traffic and user behavior</li>
              <li>To comply with legal obligations and protect our rights</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          {/* Payment Information Handling */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Payment Information Handling</h2>
            <p className="text-brand-textMid leading-relaxed">
              We accept online payments for our services through secure third-party payment processors. These processors are PCI-DSS compliant and use industry-standard encryption to protect your payment information.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              We may receive limited payment information such as the last four digits of your card, transaction ID, and payment status for record-keeping and customer service purposes. We do not have access to or store your complete payment card details.
            </p>
          </section>

          {/* Cookies and Tracking Technologies */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Cookies and Tracking Technologies</h2>
            <p className="text-brand-textMid leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. The technologies we use include:
            </p>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Google Analytics</h3>
              <p className="text-brand-textMid leading-relaxed">
                We use Google Analytics to understand how visitors interact with our website. Google Analytics collects information such as how often users visit our site, what pages they visit, and what other sites they used prior to coming to our site. We use this information to improve our website and services.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Facebook Pixel</h3>
              <p className="text-brand-textMid leading-relaxed">
                We use Facebook Pixel to measure the effectiveness of our advertising campaigns and to deliver targeted advertisements. The Facebook Pixel collects information about your browsing behavior and may track you across different websites.
              </p>
            </div>

            <p className="text-brand-textMid leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </section>

          {/* Data Sharing and Disclosure */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Data Sharing and Disclosure</h2>
            <p className="text-brand-textMid leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf, such as payment processing, email delivery, hosting services, and analytics.</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
              <li><strong>Protection of Rights:</strong> We may disclose your information to protect and defend our rights, property, or safety, or that of our users or others.</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Data Retention</h2>
            <p className="text-brand-textMid leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              Contact form submissions and client project data are typically retained for the duration of our business relationship and for a reasonable period thereafter for record-keeping and legal compliance purposes.
            </p>
          </section>

          {/* Data Security Measures */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Data Security Measures</h2>
            <p className="text-brand-textMid leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li>Encryption of data in transit using SSL/TLS protocols</li>
              <li>Secure storage of data on protected servers</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Employee training on data protection practices</li>
            </ul>
            <p className="text-brand-textMid leading-relaxed">
              However, please note that no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Third-Party Services</h2>
            <p className="text-brand-textMid leading-relaxed">
              Our website may contain links to third-party websites or services that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              We strongly advise you to review the privacy policy of every site you visit. This Privacy Policy applies only to information collected by 10 Cent Agency.
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">International Data Transfers</h2>
            <p className="text-brand-textMid leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of Bangladesh, where data protection laws may differ from those in your jurisdiction. By using our services, you consent to the transfer of your information to countries outside of Bangladesh.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Your Rights</h2>
            <p className="text-brand-textMid leading-relaxed">
              You have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li><strong>Access:</strong> You have the right to request access to the personal information we hold about you.</li>
              <li><strong>Correction:</strong> You have the right to request that we correct any inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> You have the right to request that we delete your personal information, subject to certain legal exceptions.</li>
              <li><strong>Objection:</strong> You have the right to object to our processing of your personal information.</li>
              <li><strong>Withdrawal of Consent:</strong> If we rely on your consent to process your information, you have the right to withdraw that consent at any time.</li>
            </ul>
            <p className="text-brand-textMid leading-relaxed">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Children's Privacy</h2>
            <p className="text-brand-textMid leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Changes to This Privacy Policy</h2>
            <p className="text-brand-textMid leading-relaxed">
              We may update our Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information. Your continued use of our services after any changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Contact Information</h2>
            <p className="text-brand-textMid leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-brand-bgAlt rounded-xl p-6 space-y-2">
              <p className="text-brand-textDark font-semibold">10 Cent Agency</p>
              <p className="text-brand-textMid">East Monipur, Mirpur, Dhaka, Bangladesh-1216</p>
              <p className="text-brand-textMid">Email: <a href="mailto:hello@10centagency.com" className="text-brand-blue hover:underline">hello@10centagency.com</a></p>
              <p className="text-brand-textMid">WhatsApp: <a href="https://wa.me/8801615144114" className="text-brand-blue hover:underline">+880 1615 144114</a></p>
            </div>
          </section>

          {/* Last Updated */}
          <section className="pt-8 border-t border-brand-border">
            <p className="text-brand-textMid text-sm">
              Last Updated: January 1, 2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

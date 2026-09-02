import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | 10 Cent Agency',
  description: 'Read the Terms of Service of 10 Cent Agency to understand the rules and conditions for using our services.',
  alternates: {
    canonical: 'https://www.10centagency.com/terms-of-service',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.10centagency.com/terms-of-service',
    title: 'Terms of Service | 10 Cent Agency',
    description: 'Read the Terms of Service of 10 Cent Agency to understand the rules and conditions for using our services.',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-brand-bgAlt pt-32 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-brand-textMid mb-6">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-textDark font-medium">Terms of Service</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-brand-textDark">
            Terms of Service
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
              Welcome to 10 Cent Agency. These Terms of Service ("Terms") govern your use of our website and the digital marketing services we provide. By accessing our website or engaging our services, you agree to be bound by these Terms.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              Please read these Terms carefully before using our services. If you do not agree with any part of these Terms, you should not use our website or services.
            </p>
          </section>

          {/* Services Description */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Services Description</h2>
            <p className="text-brand-textMid leading-relaxed">
              10 Cent Agency provides professional digital marketing services to small and medium businesses in Bangladesh and internationally. Our services include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li><strong>Facebook Marketing:</strong> Social media advertising, content creation, page management, and campaign optimization</li>
              <li><strong>Website Development:</strong> Custom website design, development, maintenance, and hosting solutions</li>
              <li><strong>AI Automation:</strong> Chatbot development, workflow automation, and AI-powered business solutions</li>
              <li><strong>SEO Services:</strong> Search engine optimization, keyword research, on-page and off-page optimization</li>
              <li><strong>Design Services:</strong> Graphic design, branding, logo design, and visual content creation</li>
            </ul>
            <p className="text-brand-textMid leading-relaxed">
              The specific scope, deliverables, timeline, and pricing for each project will be outlined in a separate service agreement or proposal provided to the client.
            </p>
          </section>

          {/* Client Responsibilities */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Client Responsibilities</h2>
            <p className="text-brand-textMid leading-relaxed">
              To ensure successful project completion, clients agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li>Provide accurate and complete information necessary for service delivery</li>
              <li>Grant timely access to required accounts, platforms, and resources (e.g., Facebook Business Manager, website hosting, domain registrar)</li>
              <li>Respond to requests for feedback, approvals, and clarifications within agreed timeframes</li>
              <li>Provide all content, images, logos, and materials needed for the project in a timely manner</li>
              <li>Ensure that all materials provided do not infringe on third-party intellectual property rights</li>
              <li>Make payments according to the agreed schedule</li>
              <li>Comply with all applicable laws and regulations related to their business and marketing activities</li>
            </ul>
            <p className="text-brand-textMid leading-relaxed">
              Failure to fulfill these responsibilities may result in project delays, additional costs, or termination of services.
            </p>
          </section>

          {/* Payments and Billing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Payments and Billing</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Payment Terms</h3>
              <p className="text-brand-textMid leading-relaxed">
                Payment terms will be specified in your service agreement or invoice. We accept online payments through secure third-party payment processors. Payment methods may include credit/debit cards, bank transfers, and mobile banking services.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Payment Schedule</h3>
              <p className="text-brand-textMid leading-relaxed">
                Depending on the project scope, we may require:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>Full payment upfront for smaller projects</li>
                <li>50% deposit upfront with the remaining 50% upon project completion</li>
                <li>Milestone-based payments for larger projects</li>
                <li>Monthly retainer fees for ongoing services</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Late Payments</h3>
              <p className="text-brand-textMid leading-relaxed">
                Invoices are due within the timeframe specified on the invoice. Late payments may result in suspension of services, late fees, or termination of the service agreement. We reserve the right to charge interest on overdue amounts.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Refund Policy</h3>
              <p className="text-brand-textMid leading-relaxed">
                All payments are generally non-refundable unless otherwise agreed upon in writing. Refunds may be considered on a case-by-case basis in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>Services have not yet been initiated</li>
                <li>We are unable to deliver the agreed-upon services</li>
                <li>Both parties mutually agree to terminate the project</li>
              </ul>
              <p className="text-brand-textMid leading-relaxed">
                Refund requests must be submitted in writing to hello@10centagency.com and will be reviewed within 7 business days.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Intellectual Property</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Client-Owned Materials</h3>
              <p className="text-brand-textMid leading-relaxed">
                All materials, content, logos, trademarks, and intellectual property provided by the client remain the property of the client. The client grants 10 Cent Agency a non-exclusive license to use these materials solely for the purpose of delivering the agreed services.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Work Product Ownership</h3>
              <p className="text-brand-textMid leading-relaxed">
                Upon full payment, the client will own all custom work products created specifically for them, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>Custom website designs and code</li>
                <li>Custom graphics and visual content</li>
                <li>Marketing copy and content written specifically for the client</li>
                <li>Campaign strategies and documentation</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Agency-Owned Materials</h3>
              <p className="text-brand-textMid leading-relaxed">
                10 Cent Agency retains ownership of:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>Pre-existing templates, frameworks, and tools</li>
                <li>Proprietary methodologies and processes</li>
                <li>General knowledge and expertise gained during the project</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Portfolio Rights</h3>
              <p className="text-brand-textMid leading-relaxed">
                Unless otherwise agreed in writing, 10 Cent Agency reserves the right to showcase completed work in our portfolio, case studies, and marketing materials. We will respect any confidentiality agreements and will not disclose sensitive business information.
              </p>
            </div>
          </section>

          {/* Project Timelines and Revisions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Project Timelines and Revisions</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Timelines</h3>
              <p className="text-brand-textMid leading-relaxed">
                Project timelines are estimates based on the information available at the time of agreement. Actual completion dates may vary depending on:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>Timely client feedback and approvals</li>
                <li>Availability of required materials and access</li>
                <li>Scope changes or additional requests</li>
                <li>Technical challenges or third-party dependencies</li>
              </ul>
              <p className="text-brand-textMid leading-relaxed">
                We will make reasonable efforts to meet agreed timelines and will communicate any delays promptly.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Revisions</h3>
              <p className="text-brand-textMid leading-relaxed">
                Each project includes a specified number of revision rounds as outlined in the service agreement. Revisions must be requested within the agreed timeframe and should be based on the original project scope.
              </p>
              <p className="text-brand-textMid leading-relaxed">
                Additional revisions beyond the agreed number, or revisions that constitute scope changes, may incur additional fees. We will provide a quote for any additional work before proceeding.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Limitation of Liability</h2>
            <p className="text-brand-textMid leading-relaxed">
              To the fullest extent permitted by law, 10 Cent Agency shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Loss of data or information</li>
              <li>Business interruption</li>
              <li>Damage to reputation</li>
              <li>Third-party claims</li>
            </ul>
            <p className="text-brand-textMid leading-relaxed">
              Our total liability for any claims arising from our services shall not exceed the total amount paid by the client for the specific services that gave rise to the claim.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              We are not responsible for results or outcomes that depend on factors outside our control, including but not limited to platform algorithm changes, market conditions, client business practices, or third-party service disruptions.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Disclaimer of Warranties</h2>
            <p className="text-brand-textMid leading-relaxed">
              Our services are provided on an "as is" and "as available" basis. While we strive to deliver high-quality services, we make no warranties or representations, express or implied, regarding:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li>Specific results or outcomes from marketing campaigns</li>
              <li>Guaranteed rankings, traffic, or conversions</li>
              <li>Uninterrupted or error-free service delivery</li>
              <li>Compatibility with all platforms or devices</li>
              <li>Future performance of delivered work products</li>
            </ul>
            <p className="text-brand-textMid leading-relaxed">
              Digital marketing results can vary based on numerous factors including market conditions, competition, budget, and client business practices. We will use our professional expertise and best efforts but cannot guarantee specific outcomes.
            </p>
          </section>

          {/* Termination of Services */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Termination of Services</h2>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Termination by Client</h3>
              <p className="text-brand-textMid leading-relaxed">
                Clients may terminate services by providing written notice. Termination terms will depend on the service agreement:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>For project-based work: Client remains responsible for payment for work completed up to the termination date</li>
                <li>For retainer services: Client must provide 30 days' written notice and is responsible for payment through the notice period</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Termination by Agency</h3>
              <p className="text-brand-textMid leading-relaxed">
                We reserve the right to terminate services immediately if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
                <li>Client fails to make payments as agreed</li>
                <li>Client breaches these Terms or the service agreement</li>
                <li>Client engages in abusive, threatening, or inappropriate behavior</li>
                <li>Client requests services that violate laws or platform policies</li>
                <li>Continuing the relationship is not feasible or appropriate</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-brand-textDark">Post-Termination</h3>
              <p className="text-brand-textMid leading-relaxed">
                Upon termination, the client will receive all completed work products for which payment has been made. We will provide reasonable assistance with transition, but are not obligated to provide ongoing support after termination.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Governing Law</h2>
            <p className="text-brand-textMid leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Bangladesh, without regard to its conflict of law provisions.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              Any legal action or proceeding arising out of or relating to these Terms or our services shall be brought exclusively in the courts of Dhaka, Bangladesh, and both parties consent to the jurisdiction of such courts.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Dispute Resolution</h2>
            <p className="text-brand-textMid leading-relaxed">
              In the event of any dispute, controversy, or claim arising out of or relating to these Terms or our services, the parties agree to first attempt to resolve the matter through good faith negotiations.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              If the dispute cannot be resolved through direct negotiation within 30 days, the parties may pursue mediation before resorting to formal legal proceedings. Both parties agree to participate in mediation in good faith.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              If mediation is unsuccessful, either party may pursue resolution through the appropriate courts in Dhaka, Bangladesh.
            </p>
          </section>

          {/* Confidentiality */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Confidentiality</h2>
            <p className="text-brand-textMid leading-relaxed">
              Both parties agree to maintain the confidentiality of any proprietary or confidential information shared during the course of the business relationship. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li>Business strategies and plans</li>
              <li>Financial information</li>
              <li>Customer data and lists</li>
              <li>Proprietary processes and methodologies</li>
              <li>Any information marked as confidential</li>
            </ul>
            <p className="text-brand-textMid leading-relaxed">
              This confidentiality obligation survives the termination of the service agreement and continues indefinitely unless the information becomes publicly available through no fault of the receiving party.
            </p>
          </section>

          {/* Force Majeure */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Force Majeure</h2>
            <p className="text-brand-textMid leading-relaxed">
              Neither party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable control, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-textMid">
              <li>Natural disasters, pandemics, or public health emergencies</li>
              <li>War, terrorism, or civil unrest</li>
              <li>Government actions or regulations</li>
              <li>Internet or telecommunications failures</li>
              <li>Third-party platform outages or policy changes</li>
              <li>Power outages or infrastructure failures</li>
            </ul>
            <p className="text-brand-textMid leading-relaxed">
              In such events, the affected party will notify the other party promptly and make reasonable efforts to resume performance as soon as possible.
            </p>
          </section>

          {/* Entire Agreement */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Entire Agreement</h2>
            <p className="text-brand-textMid leading-relaxed">
              These Terms, together with any service agreements, proposals, or other written agreements between the parties, constitute the entire agreement regarding the subject matter and supersede all prior or contemporaneous communications, agreements, or understandings, whether written or oral.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              Any modifications to these Terms must be made in writing and signed by both parties to be valid.
            </p>
          </section>

          {/* Severability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Severability</h2>
            <p className="text-brand-textMid leading-relaxed">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Changes to These Terms</h2>
            <p className="text-brand-textMid leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify clients of any material changes by posting the updated Terms on our website and updating the "Effective Date" at the top of this page.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              Your continued use of our services after any changes constitutes acceptance of the updated Terms. If you do not agree with the changes, you should discontinue use of our services.
            </p>
            <p className="text-brand-textMid leading-relaxed">
              For existing service agreements, changes to these Terms will not affect the terms of those agreements unless both parties agree in writing.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Contact Information</h2>
            <p className="text-brand-textMid leading-relaxed">
              If you have any questions, concerns, or disputes regarding these Terms of Service, please contact us:
            </p>
            <div className="bg-brand-bgAlt rounded-xl p-6 space-y-2">
              <p className="text-brand-textDark font-semibold">10 Cent Agency</p>
              <p className="text-brand-textMid">East Monipur, Mirpur, Dhaka, Bangladesh-1216</p>
              <p className="text-brand-textMid">Email: <a href="mailto:hello@10centagency.com" className="text-brand-blue hover:underline">hello@10centagency.com</a></p>
              <p className="text-brand-textMid">WhatsApp: <a href="https://wa.me/8801615144114" className="text-brand-blue hover:underline">+880 1615 144114</a></p>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-textDark">Acknowledgment</h2>
            <p className="text-brand-textMid leading-relaxed">
              By using our website or engaging our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.
            </p>
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

import {
  Utensils, ShoppingBag, BookOpen, Stethoscope, Building2,
  ShoppingCart, Scale, Scissors, Cpu, Store, GraduationCap,
  Plane, Pill, Dumbbell,
} from 'lucide-react';

const industries = [
  { label: 'Restaurant', icon: Utensils },
  { label: 'Clothing Brand', icon: ShoppingBag },
  { label: 'Coaching Center', icon: BookOpen },
  { label: 'Healthcare', icon: Stethoscope },
  { label: 'Real Estate', icon: Building2 },
  { label: 'E-commerce', icon: ShoppingCart },
  { label: 'Law Firm', icon: Scale },
  { label: 'Beauty Salon', icon: Scissors },
  { label: 'Technology Startup', icon: Cpu },
  { label: 'Local Retail', icon: Store },
  { label: 'Education', icon: GraduationCap },
  { label: 'Travel Agency', icon: Plane },
  { label: 'Pharmacy', icon: Pill },
  { label: 'Gym & Fitness', icon: Dumbbell },
];

function Tag({ label, icon: Icon }: { label: string; icon: React.ElementType }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-2 rounded-full border border-brand-border bg-white text-brand-textDark text-sm px-4 py-2 mx-3 shadow-sm">
      <Icon className="w-3.5 h-3.5 text-brand-blue" />
      {label}
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <section className="bg-white py-8 border-y border-brand-border overflow-hidden" aria-label="Businesses We Help">
      <p className="text-center text-brand-textMid text-sm font-medium mb-5">Businesses We Help</p>
      <div className="space-y-4 marquee-container">
        {/* Row 1 */}
        <div className="flex overflow-hidden">
          <div className="flex marquee-track animate-marquee">
            <div className="flex">
              {industries.map((item, i) => (
                <Tag key={`r1-${i}`} label={item.label} icon={item.icon} />
              ))}
            </div>
            <div className="flex" aria-hidden="true">
              {industries.map((item, i) => (
                <Tag key={`r1-dup-${i}`} label={item.label} icon={item.icon} />
              ))}
            </div>
          </div>
        </div>
        {/* Row 2 — reverse (visual duplicate in opposite direction, hidden from screen readers) */}
        <div className="flex overflow-hidden" aria-hidden="true">
          <div className="flex marquee-track animate-marquee-reverse">
            <div className="flex">
              {industries.map((item, i) => (
                <Tag key={`r2-${i}`} label={item.label} icon={item.icon} />
              ))}
            </div>
            <div className="flex">
              {industries.map((item, i) => (
                <Tag key={`r2-dup-${i}`} label={item.label} icon={item.icon} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

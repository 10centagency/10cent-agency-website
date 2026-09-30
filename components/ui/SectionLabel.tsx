interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div className={`inline-flex items-center gap-2 bg-brand-blue/10 text-brand-blue rounded-full px-4 py-1.5 text-sm font-semibold mb-4 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
      {children}
    </div>
  );
}

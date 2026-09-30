import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-[160px] sm:text-[200px] font-black text-brand-blue/20 leading-none select-none mb-4">
          404
        </div>
        <h2 className="text-3xl font-bold text-brand-textDark mb-4">Page Not Found</h2>
        <p className="text-brand-textMid text-lg mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-navy text-white font-semibold rounded-xl px-8 py-4 hover:bg-brand-blue transition-colors duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

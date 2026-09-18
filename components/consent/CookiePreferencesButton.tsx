'use client';

export default function CookiePreferencesButton() {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tc_open_consent'));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-white/50 text-sm hover:text-white/80 transition-colors focus:outline-none focus:underline"
    >
      Cookie Preferences
    </button>
  );
}

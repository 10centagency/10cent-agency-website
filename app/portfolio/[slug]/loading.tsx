export default function ProjectLoading() {
  return (
    <>
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-40 bg-brand-border rounded animate-pulse mb-8" />
          <div className="h-4 w-20 bg-brand-border rounded animate-pulse mb-3" />
          <div className="h-12 w-80 bg-brand-border rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-brand-border rounded animate-pulse" />
        </div>
      </section>
      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="h-64 bg-brand-bgAlt rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-48 bg-brand-bgAlt rounded animate-pulse" />
            <div className="h-4 w-full bg-brand-bgAlt rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-brand-bgAlt rounded animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}

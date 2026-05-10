export default function PortfolioLoading() {
  return (
    <>
      <section className="bg-brand-bgAlt pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-40 bg-brand-border rounded animate-pulse mb-8" />
          <div className="h-12 w-64 bg-brand-border rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-brand-border rounded animate-pulse" />
        </div>
      </section>
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-brand-border bg-white"
              >
                <div className="h-52 bg-brand-bgAlt animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-16 bg-brand-bgAlt rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-brand-bgAlt rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-brand-bgAlt rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

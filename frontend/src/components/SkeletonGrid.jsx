const SkeletonCard = ({ delay = 0 }) => (
  <div
    className="rounded-xl overflow-hidden bg-dark-700 border border-dark-500 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="aspect-square skeleton" />
    <div className="p-3">
      <div className="h-3 w-16 skeleton rounded-full" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 12 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} delay={i * 40} />
    ))}
  </div>
);

export default SkeletonGrid;

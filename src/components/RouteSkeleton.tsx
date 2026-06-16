import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const variants = [
  () => (
    <div className="space-y-4">
      <div className="skeleton-shimmer h-8 w-2/3" />
      <div className="skeleton-shimmer h-4 w-1/2" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-shimmer h-28" />)}
      </div>
      <div className="skeleton-shimmer h-64 mt-6" />
    </div>
  ),
  () => (
    <div className="space-y-4 max-w-2xl">
      <div className="skeleton-shimmer h-8 w-1/2" />
      <div className="skeleton-shimmer h-4 w-3/4" />
      <div className="skeleton-shimmer h-72 mt-4" />
    </div>
  ),
  () => (
    <div className="space-y-4">
      <div className="skeleton-shimmer h-8 w-1/3" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-shimmer h-48" />)}
      </div>
    </div>
  ),
];

export const RouteSkeleton = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [showing, setShowing] = useState(false);
  const [variantIdx, setVariantIdx] = useState(0);

  useEffect(() => {
    setShowing(true);
    setVariantIdx(Math.floor(Math.random() * variants.length));
    const t = setTimeout(() => setShowing(false), 450 + Math.random() * 150);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (showing) {
    const V = variants[variantIdx];
    return <div className="p-4 md:p-6"><V /></div>;
  }
  return <>{children}</>;
};

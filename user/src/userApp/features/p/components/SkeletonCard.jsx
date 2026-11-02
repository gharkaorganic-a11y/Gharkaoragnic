export const SkeletonCard = () => (
  <div className="flex flex-col h-full animate-pulse">
    <div className="w-full aspect-square bg-[#f4f2e9] rounded-2xl sm:rounded-none" />
    <div className="mt-3 sm:mt-4 space-y-2">
      <div className="h-4 bg-[#f4f2e9] rounded w-4/5" />
      <div className="h-3.5 bg-[#f4f2e9] rounded w-1/2" />
      <div className="h-4 bg-[#f4f2e9] rounded w-1/3" />
      <div className="h-8 bg-[#f4f2e9] rounded w-full mt-2" />
    </div>
  </div>
);

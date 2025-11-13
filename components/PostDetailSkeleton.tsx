export default function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-12 w-32 skeleton rounded mb-4" />
      <div className="h-16 w-full skeleton rounded mb-6" />
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-10 h-10 skeleton rounded-full" />
        <div className="h-4 w-32 skeleton rounded" />
        <div className="h-4 w-24 skeleton rounded" />
        <div className="h-4 w-24 skeleton rounded" />
      </div>
      <div className="h-96 w-full skeleton rounded mb-8" />
      <div className="space-y-4">
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-4 w-full skeleton rounded" />
        <div className="h-4 w-5/6 skeleton rounded" />
      </div>
    </div>
  );
}


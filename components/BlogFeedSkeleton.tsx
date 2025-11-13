export default function BlogFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="h-48 w-full skeleton" />
          <div className="p-6">
            <div className="h-4 w-20 skeleton rounded-full mb-3" />
            <div className="h-6 w-full skeleton rounded mb-3" />
            <div className="h-4 w-full skeleton rounded mb-2" />
            <div className="h-4 w-3/4 skeleton rounded mb-4" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 skeleton rounded" />
              <div className="h-4 w-32 skeleton rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


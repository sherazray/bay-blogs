export default function UserProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-30 h-30 skeleton rounded-full" />
          <div className="flex-1 w-full space-y-4">
            <div className="h-8 w-48 skeleton rounded" />
            <div className="h-4 w-full skeleton rounded" />
            <div className="h-4 w-3/4 skeleton rounded" />
            <div className="flex gap-4">
              <div className="h-4 w-24 skeleton rounded" />
              <div className="h-4 w-24 skeleton rounded" />
              <div className="h-4 w-24 skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-96 skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}


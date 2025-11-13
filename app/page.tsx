import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogFeed from "@/components/BlogFeed";
import BlogFeedSkeleton from "@/components/BlogFeedSkeleton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to BayBlogs
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover stories, ideas, and perspectives from our community
          </p>
        </div>
        <Suspense fallback={<BlogFeedSkeleton />}>
          <BlogFeed />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


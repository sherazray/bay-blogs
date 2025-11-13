"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, MessageCircle, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    excerpt?: string | null;
    image?: string | null;
    createdAt: string;
    author: {
      id: string;
      name: string;
      image?: string | null;
    };
    _count: {
      comments: number;
    };
    views: number;
    category?: string | null;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const excerpt = post.excerpt || post.title.substring(0, 150) + "...";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <Link href={`/posts/${post.id}`}>
        {post.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          {post.category && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-3">
              {post.category}
            </span>
          )}
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={16} />
                <span>{post._count.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{post.views}</span>
              </div>
            </div>
            <Link
              href={`/profile/${post.author.id}`}
              className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {post.author.image && (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="font-medium">{post.author.name}</span>
            </Link>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}


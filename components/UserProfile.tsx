"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, FileText, MessageCircle } from "lucide-react";
import BlogCard from "./BlogCard";
import { motion } from "framer-motion";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    bio?: string | null;
    createdAt: string;
    posts: Array<{
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
    }>;
    _count: {
      posts: number;
      comments: number;
    };
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={120}
              height={120}
              className="rounded-full"
            />
          ) : (
            <div className="w-30 h-30 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-4xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {user.name}
            </h1>
            {user.bio && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{user.bio}</p>
            )}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>Joined {format(new Date(user.createdAt), "MMM yyyy")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText size={16} />
                <span>{user._count.posts} Posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle size={16} />
                <span>{user._count.comments} Comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Posts by {user.name}
        </h2>
        {user.posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              No posts yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}


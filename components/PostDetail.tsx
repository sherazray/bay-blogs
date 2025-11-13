"use client";

import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Eye, MessageCircle, Edit, Trash2, User } from "lucide-react";
import CommentSection from "./CommentSection";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface PostDetailProps {
  post: {
    id: string;
    title: string;
    content: string;
    excerpt?: string | null;
    image?: string | null;
    category?: string | null;
    createdAt: string;
    views: number;
    author: {
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
    };
    _count: {
      comments: number;
    };
  };
}

export default function PostDetail({ post }: PostDetailProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const isAuthor = session?.user?.id === post.author.id;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Post deleted");
        router.push("/");
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      toast.error("Error deleting post");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isAuthor && (
        <div className="mb-6 flex space-x-4">
          <Link
            href={`/posts/${post.id}/edit`}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={18} />
            <span>Edit Post</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 size={18} />
            <span>Delete Post</span>
          </button>
        </div>
      )}

      {post.category && (
        <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
          {post.category}
        </span>
      )}

      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {post.title}
      </h1>

      <div className="flex items-center space-x-4 mb-6 text-gray-600 dark:text-gray-400">
        <Link
          href={`/profile/${post.author.id}`}
          className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium">{post.author.name}</span>
        </Link>
        <div className="flex items-center space-x-1">
          <Calendar size={16} />
          <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye size={16} />
          <span>{post.views} views</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle size={16} />
          <span>{post._count.comments} comments</span>
        </div>
      </div>

      {post.image && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.excerpt && (
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 italic">
          {post.excerpt}
        </p>
      )}

      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          {post.author.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xl">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <Link
              href={`/profile/${post.author.id}`}
              className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {post.author.name}
            </Link>
            {post.author.bio && (
              <p className="text-gray-600 dark:text-gray-400">{post.author.bio}</p>
            )}
          </div>
        </div>
      </div>

      <CommentSection postId={post.id} authorId={post.author.id} />
    </motion.article>
  );
}


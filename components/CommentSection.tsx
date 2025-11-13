"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Send, Reply, Trash2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  authorId: string;
}

export default function CommentSection({ postId, authorId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to comment");
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId }),
      });

      if (response.ok) {
        toast.success("Comment added!");
        setContent("");
        fetchComments();
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      toast.error("Error adding comment");
    }
  };

  const handleReply = async (parentId: string) => {
    if (!session) {
      toast.error("Please login to reply");
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, postId, parentId }),
      });

      if (response.ok) {
        toast.success("Reply added!");
        setReplyContent("");
        setReplyingTo(null);
        fetchComments();
      } else {
        toast.error("Failed to add reply");
      }
    } catch (error) {
      toast.error("Error adding reply");
    }
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isAuthor = session?.user?.id === comment.author.id;
    const canDelete = isAuthor || session?.user?.id === authorId;

    return (
      <div className={`${depth > 0 ? "ml-8 mt-4" : ""} border-l-2 border-gray-200 dark:border-gray-700 pl-4`}>
        <div className="flex items-start space-x-3">
          {comment.author.image ? (
            <Image
              src={comment.author.image}
              alt={comment.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {comment.author.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
              {comment.content}
            </p>
            {session && depth < 2 && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
              >
                <Reply size={14} />
                <span>Reply</span>
              </button>
            )}
            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Send size={16} />
                    <span>Reply</span>
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Comments ({comments.length})
      </h3>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />
          <button
            type="submit"
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Send size={18} />
            <span>Post Comment</span>
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Please{" "}
            <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
              login
            </a>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>
    </div>
  );
}


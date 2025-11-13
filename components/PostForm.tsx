"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { Upload, X, Loader2 } from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface PostFormProps {
  postId?: string;
  initialData?: {
    title: string;
    content: string;
    excerpt?: string;
    image?: string;
    category?: string;
    published: boolean;
  };
}

export default function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

  // Sync image preview when initialData changes
  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image);
    }
  }, [initialData?.image]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImage(data.url);
        setImagePreview(data.url);
        toast.success("Image uploaded successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      setLoading(false);
      return;
    }

    try {
      const url = postId ? `/api/posts/${postId}` : "/api/posts";
      const method = postId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          image,
          category: category || null,
          published,
        }),
      });

      if (response.ok) {
        toast.success(postId ? "Post updated!" : "Post created!");
        const data = await response.json();
        router.push(`/posts/${data.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save post");
      }
    } catch (error) {
      toast.error("Error saving post");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          Short Description (Excerpt)
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="A brief description of your post..."
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          Featured Image
        </label>
        
        {/* Image Upload Section */}
        <div className="space-y-4">
          {/* Upload Button */}
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              id="file-upload"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Image</span>
                </>
              )}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              or enter URL below
            </span>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* URL Input (Alternative to upload) */}
          <div>
            <label htmlFor="image-url" className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Or paste image URL
            </label>
            <input
              type="url"
              id="image-url"
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                setImagePreview(e.target.value || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Travel">Travel</option>
          <option value="Food">Food</option>
          <option value="Health">Health</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          Content *
        </label>
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillModules}
            theme="snow"
            className="bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Publish immediately
        </label>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : postId ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


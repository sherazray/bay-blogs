import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostDetail from "@/components/PostDetail";
import PostDetailSkeleton from "@/components/PostDetailSkeleton";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      },
      comments: {
        where: { parentId: null },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  if (!post || !post.published) {
    return null;
  }

  // Increment view count
  await prisma.post.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return post;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: { title: true, excerpt: true, image: true },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <Suspense fallback={<PostDetailSkeleton />}>
          <PostDetail post={post} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProfile from "@/components/UserProfile";
import UserProfileSkeleton from "@/components/UserProfileSkeleton";
import type { Metadata } from "next";

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      createdAt: true,
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      },
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  });

  return user;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const user = await getUser(params.id);

  if (!user) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${user.name} - BayBlogs`,
    description: user.bio || `Posts by ${user.name}`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<UserProfileSkeleton />}>
          <UserProfile user={user} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


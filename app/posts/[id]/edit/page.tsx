import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostForm from "@/components/PostForm";

async function getPost(id: string, userId: string) {
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post || post.authorId !== userId) {
    return null;
  }

  return post;
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const post = await getPost(params.id, session.user.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          Edit Post
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <PostForm
            postId={post.id}
            initialData={{
              title: post.title,
              content: post.content,
              excerpt: post.excerpt || "",
              image: post.image || "",
              category: post.category || "",
              published: post.published,
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}


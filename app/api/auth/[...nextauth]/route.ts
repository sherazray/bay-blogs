import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Mark this route as dynamic to prevent build-time evaluation
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


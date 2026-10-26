import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "gelistirme-icin-gecici-bir-anahtar",
  providers: [
    Credentials({
      async authorize(credentials) {
        // Demo hilesi: verify-code API'si zaten kodu doğruladı.
        // Burada sadece kullanıcıyı bulup dönüyoruz.
        if (!credentials?.email) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        return user || null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.role = (token.role as string) || "VISITOR"; 
      }
      return session;
    },
  },
  pages: { signIn: "/auth" },
});
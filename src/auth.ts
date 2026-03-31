import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password!
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectToDatabase();
        
        // Handle Google First-Time Onboarding
        if (account?.provider === "google") {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            await User.create({
              name: user.name || "Vault Player",
              email: user.email || "",
              avatarUrl: user.image || "",
              instagramUsername: `user_${Math.floor(1000 + Math.random() * 9000)}`,
              loginCount: 1,
              lastLogin: new Date(),
            });
            return true; // Bypass increment for first creation
          }
        }

        // Handle Tracker Update for All Providers (Credentials & Google)
        if (user.email) {
          await User.findOneAndUpdate(
            { email: user.email },
            { 
              $inc: { loginCount: 1 },
              $set: { lastLogin: new Date() }
            }
          );
        }
      } catch (error) {
        console.error("Auth sync error:", error);
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

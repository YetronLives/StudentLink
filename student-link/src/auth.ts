import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { fetchUserByEmailSSO, validateUserCredentials } from "@/lib/userServerFuntions";

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;
                return await validateUserCredentials(credentials.email, credentials.password);
            },
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const dbUser = await fetchUserByEmailSSO(user.email!);
                return true;
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                if (account?.provider === "google") {
                    const dbUser = await fetchUserByEmailSSO(user.email!);
                    if (dbUser) {
                        Object.assign(token, dbUser);
                    }
                } else {
                    Object.assign(token, user);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                Object.assign(session.user, token);
            }
            return session;
        },
    },
});

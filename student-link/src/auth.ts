import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { fetchUserByEmailSSO, validateUserCredentials } from "@/lib/userServerFuntions";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
        // invalid: "/login", // Optional: Redirects here on auth errors
    },
    callbacks: {
        async signIn({ user, account }) {
            // 1. If logging in with Google...
            if (account?.provider === "google") {
                try {
                    // 2. Check if this email exists in your DB
                    const dbUser = await fetchUserByEmailSSO(user.email!);

                    // 3. If NO user found, stop login and send to finish registration
                    if (!dbUser) {
                        // We pass the email/name/image so the form can pre-fill
                        return `/finish-registration?email=${encodeURIComponent(user.email!)}&name=${encodeURIComponent(user.name || "")}&image=${encodeURIComponent(user.image || "")}`;
                    }

                    // 4. If user found, let them in!
                    return true;
                } catch (error) {
                    console.error("Error in Google SignIn callback:", error);
                    return false;
                }
            }
            // Allow other providers (Credentials)
            return true;
        },
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                // If it's a Google login, we need to fetch their DB data to populate the token
                // (Because the 'user' object from Google only has name/email/image)
                if (account?.provider === "google") {
                    const dbUser = await fetchUserByEmailSSO(user.email!);
                    if (dbUser) {
                        token.id = dbUser.id;
                        token.username = dbUser.username;
                        token.school = dbUser.school;
                        token.major = dbUser.major;
                        token.year = dbUser.year;
                        // Use DB avatar if available, otherwise Google image
                        token.avatarUrl = dbUser.avatarUrl || user.image;
                    }
                } else {
                    // Credentials login already returns the full DB user object
                    Object.assign(token, user);
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.school = token.school as string;
                session.user.major = token.major as string;
                session.user.year = token.year as string;
                session.user.avatarUrl = token.avatarUrl as string;
            }
            return session;
        },
    },
});
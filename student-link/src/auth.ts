import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchUserByEmailSSO, validateUserCredentials } from "@/lib/userServerFuntions";

// Debug environment variables (simplified)
if (process.env.NODE_ENV === 'development') {
  console.log('NextAuth Environment Check:', {
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  });
}

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    console.log("🧠 [NextAuth] Authorize called with:", credentials);

                    if (!credentials?.email || !credentials.password) {
                        console.error("🚨 Missing credentials in authorize()");
                        return null;
                    }

                    const user = await validateUserCredentials(credentials.email, credentials.password);
                    console.log("✅ [NextAuth] validateUserCredentials returned:", user);

                    return user;
                } catch (error) {
                    console.error('Credentials authorize error:', error);
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === "google") {
                    const dbUser = await fetchUserByEmailSSO(user.email);
                    if (!dbUser) {
                        // Allow sign-in but handle registration in redirect callback
                        return true;
                    }
                }
                return true;
            } catch (error) {
                console.error('SignIn callback error:', error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            try {
                if (user) {
                    if (account?.provider === "google") {
                        const dbUser = await fetchUserByEmailSSO(user.email);
                        if (dbUser) {
                            token.id = dbUser.id;
                            token.email = dbUser.email;
                            token.name = dbUser.name;
                            token.school = dbUser.school;
                            token.major = dbUser.major;
                            token.username = dbUser.username;
                            token.year = dbUser.year;
                            token.avatarUrl = dbUser.avatarUrl;
                        }
                    } else {
                        // Cast user to our extended User type
                        const customUser = user as any;
                        token.id = customUser.id;
                        token.email = customUser.email;
                        token.username = customUser.username;
                        token.name = customUser.name;
                        token.school = customUser.school;
                        token.major = customUser.major;
                        token.year = customUser.year;
                        token.avatarUrl = customUser.avatarUrl;
                    }
                }
                return token;
            } catch (error) {
                console.error('JWT callback error:', error);
                return token;
            }
        },
        async session({ session, token }) {
            try {
                if (session?.user && token) {
                    session.user.id = token.id;
                    session.user.email = token.email;
                    session.user.username = token.username;
                    session.user.name = token.name;
                    session.user.school = token.school;
                    session.user.major = token.major;
                    session.user.year = token.year;
                    session.user.avatarUrl = token.avatarUrl;
                }
                return session;
            } catch (error) {
                console.error('Session callback error:', error);
                return session;
            }
        },
        async redirect({ url, baseUrl }) {
            // Handle relative URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            
            // Handle same origin URLs
            if (new URL(url).origin === baseUrl) return url;
            
            // Default redirect to home page
            return baseUrl;
        },
    },
});

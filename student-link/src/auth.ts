import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { fetchUserByEmailSSO, validateUserCredentials } from "@/lib/userServerFuntions";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("🧠 [NextAuth] Authorize called with:", credentials);

                if (!credentials?.email || !credentials.password) {
                    console.error("🚨 Missing credentials in authorize()");
                    return null;
                }

                const user = await validateUserCredentials(credentials.email, credentials.password);
                console.log("✅ [NextAuth] validateUserCredentials returned:", user);

                return user;
            },
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                const dbUser = await fetchUserByEmailSSO(user.email);
                if (!dbUser) {
                    return `/finish-registration?email=${encodeURIComponent(user.email)}`;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.school = user.school;
                token.major = user.major;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.school = token.school;
                session.user.major = token.major;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
});

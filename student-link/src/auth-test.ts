// Minimal NextAuth test configuration
import NextAuth from "next-auth";

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET || "test-secret",
    providers: [],
    callbacks: {
        async jwt({ token }) {
            return token;
        },
        async session({ session }) {
            return session;
        },
    },
});

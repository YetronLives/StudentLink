import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {SessionProvider} from "next-auth/react";
export const metadata = {
    title: "Student Link",
    description: "Connect, collaborate, and learn with fellow students",
};
export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        {/* Wrap everything in SessionProvider */}
        <SessionProvider>
            {children}
        </SessionProvider>
        </body>
        </html>
    );
}

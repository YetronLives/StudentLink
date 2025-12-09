import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {SessionProvider} from "next-auth/react";
import {Navbar} from "@/components/navbar.jsx";
import Providers from "@/app/providers.jsx";
export const metadata = {
    title: "Student Link",
    description: "Connect, collaborate, and learn with fellow students",
};
export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        {/* Wrap everything in SessionProvider */}
        <Providers>
            <Navbar/>
            <main>
            {children}
            </main>
            </Providers>

        </body>
        </html>
    );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {SessionProvider} from "@/auth";
import Providers from "@/app/providers.jsx";
import Navbar from "@/components/navbar.jsx";
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
            <Navbar />
            {children}
            </Providers>

        </body>
        </html>
    );
}

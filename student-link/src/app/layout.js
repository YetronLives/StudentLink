import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
export const metadata = {
    title: "Student Link",
    description: "Connect, collaborate, and learn with fellow students",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

"use client"; // 👈 Required for usePathname

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavLinks({ styles }) {
    const pathname = usePathname();

    return (
        <>
            <Link
                href="/"
                className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}
            >
                Home
            </Link>

            {/* I updated these to real Links so they can be highlighted later */}
            <Link
                href="/projects"
                className={`${styles.navLink} ${pathname === "/projects" ? styles.active : ""}`}
            >
                Projects
            </Link>

            <Link
                href="/tutorials"
                className={`${styles.navLink} ${pathname === "/tutorials" ? styles.active : ""}`}
            >
                Tutorials
            </Link>

            {/*
            Commented out, can be added in future additions
            <Link
                href="/community"
                className={`${styles.navLink} ${pathname === "/community" ? styles.active : ""}`}
            >
                Community
            </Link>*/}
        </>
    );
}
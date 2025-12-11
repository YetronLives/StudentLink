"use client"; // 1. Mark as Client Component

import styles from "./nav.module.css";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import {usePathname, useRouter} from "next/navigation"; // 2. Use hook for URL
import { useSession } from "next-auth/react";  // 3. Use hook for Auth

export default function Navbar() {
    const path = usePathname();
    const { data: session } = useSession(); // 4. Client-side session check
    const router = useRouter(); // 👈 Initialize router
    const isProjectPage = path.startsWith("/project/");

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                {isProjectPage ? (
                    <div className={styles.specialNav}>
                        <button onClick={() => router.back()} className={styles.backButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m15 18-6-6 6-6"/>
                            </svg>
                            Back
                        </button>

                        <Link href="/" className={styles.homeLink}>
                            <div className={styles.logo}>
                                <div className={styles.logoIcon}>📚</div>
                                <span>StudentLink</span>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>📚</div>
                            <span className={styles.logoText}>StudentLink</span>
                        </div>

                        <nav className={styles.nav}>
                            <NavLinks styles={styles} />
                        </nav>

                        <div className={styles.userSection}>
                            <button className={styles.notificationBtn}>🔔</button>
                            <div className={styles.userProfile}>
                                {session ? (
                                    <Link href="/profile" className={styles.avatar}>👤</Link>
                                ) : (
                                    <Link href="/login" className={styles.signInBtn}>Sign In</Link>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
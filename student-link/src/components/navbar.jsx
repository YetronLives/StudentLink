"use client";

import { useState, useEffect } from 'react'; // <-- IMPORT useState and useEffect
import styles from "./nav.module.css";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import {usePathname, useRouter} from "next/navigation";
import { useSession } from "next-auth/react";

export default function Navbar() {
    const path = usePathname();
    const { data: session } = useSession();
    const router = useRouter();
    const isProjectPage = path.startsWith("/project/");

    // NEW: State to track if component has mounted on the client
    const [hasMounted, setHasMounted] = useState(false); // 1. Initialize state

    useEffect(() => {
        setHasMounted(true); // 2. Set to true only after the first client-side render
    }, []);

    // 3. Extracted the User Section into a component/function for clean access
    const UserAuthSection = () => {

        // --- FIX: Use a simple null check to prevent hydration issues if session is null initially ---
        // If we are still determining session, return a placeholder
        if (!hasMounted) {
            // We must render the EXACT same tags and structure as the final version.
            return (
                <div className={styles.userSection} style={{ minWidth: '100px' }}>

                    {/* 1. MATCH THE TAG: Use a <button> tag, just hide its content */}
                    <button className={styles.notificationBtn} style={{visibility: 'hidden'}}>
                        🔔
                    </button>

                    {/* 2. MATCH THE TAG: Use a <div> for userProfile with hidden content */}
                    <div className={styles.userProfile} style={{ visibility: 'hidden' }}>
                        {/* Placeholder for the Link/Avatar */}
                        <div className={styles.avatar} style={{ opacity: 0 }}>👤</div>
                    </div>
                </div>
            );
        }

        // Once mounted, render the real content based on the reliable session state
        return (
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
        );
    };

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

                        {/* 4. RENDER THE NEW SAFE COMPONENT/FUNCTION HERE */}
                        <UserAuthSection />
                    </>
                )}
            </div>
        </header>
    );
}
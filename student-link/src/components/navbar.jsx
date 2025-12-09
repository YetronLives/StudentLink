import styles from "./nav.module.css"
import Link from "next/link";
import { auth } from "@/auth.ts";
import NavLinks from "@/components/NavLinks"; // 👈 Import the new component

export async function Navbar() {
    const session = await auth();

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>📚</div>
                    <span className={styles.logoText}>StudentLink</span>
                </div>

                <nav className={styles.nav}>
                    {/* Pass the styles object to the client component
                      so it can access styles.navLink and styles.active
                    */}
                    <NavLinks styles={styles} />
                </nav>

                <div className={styles.userSection}>
                    <button className={styles.notificationBtn}>🔔</button>
                    <div className={styles.userProfile}>
                        {session ? (
                            <Link href="/profile" className={styles.avatar}>👤</Link>
                        ) : (
                            <Link
                                href="/login"
                                // Fixed the border radius syntax for you here too
                                style={{
                                    background: "#059669",
                                    color: "white",
                                    padding: "12px",
                                    border: "2px solid transparent",
                                    borderRadius: "12px"
                                }}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
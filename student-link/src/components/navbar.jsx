'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './navbar.module.css';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const user = session?.user;

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest(`.${styles.userMenuContainer}`)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    // Handle session changes
    useEffect(() => {
        if (status === 'unauthenticated') {
            setShowUserMenu(false);
        }
    }, [status, session]);

    // Get user initials
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Check active path
    const isActive = (path) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <Link href="/" className={styles.logoLink}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon}>📚</div>
                        <span className={styles.logoText}>StudentLink</span>
                    </div>
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>Home</Link>
                    <Link href="/projects" className={`${styles.navLink} ${isActive('/projects') ? styles.active : ''}`}>Projects</Link>
                    <Link href="/tutorials" className={`${styles.navLink} ${isActive('/tutorials') ? styles.active : ''}`}>Tutorials</Link>
                </nav>

                <div className={styles.userSection}>
                    <button className={styles.notificationBtn}>🔔</button>

                    <div className={styles.userProfile}>
                        {status === 'loading' ? (
                            <div className={styles.avatar}>⏳</div>
                        ) : session ? (
                            <div className={styles.userMenuContainer}>
                                <button
                                    className={styles.avatar}
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    title={`${user?.name || 'User'}'s menu`}
                                >
                                    {getInitials(user?.name)}
                                </button>

                                {showUserMenu && (
                                    <div className={styles.userDropdown}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.userName}>{user?.name || 'User'}</div>
                                            <div className={styles.userEmail}>{user?.email}</div>
                                        </div>

                                        <div className={styles.dropdownDivider}></div>

                                        <Link href="/profile" className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                                            <span className={styles.dropdownIcon}>👤</span> View Profile
                                        </Link>

                                        <Link href="/settings" className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                                            <span className={styles.dropdownIcon}>⚙️</span> Settings
                                        </Link>

                                        <div className={styles.dropdownDivider}></div>

                                        <button
                                            className={styles.dropdownItem}
                                            onClick={async () => {
                                                setShowUserMenu(false);
                                                await signOut({ redirect: false });
                                                router.push('/');
                                            }}
                                        >
                                            <span className={styles.dropdownIcon}>🚪</span> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.authButtons}>
                                <Link href="/login" className={styles.loginBtn}>Sign In</Link>
                                <Link href="/signup" className={styles.signupBtn}>Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {session && (
                        <div className={styles.welcomeMessage}>
                            <span>Welcome, {user?.name?.split(' ')[0] || user?.username || 'Student'}!</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

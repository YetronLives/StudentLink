'use client';

import { useRouter } from 'next/navigation';
import styles from './navigation.module.css';

export default function Navigation() {
    const router = useRouter();

    return (
        <nav className={styles.navigation}>
            <div className={styles.navContent}>
                <div
                    className={styles.logo}
                    onClick={() => router.push('/homepage')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className={styles.logoIcon}>📚</div>
                    <span className={styles.logoText}>StudentLink</span>
                </div>

                <div className={styles.navLinks}>
                    <a href="/homepage" className={styles.navLink}>Home</a>
                    <a href="#" className={styles.navLink}>Projects</a>
                    <a href="#" className={styles.navLink}>Tutorials</a>
                    <a href="#" className={styles.navLink}>Community</a>
                </div>

                <div className={styles.userSection}>
                    <button className={styles.notificationBtn}>🔔</button>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>👤</div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
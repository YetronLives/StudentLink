import {auth, signOut} from "@/auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import styles from './profile.module.css';

export default async function Profile() {
    const session = await auth()
    if(!session) redirect("/")
    const user = session?.user //User will have these fields to display:  {email, id, username, name, school, major, year}

    // Get user's initials for avatar
    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const userStats = [
        { label: "Projects Completed", value: "0", icon: "🎯" },
        { label: "Current Streak", value: "0 days", icon: "🔥" },
        { label: "Total Hours", value: "0h", icon: "⏱️" },
        { label: "Skill Level", value: "Beginner", icon: "⭐" }
    ];

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.homeLink}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>📚</div>
                            <span>StudentLink</span>
                        </div>
                    </Link>
                    <nav className={styles.nav}>
                        <Link href="/" className={styles.navLink}>Home</Link>
                        <Link href="/profile" className={`${styles.navLink} ${styles.active}`}>Profile</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Profile Header */}
                <section className={styles.profileHeader}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                {getInitials(user?.name)}
                            </div>
                            <button className={styles.editAvatarBtn}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                        </div>
                        <div className={styles.userDetails}>
                            <h1 className={styles.userName}>{user?.name || "Student"}</h1>
                            <p className={styles.userTitle}>@{user?.username || "username"}</p>
                            <div className={styles.userMeta}>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>🎓</span>
                                    {user?.school || "School not specified"}
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📚</span>
                                    {user?.major || "Major not specified"}
                                </span>
                                {user?.year && (
                                    <span className={styles.metaItem}>
                                        <span className={styles.metaIcon}>📅</span>
                                        {user.year}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className={styles.statsSection}>
                    <h2 className={styles.sectionTitle}>Your Progress</h2>
                    <div className={styles.statsGrid}>
                        {userStats.map((stat, index) => (
                            <div key={index} className={styles.statCard}>
                                <div className={styles.statIcon}>{stat.icon}</div>
                                <div className={styles.statContent}>
                                    <div className={styles.statValue}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Content Grid */}
                <div className={styles.contentGrid}>
                    {/* Personal Information */}
                    <section className={styles.infoSection}>
                        <div className={styles.sectionCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>
                                    <span className={styles.cardIcon}>👤</span>
                                    Personal Information
                                </h3>
                                <button className={styles.editBtn}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    Edit
                                </button>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Full Name</label>
                                        <span className={styles.infoValue}>{user?.name || "Not provided"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Username</label>
                                        <span className={styles.infoValue}>@{user?.username || "Not set"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Email</label>
                                        <span className={styles.infoValue}>{user?.email || "Not provided"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>School</label>
                                        <span className={styles.infoValue}>{user?.school || "Not specified"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Major</label>
                                        <span className={styles.infoValue}>{user?.major || "Not specified"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Academic Year</label>
                                        <span className={styles.infoValue}>{user?.year || "Not specified"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Recent Activity */}
                    <section className={styles.activitySection}>
                        <div className={styles.sectionCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>
                                    <span className={styles.cardIcon}>📈</span>
                                    Recent Activity
                                </h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.activityList}>
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyIcon}>📝</div>
                                        <h4>No activity yet</h4>
                                        <p>Start working on projects to see your activity here!</p>
                                        <Link href="/" className={styles.startBtn}>
                                            Browse Projects
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Settings */}
                        <div className={styles.sectionCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.cardTitle}>
                                    <span className={styles.cardIcon}>⚙️</span>
                                    Account Settings
                                </h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.settingsList}>
                                    <button className={styles.settingItem}>
                                        <span className={styles.settingIcon}>🔔</span>
                                        <span className={styles.settingText}>Notification Preferences</span>
                                        <span className={styles.settingArrow}>→</span>
                                    </button>
                                    <button className={styles.settingItem}>
                                        <span className={styles.settingIcon}>🔒</span>
                                        <span className={styles.settingText}>Privacy Settings</span>
                                        <span className={styles.settingArrow}>→</span>
                                    </button>
                                    <button className={styles.settingItem}>
                                        <span className={styles.settingIcon}>🎨</span>
                                        <span className={styles.settingText}>Theme Preferences</span>
                                        <span className={styles.settingArrow}>→</span>
                                    </button>
                                </div>
                                
                                <div className={styles.dangerZone}>
                                    <form
                                        action={async (formData) => {
                                            "use server"
                                            await signOut()
                                        }}
                                    >
                                        <button type="submit" className={styles.signOutBtn}>
                                            <span className={styles.btnIcon}>🚪</span>
                                            Sign Out
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

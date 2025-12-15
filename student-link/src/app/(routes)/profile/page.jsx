'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut } from "@/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from './profile.module.css';
import {useSession} from "next-auth/react";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const fileInputRef = useRef(null);
    
    // Upload states
    const [isUploading, setIsUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [userDbData, setUserDbData] = useState(null);

    const user = session?.user;

    // Fetch fresh user data from database when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`/api/users/${user.id}`);
                    if (response.ok) {
                        const dbUserData = await response.json();
                        setUserDbData(dbUserData);
                        
                        // Set avatar URL from database data
                        if (dbUserData.avatarUrl) {
                            setAvatarUrl(dbUserData.avatarUrl);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [user?.id]);

    // Also initialize from session data as fallback
    useEffect(() => {
        if (user?.avatarUrl && !avatarUrl) {
            setAvatarUrl(user.avatarUrl);
        }
    }, [user, avatarUrl]);

    // Redirect if not authenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    // Show loading while checking authentication
    if (status === "loading") {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!session) {
        return null;
    }

    // Get user's initials for avatar
    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Get the most up-to-date user data (prefer database data over session data)
    const getCurrentUserData = () => {
        return userDbData || user;
    };

    // Get proxied image URL to avoid CORS issues
    const getProxiedImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        
        // If it's an S3 URL, proxy it through our API
        if (imageUrl.includes('student-link-files.s3.amazonaws.com')) {
            return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
        }
        
        // For other URLs, return as-is
        return imageUrl;
    };

    // Handle file upload for avatar
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        
        if (!file) return;
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please select a valid image file (JPEG, PNG, or GIF)');
            return;
        }
        
        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setUploadError('File size must be less than 5MB');
            return;
        }
        
        setIsUploading(true);
        setUploadError(null);
        
        try {
            // Convert file to base64
            const reader = new FileReader();
            
            reader.onload = async () => {
                try {
                    const base64String = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
                    
                    const payload = {
                        fileName: file.name,
                        fileContent: base64String,
                        contentType: file.type,
                        isBase64: true
                    };
                    
                    console.log('Uploading file:', file.name);
                    
                    // Upload to Lambda
                    const response = await fetch('https://42f27zkucie5p2e74m3rvpzhvm0axxqw.lambda-url.us-east-1.on.aws/', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        mode: 'cors',
                        body: JSON.stringify(payload)
                    });
                    
                    
                    if (!response.ok) {
                        // Try to get error details
                        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                        try {
                            const errorData = await response.text();
                            errorMessage += ` - ${errorData}`;
                        } catch (e) {
                            // Could not read error response
                        }
                        throw new Error(errorMessage);
                    }
                    
                    const result = await response.json();
                    
                    if (result.fileUrl) {
                        setAvatarUrl(result.fileUrl);
                        setUploadError(null);
                        
                        // Save avatar URL to user profile in database
                        await updateUserAvatar(result.fileUrl);
                    } else {
                        throw new Error('No file URL returned from server');
                    }
                    
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    setUploadError(`Upload failed: ${uploadError.message}`);
                } finally {
                    setIsUploading(false);
                }
            };
            
            reader.onerror = (error) => {
                console.error('FileReader error:', error);
                setUploadError('Failed to read file');
                setIsUploading(false);
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('Error in handleFileUpload:', error);
            setUploadError(`Failed to process file: ${error.message}`);
            setIsUploading(false);
        }
    };

    // Trigger file input click
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // Update user avatar in database
    const updateUserAvatar = async (avatarUrl) => {
        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    avatarUrl: avatarUrl
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update avatar');
            }
            
            // Trigger session refresh to update the avatar in the session
            await refreshSession();
            
        } catch (error) {
            console.error('Error updating avatar in database:', error);
            setUploadError(`Avatar uploaded but failed to save to profile: ${error.message}`);
        }
    };

    // Refresh session data
    const refreshSession = async () => {
        try {
            // Force session refresh by calling the session endpoint
            await fetch('/api/auth/session', { method: 'GET' });
            // Reload the page to get updated session data
            window.location.reload();
        } catch (error) {
            console.error('Error refreshing session:', error);
        }
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
            {/* <header className={styles.header}>
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
            </header> */}

            {/* Main Content */}
            <main className={styles.main}>
                {/* Profile Header */}
                <section className={styles.profileHeader}>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatarSection}>
                            <div 
                                className={`${styles.avatar} ${isUploading ? styles.uploading : ''} ${avatarUrl ? styles.hasImage : ''}`}
                                onClick={handleAvatarClick}
                                style={{
                                    cursor: 'pointer'
                                }}
                            >
                                {isUploading ? (
                                    <div className={styles.uploadingSpinner}>⏳</div>
                                ) : avatarUrl ? (
                                    <img 
                                        src={getProxiedImageUrl(avatarUrl)} 
                                        alt="Profile Avatar"
                                        className={styles.avatarImage}
                                        onError={(e) => {
                                            console.error('Avatar image failed to load');
                                            e.target.style.display = 'none';
                                            e.target.parentElement.classList.remove(styles.hasImage);
                                        }}
                                    />
                                ) : (
                                    getInitials(getCurrentUserData()?.name)
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <button
                                className={styles.editAvatarBtn}
                                onClick={handleAvatarClick}
                                disabled={isUploading}
                                title="Change avatar"
                            >
                                {isUploading ? (
                                    <div className={styles.miniSpinner}></div>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {uploadError && (
                            <div className={styles.uploadError}>
                                <span className={styles.errorIcon}>⚠️</span>
                                {uploadError}
                                <button 
                                    className={styles.dismissError}
                                    onClick={() => setUploadError(null)}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        
                        
                        <div className={styles.userDetails}>
                            <h1 className={styles.userName}>{getCurrentUserData()?.name || "Student"}</h1>
                            <p className={styles.userTitle}>@{getCurrentUserData()?.username || "username"}</p>
                            <div className={styles.userMeta}>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>🎓</span>
                                    {getCurrentUserData()?.school || "School not specified"}
                                </span>
                                <span className={styles.metaItem}>
                                    <span className={styles.metaIcon}>📚</span>
                                    {getCurrentUserData()?.major || "Major not specified"}
                                </span>
                                {getCurrentUserData()?.year && (
                                    <span className={styles.metaItem}>
                                        <span className={styles.metaIcon}>📅</span>
                                        {getCurrentUserData().year}
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
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Edit
                                </button>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Full Name</label>
                                        <span className={styles.infoValue}>{getCurrentUserData()?.name || "Not provided"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Username</label>
                                        <span className={styles.infoValue}>@{getCurrentUserData()?.username || "Not set"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Email</label>
                                        <span className={styles.infoValue}>{getCurrentUserData()?.email || "Not provided"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>School</label>
                                        <span className={styles.infoValue}>{getCurrentUserData()?.school || "Not specified"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Major</label>
                                        <span className={styles.infoValue}>{getCurrentUserData()?.major || "Not specified"}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <label className={styles.infoLabel}>Academic Year</label>
                                        <span className={styles.infoValue}>{getCurrentUserData()?.year || "Not specified"}</span>
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
                                    <button 
                                        onClick={async () => {
                                            await signOut({ redirect: false });
                                            router.push('/');
                                        }}
                                        className={styles.signOutBtn}
                                    >
                                        <span className={styles.btnIcon}>🚪</span>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

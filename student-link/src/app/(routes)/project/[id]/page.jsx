'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './project.module.css';

export default function ProjectDetail() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                // Fetch specific project by ID from Lambda API
                const response = await fetch(`https://pztzwg4px33xusqhiabkgsbtge0eixpa.lambda-url.us-east-1.on.aws?id=${params.id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }
                
                const projectData = await response.json();
                
                // The API returns the project directly, not in a projects array
                setProject(projectData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching project:', err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProject();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <h2>Error Loading Project</h2>
                    <p>{error}</p>
                    <div className={styles.errorActions}>
                        <button onClick={() => router.back()} className={styles.backBtn}>
                            Go Back
                        </button>
                        <button onClick={() => window.location.reload()} className={styles.retryBtn}>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <h2>Project Not Found</h2>
                    <p>The project you're looking for doesn't exist.</p>
                    <Link href="/" className={styles.backBtn}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Frontend': return '💻';
            case 'Backend': return '⚙️';
            case 'Mobile': return '📱';
            case 'Fullstack': return '🔧';
            default: return '📋';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Frontend': return '#60a5fa';
            case 'Backend': return '#f59e0b';
            case 'Mobile': return '#34d399';
            case 'Fullstack': return '#8b5cf6';
            default: return '#94a3b8';
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
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
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.projectHeader}>
                    <div className={styles.projectMeta}>
                        <div className={styles.categoryBadge} style={{ backgroundColor: getCategoryColor(project.category) + '20', color: getCategoryColor(project.category) }}>
                            <span className={styles.categoryIcon}>{getCategoryIcon(project.category)}</span>
                            {project.category}
                        </div>
                        <div className={styles.projectId}>Project #{project.project_id}</div>
                    </div>
                    
                    <h1 className={styles.projectTitle}>{project.title}</h1>
                    <p className={styles.projectDescription}>{project.description}</p>
                </div>

                <div className={styles.projectContent}>
                    <div className={styles.contentGrid}>
                        {/* Project Details */}
                        <div className={styles.detailsSection}>
                            <div className={styles.sectionCard}>
                                <h2 className={styles.sectionTitle}>
                                    <span className={styles.sectionIcon}>📋</span>
                                    Project Overview
                                </h2>
                                <div className={styles.sectionContent}>
                                    <p>{project.description}</p>
                                    <div className={styles.projectStats}>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>Category</span>
                                            <span className={styles.statValue}>{project.category}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>Difficulty</span>
                                            <span className={styles.statValue}>Intermediate</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <span className={styles.statLabel}>Duration</span>
                                            <span className={styles.statValue}>2-4 weeks</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.sectionCard}>
                                <h2 className={styles.sectionTitle}>
                                    <span className={styles.sectionIcon}>🛠️</span>
                                    Prerequisites
                                </h2>
                                <div className={styles.sectionContent}>
                                    <div className={styles.prerequisitesList}>
                                        {project.prerequisites.map((prereq, index) => (
                                            <div key={index} className={styles.prerequisiteItem}>
                                                <span className={styles.prerequisiteIcon}>✓</span>
                                                {prereq}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.sectionCard}>
                                <h2 className={styles.sectionTitle}>
                                    <span className={styles.sectionIcon}>🎯</span>
                                    What You'll Learn
                                </h2>
                                <div className={styles.sectionContent}>
                                    <ul className={styles.learningList}>
                                        <li>Build a complete {project.category.toLowerCase()} application</li>
                                        <li>Implement best practices and modern development patterns</li>
                                        <li>Work with real-world project requirements</li>
                                        <li>Deploy and maintain your application</li>
                                        <li>Understand project architecture and design decisions</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Action Panel */}
                        <div className={styles.actionPanel}>
                            <div className={styles.actionCard}>
                                <h3 className={styles.actionTitle}>Ready to Start?</h3>
                                <p className={styles.actionDescription}>
                                    Begin this project and start building your skills with hands-on experience.
                                </p>
                                
                                <div className={styles.actionButtons}>
                                    <a 
                                        href={project.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={styles.primaryBtn}
                                    >
                                        <span className={styles.btnIcon}>🚀</span>
                                        Start Project
                                    </a>
                                    
                                    <button className={styles.secondaryBtn}>
                                        <span className={styles.btnIcon}>🔖</span>
                                        Bookmark
                                    </button>
                                    
                                    <button className={styles.secondaryBtn}>
                                        <span className={styles.btnIcon}>📤</span>
                                        Share
                                    </button>
                                </div>

                                <div className={styles.projectLinks}>
                                    <h4>Quick Links</h4>
                                    <div className={styles.linksList}>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                                            <span className={styles.linkIcon}>🔗</span>
                                            Project Tutorial
                                        </a>
                                        <Link href="/" className={styles.projectLink}>
                                            <span className={styles.linkIcon}>🏠</span>
                                            Back to Projects
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

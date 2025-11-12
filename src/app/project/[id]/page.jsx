'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/navigation';
import styles from './project.module.css';

export default function ProjectDetail({ params }) {
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [projectId, setProjectId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        Promise.resolve(params).then((resolvedParams) => {
            setProjectId(resolvedParams.id);
        });
    }, [params]);

    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;

            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                if (!apiUrl) {
                    console.warn('API URL not configured');
                    router.push(`/project/${projectId}`);
                    return;
                }

                const response = await fetch(`${apiUrl}/?id=${projectId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }

                const data = await response.json();
                setProject(data);
            } catch (err) {
                console.error('Error fetching project:', err);
                setError(err.message);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchProject();
    }, [projectId, router]);

    // Show loading state while fetching
    if (loading) {
        return (
            <div className={styles.container}>
                <Navigation />
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Loading project...</p>
                </div>
            </div>
        );
    }

    // Show error state only after loading is complete
    if (error || !project) {
        return (
            <div className={styles.container}>
                <Navigation />
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2 className={styles.errorTitle}>Project Not Found</h2>
                    <p className={styles.errorText}>
                        {error || "We couldn't find the project you're looking for."}
                    </p>
                    <button
                        onClick={() => router.push('/homepage')}
                        className={styles.backHomeButton}
                    >
                        ← Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Navigation />

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.projectHeader}>
                    <h1 className={styles.projectTitle}>{project.title}</h1>
                </div>

                <div className={styles.projectContent}>
                    {/* Description Section */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>About This Project</h2>
                        <p className={styles.description}>{project.description}</p>
                    </section>

                    {/* Prerequisites Section */}
                    {project.prerequisites && project.prerequisites.length > 0 && (
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Prerequisites</h2>
                            <div className={styles.prerequisitesList}>
                                {project.prerequisites.map((prereq, index) => (
                                    <div key={index} className={styles.prerequisiteItem}>
                                        <span className={styles.checkIcon}>✓</span>
                                        <span>{prereq}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Additional Info */}
                    <section className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <div className={styles.categoryIcon}>🍔</div>
                            <div>
                                <h3 className={styles.infoTitle}>Category</h3>
                                <p className={styles.infoText}>{project.category}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
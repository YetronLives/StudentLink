'use client';

import { useState, useEffect } from 'react';
import styles from './homepage.module.css';
import Link from "next/link";
import {useSession} from "next-auth/react";

export default function Homepage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categories = ['All', 'Frontend', 'Backend', 'Fullstack', 'Mobile'];

    // Fetch projects from Lambda API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://gzqpzdayrxgnhtxex3s4o7hfje0fkwup.lambda-url.us-east-1.on.aws/');

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();

                // Transform API data to match component structure
                const transformedProjects = data.projects.map(project => ({
                    id: project.project_id,
                    videolink: project.link,
                    title: project.title,
                    description: project.description,
                    prerequisite: project.prerequisites.join(', '),
                    category: project.category,
                    image: '/api/placeholder/300/200',
                    bookmark: false,
                }));

                setProjects(transformedProjects);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const ProjectCard = ({ project }) => (
        <Link href={`/project/${project.id}`} className={styles.projectCardLink}>
            <div className={styles.projectCard}>
                <div className={styles.projectImage}>
                    <div className={styles.imagePlaceholder}>
                        {/* Placeholder for project thumbnail */}
                        <div className={styles.iconPlaceholder}>
                            {project.category === 'Frontend' && <div className={styles.frontendIcon}>💻</div>}
                            {project.category === 'Mobile' && <div className={styles.mobileIcon}>📱</div>}
                            {project.category === 'Backend' && <div className={styles.backendIcon}>⚙️</div>}
                            {(project.category === 'Fullstack' || project.category === 'Full Stack') && <div className={styles.fullstackIcon}>🔧</div>}
                        </div>
                    </div>
                </div>
                <div className={styles.projectContent}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectDescription}>{project.description}</p>
                    <p className={styles.projectDescription}>Prerequisites: {project.prerequisite}</p>
                    <div className={styles.projectFooter}>
                        <span className={styles.projectCategory}>{project.category}</span>
                        <button
                            className={styles.bookmarkBtn}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Handle bookmark functionality here
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l5-3 5 3z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className={styles.container}>
            {/* Header */}


            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.hero}>
                    <h1 className={styles.heroTitle}>Explore Projects
                    </h1>
                    <p className={styles.heroDescription}>
                        Dive into a world of coding projects designed to enhance your skills and knowledge.
                        Choose from a variety of categories and find the perfect project to match your
                        interests and learning goals.
                    </p>
                </div>

                {/* Search Bar */}
                <div className={styles.searchSection}>
                    <div className={styles.searchContainer}>
                        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search projects by keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className={styles.categorySection}>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`${styles.categoryBtn} ${activeCategory === category ? styles.active : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Featured Projects */}
                <section className={styles.projectSection}>
                    <h2 className={styles.sectionTitle}>Featured Projects</h2>

                    {loading && (
                        <div className={styles.loadingState}>
                            <p>Loading projects...</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorState}>
                            <p>Error loading projects: {error}</p>
                            <button onClick={() => window.location.reload()}>Retry</button>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className={styles.projectGrid}>
                            {projects
                                .filter(project =>
                                    activeCategory === 'All' || project.category === activeCategory
                                )
                                .filter(project =>
                                    searchQuery === '' ||
                                    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    project.description.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))
                            }
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
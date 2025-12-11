'use client';

import { useState } from 'react';
// We import the SAME CSS module to reuse your existing styles
// Adjust the path '../homepage.module.css' if your folder structure differs
import styles from './tutorials.module.css';
import Link from "next/link";

export default function TutorialsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', 'Basics', 'Frontend', 'Backend', 'DevOps', 'Security', 'Data Structures & Algorithms'];

    const tutorials = [

        {
            id: 1,
            title: 'Understanding React Hooks',
            description: 'A deep dive into useState, useEffect, and custom hooks.',
            duration: '15 min read',
            level: 'Beginner',
            category: 'Frontend',
            image: '/ReactHooks.webp',
        },
        {
            id: 2,
            title: 'Docker for Beginners',
            description: 'Containerize your first application using Docker and Docker Compose.',
            duration: '20 min video',
            level: 'Intermediate',
            category: 'DevOps',
            image: '/Docker.svg',
        },
        {
            id: 3,
            title: 'O-Notation Explained',
            description: 'Master time and space complexity analysis for coding interviews.',
            duration: '10 min read',
            level: 'Basics',
            category: 'Data Structures & Algorithms',
            image: '/BigONote.jpg',
        },
        {
            id: 4,
            title: 'JWT Authentication Flow',
            description: 'Secure your Node.js API using JSON Web Tokens.',
            duration: '1 hr and 40 min video',
            level: 'Advanced',
            category: 'Security',
            image: '/JWTFreeCC.jpg',
            //https://www.youtube.com/watch?v=x5gLL8-M9Fo
        },
        {
            id: 5,
            title: 'CSS Grid vs Flexbox',
            description: 'When to use which? A comprehensive guide to modern layouts.',
            duration: '12 min read',
            level: 'Beginner',
            category: 'Frontend',
            image: '/FlexVGrid.png',
        },
        {
            id: 6,
            title: 'Binary Search Trees',
            description: 'Implementation and traversal algorithms in Java.',
            duration: '18 min read',
            level: 'Intermediate',
            category: 'Data Structures & Algorithms',
            image: '/BST.png',
        },
        {
            id: 7,
            title: 'JavaScript Basics',
            description: 'Learn JavaScript basics such as variables, data types, and functions.',
            duration: '30 days',
            level: 'Beginner',
            category: 'Basics',
            image: '/JavaScript-logo.png',
            //Link: https://www.freecodecamp.org/news/learn-javascript-for-beginners/
        }
    ];

    // Filter logic
    const filteredTutorials = tutorials.filter(tutorial => {
        const matchesCategory = activeCategory === 'All' || tutorial.category === activeCategory;
        const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const TutorialCard = ({ tutorial }) => (
        // We reuse 'styles.projectCard' to keep the exact same look as the homepage
        <div className={styles.projectCard}>
            <div className={styles.projectImage}>
                {tutorial.image.includes('placeholder') ? (
                    // OPTION A: Show your existing placeholder logic
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.iconPlaceholder}>
                            {tutorial.duration.includes('video') ? '▶️' : '📄'}
                        </div>
                    </div>
                ) : (
                    // OPTION B: Show the real image
                    // We use standard <img> for simplicity with your current CSS,
                    // but <Image /> is better for performance if you configure width/height.
                    <img
                        src={tutorial.image}
                        alt={tutorial.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'scale-down',
                            padding: "10px"
                        }}
                    />
                )}
            </div>
            <div className={styles.projectContent}>
                <h3 className={styles.projectTitle}>{tutorial.title}</h3>
                <p className={styles.projectDescription}>{tutorial.description}</p>

                {/* Changed 'Prerequisites' to 'Level' and 'Duration' for tutorials */}
                <div style={{marginTop: 'auto', marginBottom: '12px', fontSize: '0.9rem', color: '#666'}}>
                    <span style={{marginRight: '12px'}}>⏱️ {tutorial.duration}</span>
                    <span>📊 {tutorial.level}</span>
                </div>

                <div className={styles.projectFooter}>
                    <span className={styles.projectCategory}>{tutorial.category}</span>
                    <button className={styles.bookmarkBtn}>
                        {/* Bookmark Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l5-3 5 3z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.hero}>
                    <h1 className={styles.heroTitle}>Learning Hub</h1>
                    <p className={styles.heroDescription}>
                        Master new technologies with our curated guides, videos, and articles.
                        From basics to advanced system design.
                    </p>
                </div>

                {/* Search Bar - Reusing exact same classes */}
                <div className={styles.searchSection}>
                    <div className={styles.searchContainer}>
                        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search tutorials..."
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

                {/* Grid Section */}
                <section className={styles.projectSection}>
                    <h2 className={styles.sectionTitle}>Latest Tutorials</h2>
                    <div className={styles.projectGrid}>
                        {filteredTutorials.map((tutorial) => (
                            <TutorialCard key={tutorial.id} tutorial={tutorial} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
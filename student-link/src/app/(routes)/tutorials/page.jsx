'use client';

import {useEffect, useMemo, useState} from 'react';
// We import the SAME CSS module to reuse your existing styles
// Adjust the path '../homepage.module.css' if your folder structure differs
import styles from './tutorials.module.css';
import Link from "next/link";

export default function TutorialsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [tutorials, setTutorials] = useState([]);
    const categories = ['All', 'Programming Languages', 'Frontend', 'Backend', 'DevOps', 'Security', 'Data Structures & Algorithms'];

    // Local images array (used as a lookup table)
    const images = [
        {id: 1, image: '/ReactHooks.webp',},
        {id: 3, image: '/Docker.svg'},
        {id: 4,image: '/JWTFreeCC.jpg'},
        {id: 2,image: '/MySQL.webp'},

        {id: 7,image: '/JavaScript-logo.png'}
    ];

    // Data Fetching: (This section was already correct)
    useEffect( () => {
        const fetchTutorials = async () =>
        {
            try{
                const res = await fetch("https://4755q75aiv63ber6ynezvxi22a0eczxl.lambda-url.us-east-1.on.aws/")
                if (!res.ok) {
                    throw new Error("Error fetching tutorials")
                }
                const data = await res.json();
                // console.log(JSON.stringify(data)) // Keep this line for future debugging if needed
                setTutorials(data.tutorials || []);
            }
            catch (error){
                console.error("Error fetching tutorials: ", error)
            }
        };
        fetchTutorials();
    }, []);

    // 1. Data Combination Logic (Fixed the 'undefined' error)
    const combinedTutorials = useMemo(() => {
        const imagesLookup = images.reduce((acc, detail) => {
            acc[detail.id] = detail; // Key is the image 'id'
            return acc;
        }, {});

        return tutorials.map(tutorial => {
            const matchingImage = imagesLookup[tutorial.tutorial_id];

            // Set a safe default image path if no match is found
            const imagePath = matchingImage
                ? matchingImage.image
                : '/placeholder-default.svg'; // <--- FIX FOR 'undefined.includes()'

            return {
                ...tutorial,
                image: imagePath // Guaranteed to be a string
            };
        });
    }, [tutorials, images]);

    // 2. Filter Logic (Must run on the combined array)
    const filteredTutorials = useMemo(() => {
        return combinedTutorials.filter(tutorial => { // <--- Filtering combinedTutorials
            // Safety check for title property
            const tutorialTitle = tutorial.title || '';

            const matchesCategory = activeCategory === 'All' || tutorial.category === activeCategory;
            const matchesSearch = tutorialTitle.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [combinedTutorials, activeCategory, searchQuery]);


    const TutorialCard = ({ tutorial }) => (
        // Wrap the entire card content in a standard <a> tag
        // Use target="_blank" to open the external link in a new tab,
        // which is standard for external resources.
        <a
            href={tutorial.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.projectCard}
            style={{ textDecoration: 'none', color: 'inherit' }} // Ensures the link styling doesn't interfere with the card look
        >
            <div className={styles.projectImage}>
                {/* The image rendering logic remains the same */}
                {tutorial.image.includes('placeholder') ? (
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.iconPlaceholder}>
                            {tutorial.duration.includes('video') ? '▶️' : '📄'}
                        </div>
                    </div>
                ) : (
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

                <div style={{marginTop: 'auto', marginBottom: '12px', fontSize: '0.9rem', color: '#666'}}>
                    <span style={{marginRight: '12px'}}>⏱️ {tutorial.duration}</span>
                    <span>📊 {tutorial.category}</span>
                </div>

                <div className={styles.projectFooter}>
                    <span className={styles.projectCategory}>{tutorial.category}</span>
                    {/* We keep the bookmark button separate to ensure it's still clickable */}
                    <button
                        className={styles.bookmarkBtn}
                        onClick={(e) => {
                            e.preventDefault(); // Prevents the link from being followed when clicking the bookmark
                            // Add your bookmark logic here (e.g., set state, call API)
                            console.log('Bookmark clicked for:', tutorial.title);
                        }}
                    >
                        {/* Bookmark Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16l5-3 5 3z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </a>
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
                            <TutorialCard key={tutorial.tutorial_id} tutorial={tutorial} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
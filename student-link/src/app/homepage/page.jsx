'use client';

import { useState } from 'react';
import styles from './homepage.module.css';

export default function Homepage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'Cybersecurity', 'Database', 'AI/ML', 'API/Microservices',  'Mobile'];

  const featuredProjects = [
    {
      id: 1,
      videolink: '/project/1',
      title: 'Build a Responsive E-commerce Website',
      description: 'Learn to build a fully functional e-commerce website.',
      prerequisite: 'HTML, CSS, JavaScript',
      category: 'Frontend',
      image: '/api/placeholder/300/200',
      bookmark: false,
    },
    {
      id: 2,
      videolink: '/project/2',
      title: 'Create a Mobile App for Task Management',
      description: 'Design and develop a mobile application for managing tasks.',
      prerequisite: 'React Native, Expo, and Expo Router',
      category: 'Mobile',
      image: '/api/placeholder/300/200',
      bookmark: false,
    },
    {
      id: 3,
      videolink: '/project/3',
      title: 'Develop a Scalable API for a Social Network',
      description: 'Construct a robust and scalable API for a social network.',
      prerequisite: 'Node.js, Express, and MongoDB',
      category: 'Backend',
      image: '/api/placeholder/300/200',
      bookmark: false,
    },
    {
      id: 4,
      videolink: '/project/4',
      title: 'Interactive Portfolio Website',
      description: 'Create a stunning portfolio website to showcase your projects.',
      prerequisite: 'HTML, CSS, JavaScript',
      category: 'Frontend',
      image: '/api/placeholder/300/200',
      bookmark: false,
    },
    {
      id: 5,
      videolink: '/project/5',
      title: 'Dynamic Weather App',
      description: 'Develop a weather application that fetches real-time data.',
      prerequisite: 'HTML, CSS, JavaScript',
      category: 'Frontend',
      image: '/api/placeholder/300/200',
      bookmark: false,
    },
    {
      id: 6,
      videolink: '/project/6',
      title: 'Personal Blog Platform',
      description: 'Build a personal blog platform with user authentication.',
      prerequisite: 'HTML, CSS, JavaScript',
      category: 'Full Stack',
      image: '/api/placeholder/300/200',
      bookmark: false,
    }
  ];

  const ProjectCard = ({ project }) => (
    <div className={styles.projectCard}>
      <div className={styles.projectImage}>
        <div className={styles.imagePlaceholder}>
          {/* Placeholder for project thumbnail */}
          <div className={styles.iconPlaceholder}>
            {project.category === 'Frontend' && <div className={styles.frontendIcon}>💻</div>}
            {project.category === 'Mobile' && <div className={styles.mobileIcon}>📱</div>}
            {project.category === 'Backend' && <div className={styles.backendIcon}>⚙️</div>}
            {project.category === 'Full Stack' && <div className={styles.fullstackIcon}>🔧</div>}
          </div>
        </div>
      </div>
      <div className={styles.projectContent}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.projectDescription}>{project.description}</p>
        <p className={styles.projectDescription}>Prerequisites: {project.prerequisite}</p>
        <div className={styles.projectFooter}>
          <span className={styles.projectCategory}>{project.category}</span>
          <button className={styles.bookmarkBtn}>
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
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>📚</div>
            <span className={styles.logoText}>StudentLink</span>
          </div>
          <nav className={styles.nav}>
            <a href="#" className={`${styles.navLink} ${styles.active}`}>Home</a>
            <a href="#" className={styles.navLink}>Projects</a>
            <a href="#" className={styles.navLink}>Tutorials</a>
            <a href="#" className={styles.navLink}>Community</a>
          </nav>
          <div className={styles.userSection}>
            <button className={styles.notificationBtn}>🔔</button>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>👤</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Explore Projects</h1>
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
          <div className={styles.projectGrid}>
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

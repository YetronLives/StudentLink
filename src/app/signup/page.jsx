'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './signup.module.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    school: '',
    major: '',
    year: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Add timestamp for account creation
    const accountData = {
      ...formData,
      createdAt: new Date().toISOString()
    };

    // Handle signup logic here
    console.log('Signup attempt:', accountData);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <h1 className={styles.title}>Student Link</h1>
        <p className={styles.subtitle}>Create your account to get started.</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="school"
              placeholder="School/University"
              value={formData.school}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="major"
                placeholder="Major/Field of Study"
                value={formData.major}
                onChange={handleInputChange}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className={styles.select}
                required
              >
                <option value="">Graduation Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className={styles.signupButton}>
            Create Account
          </button>
        </form>
        
        <p className={styles.loginText}>
          Already have an account? <Link href="/login" className={styles.loginLink}>Login</Link>
        </p>
      </div>
    </div>
  );
}

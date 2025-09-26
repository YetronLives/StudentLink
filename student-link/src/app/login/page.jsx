'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password, rememberMe });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Student Link</h1>
        <p className={styles.subtitle}>Welcome back! Please login to your account.</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.options}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
              />
              Remember me
            </label>
            
            <a href="#" className={styles.forgotPassword}>
              Forgot your password?
            </a>
          </div>
          
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        
        <p className={styles.signupText}>
          Don't have an account? <Link href="/signup" className={styles.signupLink}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}


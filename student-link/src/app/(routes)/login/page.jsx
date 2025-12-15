'use client';

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for OAuth errors in URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "OAuthSignin":
          setError("Error starting Google sign-in. Please check OAuth configuration.");
          break;
        case "OAuthCallback":
          setError("Error during Google sign-in callback.");
          break;
        case "OAuthCreateAccount":
          setError("Could not create account with Google.");
          break;
        case "Callback":
          setError("Authentication callback error.");
          break;
        case "AccessDenied":
          setError("Access denied. You may not have permission.");
          break;
        default:
          setError(`Authentication error: ${errorParam}`);
      }
    }
  }, [searchParams]);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/profile" });
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Google sign-in failed");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Student Link</h1>
        <p className={styles.subtitle}>Welcome back! Please login to your account.</p>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleCredentialsLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              name="email" 
              placeholder="Email address" 
              className={styles.input} 
              required 
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className={styles.input} 
              required 
              disabled={isLoading}
            />
          </div>

          <div className={styles.options}>
            <a href="#" className={styles.forgotPassword}>
              Forgot your password?
            </a>
          </div>

          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button 
          onClick={handleGoogleLogin} 
          className={styles.loginButton}
          disabled={isLoading}
        >
          Sign in with Google
        </button>

        <p className={styles.signupText}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={styles.signupLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signup.module.css";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear + i);

  const handleCredentialsSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const body = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      username: formData.get("username"),
      school: formData.get("school"),
      major: formData.get("major"),
      year: formData.get("year"),
    };

    if (body.password !== body.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create account");
      }

      const result = await signIn("credentials", {
        email: body.email,
        password: body.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but login failed. Please try logging in.");
      } else {
        router.push("/profile");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/profile" });
    } catch (err) {
      console.error("Google sign-up failed:", err);
      setError("Google sign-up failed");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupCard}>
        <h1 className={styles.title}>Student Link</h1>
        <p className={styles.subtitle}>Create your account to get started.</p>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <button
          onClick={handleGoogleSignup}
          className={styles.signupButton}
          disabled={isLoading}
          style={{ marginBottom: 20 }}
        >
          Sign up with Google
        </button>

        <form onSubmit={handleCredentialsSignup} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

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

          <div className={styles.row}>
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
            <div className={styles.inputGroup}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="school"
              placeholder="School/University"
              className={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                name="major"
                placeholder="Major/Field of Study"
                className={styles.input}
                required
                disabled={isLoading}
              />
            </div>
            <div className={styles.inputGroup}>
              <select name="year" className={styles.select} required disabled={isLoading}>
                <option value="">Graduation Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className={styles.signupButton} disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.loginLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

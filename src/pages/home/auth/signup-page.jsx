"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/auth/auth-pages.css"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignup = (e) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup with:", email, password)
    router.push("/login")
  }

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <div className="logo-circle">
          <span className="logo-face">◉◡◉</span>
        </div>
        <h1 className="logo-text">Đăng kí</h1>
      </div>

      <form className="auth-form" onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="form-input"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-button">
          Sign Up
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  )
}


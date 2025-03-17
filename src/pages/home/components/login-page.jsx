"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/auth/auth-pages.css"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log("Login with:", email, password)
    router.push("/")
  }

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <div className="logo-circle">
          <span className="logo-face">◉◡◉</span>
        </div>
        <h1 className="logo-text">Đăng kí</h1>
      </div>

      <form className="auth-form" onSubmit={handleLogin}>
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

        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button type="submit" className="auth-button">
          Log In
        </button>
      </form>

      <div className="auth-footer">
        <p className="auth-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  )
}


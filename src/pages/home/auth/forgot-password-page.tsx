"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "../../styles/auth/auth-pages.css"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmitEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send a verification code to the email
    console.log("Send verification code to:", email)
    setStep(2)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would verify the code
    console.log("Verify code:", verificationCode)
    setStep(3)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would reset the password
    console.log("Reset password to:", newPassword)
    router.push("/login")
  }

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <div className="logo-circle">
          <span className="logo-face">◉◡◉</span>
        </div>
        <h1 className="logo-text">Quên mật khẩu</h1>
      </div>

      {step === 1 && (
        <form className="auth-form" onSubmit={handleSubmitEmail}>
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

          <button type="submit" className="auth-button">
            Send Verification Code
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="auth-form" onSubmit={handleVerifyCode}>
          <div className="form-group">
            <label htmlFor="verificationCode" className="form-label">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              className="form-input"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Verify Code
          </button>
        </form>
      )}

      {step === 3 && (
        <form className="auth-form" onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button">
            Reset Password
          </button>
        </form>
      )}

      <div className="auth-footer">
        <p className="auth-link">
          Remember your password? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  )
}


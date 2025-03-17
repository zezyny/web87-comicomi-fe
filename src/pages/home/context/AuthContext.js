"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { mockUsers } from "@/data/mockData"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userId = localStorage.getItem("user_id")
        if (userId) {
          // Find user in mock data
          const foundUser = mockUsers.find((u) => u.id.toString() === userId)
          if (foundUser) {
            setUser(foundUser)
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err)
        localStorage.removeItem("user_id")
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      setError(null)
      // Simulate API call with mock data
      const foundUser = mockUsers.find((u) => u.email === credentials.email && credentials.password === "password")

      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      localStorage.setItem("user_id", foundUser.id)
      setUser(foundUser)
      return foundUser
    } catch (err) {
      setError(err.message || "Login failed")
      throw err
    }
  }

  // Signup function
  const signup = async (userData) => {
    try {
      setError(null)
      // Simulate API call with mock data
      const newUser = {
        id: mockUsers.length + 1,
        name: userData.name || "New User",
        email: userData.email,
        avatarUrl: null,
      }

      localStorage.setItem("user_id", newUser.id)
      setUser(newUser)
      return newUser
    } catch (err) {
      setError(err.message || "Signup failed")
      throw err
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("user_id")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


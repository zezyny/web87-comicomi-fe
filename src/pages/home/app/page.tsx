"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to intro page when the app loads
    router.push("/intro")
  }, [router])

  return null
}


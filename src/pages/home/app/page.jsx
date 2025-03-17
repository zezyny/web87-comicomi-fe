"use client"

import { useState } from "react"
import ReadingApp from "@/components/reading-app"
import CommunityPage from "@/components/community-page"
import LibraryPage from "@/components/library-page"
import NotificationPage from "@/components/notification-page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <ReadingApp onNavigate={setCurrentPage} />
      case "community":
        return <CommunityPage />
      case "library":
        return <LibraryPage />
      case "notifications":
        return <NotificationPage />
      default:
        return <ReadingApp onNavigate={setCurrentPage} />
    }
  }

  return renderPage()
}


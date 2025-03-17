"use client"
import { useRouter, useSearchParams } from "next/navigation"
import ReadingApp from "@/components/reading-app"
import CommunityPage from "@/components/community-page"
import LibraryPage from "@/components/library-page"
import NotificationPage from "@/components/notification-page"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = searchParams.get("page") || "home"

  const handleNavigate = (pageName) => {
    router.push(`/?page=${pageName}`)
  }

  const renderPage = () => {
    switch (page) {
      case "home":
        return <ReadingApp onNavigate={handleNavigate} />
      case "community":
        return <CommunityPage onNavigate={handleNavigate} />
      case "library":
        return <LibraryPage onNavigate={handleNavigate} />
      case "notifications":
        return <NotificationPage onNavigate={handleNavigate} />
      default:
        return <ReadingApp onNavigate={handleNavigate} />
    }
  }

  return renderPage()
}


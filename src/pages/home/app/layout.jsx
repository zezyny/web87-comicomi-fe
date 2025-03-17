import "./globals.css"
import "../styles/logo.css"
import "../styles/avatar.css"
import "../styles/loading.css"
import { AuthProvider } from "@/context/AuthContext"

export const metadata = {
  title: "ComiComi",
  description: "A reading app UI",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'
"use client"

import { useState, useEffect } from "react"

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check if the cookie exists in the browser
        const cookies = document.cookie.split(";").map((c) => c.trim())
        const adminCookie = cookies.find((cookie) => cookie.startsWith("admin_authenticated="))

        if (adminCookie && adminCookie.split("=")[1] === "true") {
          setIsAuthenticated(true)
          setIsLoading(false)
          return
        }

        // If no cookie found, check with the API
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include", // Important for cookies
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to check authentication")
        }

        const data = await response.json()

        if (data.authenticated) {
          setIsAuthenticated(true)
          // Set cookie if it doesn't exist but API says we're authenticated
          document.cookie = "admin_authenticated=true; path=/; max-age=3600; SameSite=Strict"
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, isLoading }
}

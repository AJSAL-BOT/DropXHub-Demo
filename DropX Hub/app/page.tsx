"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/lib/store-context"
import { motion } from "framer-motion"

export default function Home() {
  const { apps, settings } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [publishedApps, setPublishedApps] = useState([])
  const [featuredApps, setFeaturedApps] = useState([])
  const [currentFeatured, setCurrentFeatured] = useState(0)

  // Initialize published apps
  useEffect(() => {
    try {
      const published = apps.filter((app) => app.status === "published")
      setPublishedApps(published)
    } catch (error) {
      console.error("Error filtering published apps:", error)
      setPublishedApps([])
    }
  }, [apps])

  // Initialize featured apps
  useEffect(() => {
    try {
      if (settings?.featuredApps && apps.length > 0) {
        const featured = settings.featuredApps
          .map((id) => apps.find((app) => app.id === id))
          .filter((app) => app !== undefined && app.status === "published")
        setFeaturedApps(featured)
      }
    } catch (error) {
      console.error("Error setting featured apps:", error)
    }
  }, [apps, settings])

  // Auto-rotate featured apps
  useEffect(() => {
    if (featuredApps.length === 0) return

    const interval = setInterval(() => {
      setCurrentFeatured((current) => (current + 1) % featuredApps.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [featuredApps.length])

  // Filter apps based on search and category
  const filteredApps = publishedApps.filter((app) => {
    try {
      // If search query is empty, just filter by category
      if (!searchQuery.trim()) {
        if (activeCategory === "all") return true
        return app.category?.toLowerCase().includes(activeCategory.toLowerCase())
      }

      // Search by name and description
      const nameMatch = app.name?.toLowerCase().includes(searchQuery.toLowerCase())
      const descriptionMatch = app.description?.toLowerCase().includes(searchQuery.toLowerCase())

      // Combine matches
      const matches = nameMatch || descriptionMatch

      // Apply category filter if needed
      if (activeCategory === "all") return matches
      return matches && app.category?.toLowerCase().includes(activeCategory.toLowerCase())
    } catch (error) {
      console.error("Error filtering app:", error)
      return false
    }
  })

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 mb-6">
            {settings?.siteName || "DropX Hub"}
          </h1>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search apps..."
              className="w-full pl-10 py-3 bg-gray-800/50 border border-purple-700/50 text-white rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category Filters */}
          <motion.div
            className="flex flex-wrap gap-4 mt-6 justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeCategory === "all" ? "bg-purple-700" : "bg-gray-800 hover:bg-purple-900/70"
              }`}
              onClick={() => setActiveCategory("all")}
            >
              All Apps
            </button>

            {(settings?.categories || []).slice(0, 4).map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeCategory === category.slug ? "bg-purple-700" : "bg-gray-800 hover:bg-purple-900/70"
                }`}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}

            <div className="flex gap-2 ml-auto">
              <Link href="/about">
                <button className="px-4 py-2 rounded-lg border border-purple-700/50 text-purple-400 hover:bg-purple-900/30">
                  About
                </button>
              </Link>
              <Link href="/creator">
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-700/20">
                  Creator Zone
                </button>
              </Link>
            </div>
          </motion.div>
        </motion.header>

        <main>
          {/* Featured Apps */}
          {featuredApps.length > 0 && (
            <motion.div
              className="relative overflow-hidden rounded-2xl h-[400px] bg-gradient-to-r from-purple-900/30 to-gray-900/30 border border-purple-700/20 mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-800/20 via-transparent to-transparent"></div>

              {/* Navigation Buttons */}
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10 flex items-center justify-center"
                onClick={() =>
                  setCurrentFeatured((current) => (current - 1 + featuredApps.length) % featuredApps.length)
                }
              >
                &lt;
              </button>

              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full h-10 w-10 flex items-center justify-center"
                onClick={() => setCurrentFeatured((current) => (current + 1) % featuredApps.length)}
              >
                &gt;
              </button>

              {/* Featured App Content */}
              <motion.div
                className="absolute inset-0 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="container mx-auto px-8 md:px-16 flex flex-col md:flex-row items-center gap-8">
                  <div className="relative h-40 w-40 md:h-64 md:w-64 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-xl"></div>
                    <div className="relative h-full w-full">
                      <Image
                        src={featuredApps[currentFeatured]?.logo || "/placeholder.svg"}
                        alt={featuredApps[currentFeatured]?.name || "Featured App"}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                      {featuredApps[currentFeatured]?.name}
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-xl line-clamp-2 md:line-clamp-3">
                      {featuredApps[currentFeatured]?.description}
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                      <span className="px-3 py-1 rounded-full border border-purple-500 text-purple-400 text-sm">
                        v{featuredApps[currentFeatured]?.version}
                      </span>
                      <span className="px-3 py-1 rounded-full border border-purple-500 text-purple-400 text-sm">
                        {featuredApps[currentFeatured]?.category}
                      </span>
                      <span className="px-3 py-1 rounded-full border border-purple-500 text-purple-400 text-sm">
                        {featuredApps[currentFeatured]?.size}
                      </span>
                    </div>
                    <div>
                      <Link href={`/app/${featuredApps[currentFeatured]?.id}`}>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-700/20">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Pagination Dots */}
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {featuredApps.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentFeatured ? "w-8 bg-purple-500" : "w-2 bg-gray-600"
                    }`}
                    onClick={() => setCurrentFeatured(index)}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* All Apps */}
          <motion.section
            className="mt-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Apps</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredApps.map((app) => (
                <Link key={app.id} href={`/app/${app.id}`}>
                  <motion.div
                    className="overflow-hidden bg-gray-800/50 border border-purple-700/30 hover:border-purple-500/50 transition-all duration-300 rounded-lg h-full"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative h-32 sm:h-40 w-full bg-gradient-to-br from-purple-900/50 to-gray-900">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-800/20 via-transparent to-transparent"></div>
                      <div className="relative h-full w-full p-4">
                        <Image
                          src={app.logo || "/placeholder.svg"}
                          alt={app.name || "App"}
                          fill
                          className="object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                      <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-purple-600 text-xs text-white">
                        v{app.version || "1.0"}
                      </span>
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-start mb-1 sm:mb-2">
                        <h3 className="font-bold text-sm sm:text-lg text-white">{app.name || "App Name"}</h3>
                        <button
                          className="bg-purple-600 hover:bg-purple-500 h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (app.downloadUrl) {
                              window.open(app.downloadUrl, "_blank")
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
                        {app.description || "No description available"}
                      </p>
                      <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-3 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-xs border border-gray-700 text-gray-400">
                          {app.category || "Uncategorized"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs border border-gray-700 text-gray-400">
                          {app.size || "Unknown"}
                        </span>
                        {app.hashtags && app.hashtags.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs border border-blue-700/50 text-blue-400">
                            #{app.hashtags[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {filteredApps.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-400 text-lg">No apps found matching your search.</p>
                <button
                  className="mt-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </motion.section>
        </main>

        <motion.footer
          className="mt-16 text-center text-gray-400 py-6 border-t border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p>© 2025 {settings?.siteName || "DropX Hub"}. All rights reserved.</p>
        </motion.footer>
      </div>
    </motion.div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AppCard from "@/components/app-card"
import { apps } from "@/lib/data"

export default function CategoryPage() {
  const params = useParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryTitle, setCategoryTitle] = useState("")
  const [filteredApps, setFilteredApps] = useState([])

  useEffect(() => {
    let title = ""
    let filtered = []

    switch (params.type) {
      case "latest":
        title = "Latest Apps"
        filtered = [...apps].sort((a, b) => b.id - a.id)
        break
      case "popular":
        title = "Popular Apps"
        filtered = [...apps].sort((a, b) => b.rating - a.rating)
        break
      case "games":
        title = "Games"
        filtered = apps.filter((app) => app.category.toLowerCase() === "games")
        break
      case "tools":
        title = "Tools"
        filtered = apps.filter((app) => app.category.toLowerCase() === "tools")
        break
      case "education":
        title = "Education Apps"
        filtered = apps.filter((app) => app.category.toLowerCase() === "education")
        break
      default:
        title = "All Apps"
        filtered = apps
    }

    setCategoryTitle(title)
    setFilteredApps(filtered)
  }, [params.type])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const displayedApps = filteredApps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {categoryTitle}
          </h1>
        </div>

        <div className="relative w-full max-w-2xl mx-auto mb-8">
          <Input
            placeholder="Search apps..."
            className="pl-10 py-6 bg-gray-800/50 border-purple-700/50 text-white rounded-xl"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        {displayedApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No apps found matching your search.</p>
            <Button className="mt-4 bg-purple-600 hover:bg-purple-500" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

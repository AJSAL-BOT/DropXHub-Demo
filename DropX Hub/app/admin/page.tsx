"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Edit,
  Upload,
  BarChart3,
  MessageSquare,
  Settings,
  Check,
  Download,
  Star,
  Users2,
  Layers,
  ImageIcon,
  Trash2,
  Search,
  Eye,
  Database,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { useStore } from "@/lib/store-context"
import { v4 as uuidv4 } from "uuid"
import type { AppType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { useAdminAuth } from "@/lib/hooks/use-admin-auth"

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth()
  const {
    apps,
    settings,
    visitors,
    addApp,
    updateApp,
    deleteApp,
    setSettings,
    isLoading: storeLoading,
    addVisitor,
    downloadDatabase,
  } = useStore()

  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isVisitorsDialogOpen, setIsVisitorsDialogOpen] = useState(false)
  const [isVisitorsPasswordDialogOpen, setIsVisitorsPasswordDialogOpen] = useState(false)
  const [visitorsPassword, setVisitorsPassword] = useState("")
  const [currentApp, setCurrentApp] = useState<AppType | null>(null)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [newHashtag, setNewHashtag] = useState("")
  const [currentHashtag, setCurrentHashtag] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [faviconUrl, setFaviconUrl] = useState("")
  const [newApp, setNewApp] = useState({
    id: "",
    name: "",
    description: "",
    version: "1.0.0",
    category: "Tools",
    developer: "DropX Studios",
    size: "0 MB",
    rating: 0,
    reviews: 0,
    status: "draft",
    logo: "/placeholder.svg?height=200&width=200",
    downloadUrl: "",
    websiteUrl: "",
    screenshots: [],
    whatsNew: "",
    hashtags: [],
  })

  const [dashboardStats, setDashboardStats] = useState({
    totalApps: 0,
    publishedApps: 0,
    draftApps: 0,
    totalDownloads: 0,
    totalReviews: 0,
  })

  const [siteSettings, setSiteSettings] = useState({
    siteName: "",
    siteDescription: "",
    primaryColor: "",
    secondaryColor: "",
    logoUrl: "",
    faviconUrl: "",
  })

  const [settingsSaved, setSettingsSaved] = useState(false)
  const [adminAuthenticated, setIsAuthenticated] = useState(false)
  const hasAddedVisitor = useRef(false)

  const correctPassword = "ajsal.dropxhub.pass"
  const visitorsCorrectPassword = "ajsal.dropxhub.data"

  // Add visitor data
  useEffect(() => {
    const addVisitorData = async () => {
      try {
        if (isAuthenticated && !hasAddedVisitor.current && typeof addVisitor === "function") {
          hasAddedVisitor.current = true
          await addVisitor({
            id: uuidv4(),
            deviceName: "Admin User",
            ipAddress: "Admin IP",
            userAgent: navigator.userAgent,
            action: "Viewed admin panel",
            visitDate: new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error("Error adding visitor:", error)
      }
    }

    if (isAuthenticated && !authLoading && !hasAddedVisitor.current) {
      addVisitorData()
    }
  }, [isAuthenticated, authLoading])

  useEffect(() => {
    // Initialize site settings
    if (settings) {
      setSiteSettings({
        siteName: settings.siteName || "",
        siteDescription: settings.siteDescription || "",
        primaryColor: settings.primaryColor || "",
        secondaryColor: settings.secondaryColor || "",
        logoUrl: settings.logoUrl || "",
        faviconUrl: settings.faviconUrl || "",
      })
      setLogoUrl(settings.logoUrl || "")
      setFaviconUrl(settings.faviconUrl || "")
    }
  }, [settings])

  useEffect(() => {
    if (!storeLoading && apps) {
      // Update dashboard stats
      const published = apps.filter((app) => app.status === "published").length
      const drafts = apps.filter((app) => app.status === "draft").length
      const totalReviews = apps.reduce((acc, app) => {
        return acc + (app.reviewsList?.length || 0)
      }, 0)
      const totalDownloads = apps.reduce((acc, app) => {
        return acc + (app.downloads || 0)
      }, 0)

      setDashboardStats({
        totalApps: apps.length,
        publishedApps: published,
        draftApps: drafts,
        totalDownloads,
        totalReviews,
      })
    }
  }, [apps, storeLoading])

  const handleLogin = () => {
    if (password === correctPassword) {
      // Set a cookie to maintain authentication across admin pages
      document.cookie = "admin_authenticated=true; path=/; max-age=3600; SameSite=Strict"
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password. Please try again.")
    }
  }

  // Add a logout function that clears the cookie
  const handleLogout = () => {
    document.cookie = "admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    window.location.href = "/"
  }

  const handleVisitorsPasswordCheck = () => {
    if (visitorsPassword === visitorsCorrectPassword) {
      setIsVisitorsPasswordDialogOpen(false)
      setIsVisitorsDialogOpen(true)
      setVisitorsPassword("")
    } else {
      showNotification("Incorrect password", "error")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.hashtags && app.hashtags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "published") return matchesSearch && app.status === "published"
    if (activeTab === "draft") return matchesSearch && app.status === "draft"
    return matchesSearch
  })

  const handleAddApp = async () => {
    try {
      // Generate a unique ID
      const newId = uuidv4()

      const appToAdd = {
        ...newApp,
        id: newId,
        rating: Number.parseFloat(newApp.rating.toString()) || 0,
        reviews: Number.parseInt(newApp.reviews.toString()) || 0,
        screenshots: [],
        downloads: 0,
      }

      await addApp(appToAdd)

      // Show notification
      showNotification("App added successfully!", "success")

      // Close dialog and reset form
      setIsAddDialogOpen(false)
      setNewApp({
        id: "",
        name: "",
        description: "",
        version: "1.0.0",
        category: "Tools",
        developer: "DropX Studios",
        size: "0 MB",
        rating: 0,
        reviews: 0,
        status: "draft",
        logo: "/placeholder.svg?height=200&width=200",
        downloadUrl: "",
        websiteUrl: "",
        screenshots: [],
        whatsNew: "",
        hashtags: [],
      })
    } catch (error) {
      console.error("Error adding app:", error)
      showNotification("Failed to add app. Please try again.", "error")
    }
  }

  const handleEditApp = async () => {
    if (!currentApp) return

    try {
      await updateApp(currentApp)

      // Show notification
      showNotification("App updated successfully!", "success")

      // Close dialog
      setIsEditDialogOpen(false)
      setCurrentApp(null)
    } catch (error) {
      console.error("Error updating app:", error)
      showNotification("Failed to update app. Please try again.", "error")
    }
  }

  const handleDeleteApp = async () => {
    if (!currentApp) return

    try {
      await deleteApp(currentApp.id)

      // Show notification
      showNotification("App deleted successfully!", "success")

      // Close dialog
      setIsDeleteDialogOpen(false)
      setCurrentApp(null)
    } catch (error) {
      console.error("Error deleting app:", error)
      showNotification("Failed to delete app. Please try again.", "error")
    }
  }

  const handleNewAppChange = (e) => {
    const { name, value } = e.target
    setNewApp((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCurrentAppChange = (e) => {
    const { name, value } = e.target
    setCurrentApp((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleSelectChange = (name, value) => {
    setNewApp((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCurrentSelectChange = (name, value) => {
    setCurrentApp((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleSettingsChange = (e) => {
    const { name, value } = e.target
    setSiteSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveSettings = async () => {
    try {
      // Update the settings in the store
      setSettings({
        ...settings,
        siteName: siteSettings.siteName,
        siteDescription: siteSettings.siteDescription,
        primaryColor: siteSettings.primaryColor,
        secondaryColor: siteSettings.secondaryColor,
        logoUrl: siteSettings.logoUrl,
        faviconUrl: siteSettings.faviconUrl,
      })

      // Show success message
      setSettingsSaved(true)
      showNotification("Settings saved successfully!", "success")

      setTimeout(() => {
        setSettingsSaved(false)
      }, 3000)
    } catch (error) {
      console.error("Error saving settings:", error)
      showNotification("Failed to save settings. Please try again.", "error")
    }
  }

  const openEditDialog = (app) => {
    setCurrentApp(app)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (app) => {
    setCurrentApp(app)
    setIsDeleteDialogOpen(true)
  }

  const viewAppDetails = (appId) => {
    window.open(`/app/${appId}`, "_blank")
  }

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    })

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      })
    }, 3000)
  }

  const handleDownloadDatabase = () => {
    downloadDatabase()
    showNotification("Database downloaded successfully!", "success")
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const addHashtag = () => {
    if (!newHashtag.trim()) return

    setNewApp((prev) => ({
      ...prev,
      hashtags: [...(prev.hashtags || []), newHashtag.trim()],
    }))

    setNewHashtag("")
  }

  const removeHashtag = (index) => {
    setNewApp((prev) => ({
      ...prev,
      hashtags: prev.hashtags?.filter((_, i) => i !== index) || [],
    }))
  }

  const addCurrentHashtag = () => {
    if (!currentHashtag.trim() || !currentApp) return

    setCurrentApp((prev) => {
      if (!prev) return null
      return {
        ...prev,
        hashtags: [...(prev.hashtags || []), currentHashtag.trim()],
      }
    })

    setCurrentHashtag("")
  }

  const removeCurrentHashtag = (index) => {
    setCurrentApp((prev) => {
      if (!prev) return null
      return {
        ...prev,
        hashtags: prev.hashtags?.filter((_, i) => i !== index) || [],
      }
    })
  }

  if (authLoading || storeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading DropX Hub...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 flex items-center justify-center">
        <div className="bg-gray-800/80 border border-purple-700/30 rounded-xl p-8 max-w-md w-full backdrop-blur-sm">
          <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              DropX Hub
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Access</h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter admin password"
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Login
            </Button>

            <div className="text-center">
              <Link href="/" className="text-purple-400 text-sm hover:underline">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 text-white">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === "success"
              ? "bg-green-800 text-green-100"
              : notification.type === "warning"
                ? "bg-yellow-800 text-yellow-100"
                : "bg-red-800 text-red-100"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              DropX Hub Admin
            </h1>
          </div>

          <nav className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "dashboard" ? "bg-purple-900/50 text-purple-300" : "text-gray-300"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "all" || activeTab === "published" || activeTab === "draft" ? "bg-purple-900/50 text-purple-300" : "text-gray-300"}`}
              onClick={() => setActiveTab("all")}
            >
              <Upload className="mr-2 h-4 w-4" />
              Manage Apps
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300"
              onClick={() => (window.location.href = "/admin/categories")}
            >
              <Layers className="mr-2 h-4 w-4" />
              Categories
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300"
              onClick={() => (window.location.href = "/admin/screenshots")}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Screenshots
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300"
              onClick={() => (window.location.href = "/admin/featured")}
            >
              <Star className="mr-2 h-4 w-4" />
              Featured Apps
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300"
              onClick={() => (window.location.href = "/admin/reviews")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Reviews
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300"
              onClick={() => (window.location.href = "/admin/creators")}
            >
              <Users2 className="mr-2 h-4 w-4" />
              Creators
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "settings" ? "bg-purple-900/50 text-purple-300" : "text-gray-300"}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            <div className="pt-4 border-t border-gray-800 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300"
                onClick={() => (window.location.href = "/admin/data-management")}
              >
                <Database className="mr-2 h-4 w-4" />
                Data Management
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300"
                onClick={() => setIsVisitorsPasswordDialogOpen(true)}
              >
                <User className="mr-2 h-4 w-4" />
                View Visitors
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300" onClick={handleDownloadDatabase}>
                <Database className="mr-2 h-4 w-4" />
                Download Database
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-300" onClick={handleLogout}>
                <X className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activeTab === "dashboard" ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <Card className="bg-gray-800/50 border-purple-700/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total Apps</p>
                          <p className="text-3xl font-bold">{dashboardStats.totalApps}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-900/50 flex items-center justify-center">
                          <Upload className="h-6 w-6 text-purple-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-purple-700/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Published Apps</p>
                          <p className="text-3xl font-bold">{dashboardStats.publishedApps}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-900/50 flex items-center justify-center">
                          <Check className="h-6 w-6 text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-purple-700/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total Downloads</p>
                          <p className="text-3xl font-bold">{dashboardStats.totalDownloads.toLocaleString()}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-900/50 flex items-center justify-center">
                          <Download className="h-6 w-6 text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-purple-700/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total Reviews</p>
                          <p className="text-3xl font-bold">{dashboardStats.totalReviews.toLocaleString()}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-yellow-900/50 flex items-center justify-center">
                          <Star className="h-6 w-6 text-yellow-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-gray-800/50 border-purple-700/30">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {visitors
                          .slice(-3)
                          .reverse()
                          .map((visitor, index) => (
                            <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-700">
                              <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm">New visitor</p>
                                <p className="text-xs text-gray-400">{formatDate(visitor.visitDate)}</p>
                              </div>
                            </div>
                          ))}
                        {visitors.length === 0 && <p className="text-gray-400 text-center">No recent activity</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-purple-700/30">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          className="bg-purple-600 hover:bg-purple-500 w-full"
                          onClick={() => setIsAddDialogOpen(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add New App
                        </Button>
                        <Button
                          className="bg-blue-600 hover:bg-blue-500 w-full"
                          onClick={() => (window.location.href = "/admin/featured")}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          Manage Featured
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-500 w-full"
                          onClick={() => (window.location.href = "/admin/categories")}
                        >
                          <Layers className="mr-2 h-4 w-4" />
                          Manage Categories
                        </Button>
                        <Button
                          className="bg-amber-600 hover:bg-amber-500 w-full"
                          onClick={() => (window.location.href = "/admin/reviews")}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Reviews
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : activeTab === "all" || activeTab === "published" || activeTab === "draft" ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Manage Apps</h2>
                  <Button className="bg-purple-600 hover:bg-purple-500" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New App
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    className={activeTab === "all" ? "bg-purple-600 hover:bg-purple-500" : ""}
                    onClick={() => setActiveTab("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={activeTab === "published" ? "default" : "outline"}
                    className={activeTab === "published" ? "bg-green-600 hover:bg-green-500" : ""}
                    onClick={() => setActiveTab("published")}
                  >
                    Published
                  </Button>
                  <Button
                    variant={activeTab === "draft" ? "default" : "outline"}
                    className={activeTab === "draft" ? "bg-amber-600 hover:bg-amber-500" : ""}
                    onClick={() => setActiveTab("draft")}
                  >
                    Drafts
                  </Button>

                  <div className="ml-auto relative">
                    <Input
                      placeholder="Search apps..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-700"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </div>

                <Card className="bg-gray-800/50 border-purple-700/30">
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4">App</th>
                            <th className="text-left py-3 px-4">Category</th>
                            <th className="text-left py-3 px-4">Version</th>
                            <th className="text-left py-3 px-4">Downloads</th>
                            <th className="text-left py-3 px-4">Status</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredApps.length > 0 ? (
                            filteredApps.map((app, index) => (
                              <tr key={app.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10">
                                      <Image
                                        src={app.logo || "/placeholder.svg"}
                                        alt={app.name}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">{app.name}</p>
                                      <p className="text-xs text-gray-400">{app.developer}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">{app.category}</td>
                                <td className="py-3 px-4">v{app.version}</td>
                                <td className="py-3 px-4">{app.downloads || 0}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                                      app.status === "published"
                                        ? "bg-green-900/50 text-green-400"
                                        : "bg-amber-900/50 text-amber-400"
                                    }`}
                                  >
                                    {app.status === "published" ? "Published" : "Draft"}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 border-gray-700"
                                      onClick={() => viewAppDetails(app.id)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 border-gray-700"
                                      onClick={() => openEditDialog(app)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 w-8 p-0 border-gray-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800"
                                      onClick={() => openDeleteDialog(app)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-gray-400">
                                No apps found. Add your first app!
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : activeTab === "settings" ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">Settings</h2>

                <Card className="bg-gray-800/50 border-purple-700/30 mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Site Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                          id="siteName"
                          name="siteName"
                          value={siteSettings.siteName}
                          onChange={handleSettingsChange}
                          className="bg-gray-700/50 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="siteDescription">Site Description</Label>
                        <Input
                          id="siteDescription"
                          name="siteDescription"
                          value={siteSettings.siteDescription}
                          onChange={handleSettingsChange}
                          className="bg-gray-700/50 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primaryColor"
                            name="primaryColor"
                            value={siteSettings.primaryColor}
                            onChange={handleSettingsChange}
                            className="bg-gray-700/50 border-gray-600"
                          />
                          <div
                            className="h-10 w-10 rounded-md border border-gray-600"
                            style={{ backgroundColor: siteSettings.primaryColor }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="secondaryColor"
                            name="secondaryColor"
                            value={siteSettings.secondaryColor}
                            onChange={handleSettingsChange}
                            className="bg-gray-700/50 border-gray-600"
                          />
                          <div
                            className="h-10 w-10 rounded-md border border-gray-600"
                            style={{ backgroundColor: siteSettings.secondaryColor }}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="logoUrl">Site Logo URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="logoUrl"
                            name="logoUrl"
                            value={siteSettings.logoUrl}
                            onChange={handleSettingsChange}
                            className="bg-gray-700/50 border-gray-600"
                            placeholder="Enter logo URL"
                          />
                          <div className="h-10 w-10 rounded-md border border-gray-600 overflow-hidden relative">
                            {siteSettings.logoUrl && (
                              <Image
                                src={siteSettings.logoUrl || "/placeholder.svg"}
                                alt="Logo Preview"
                                fill
                                className="object-contain"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="faviconUrl">Site Favicon URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="faviconUrl"
                            name="faviconUrl"
                            value={siteSettings.faviconUrl}
                            onChange={handleSettingsChange}
                            className="bg-gray-700/50 border-gray-600"
                            placeholder="Enter favicon URL"
                          />
                          <div className="h-10 w-10 rounded-md border border-gray-600 overflow-hidden relative">
                            {siteSettings.faviconUrl && (
                              <Image
                                src={siteSettings.faviconUrl || "/placeholder.svg"}
                                alt="Favicon Preview"
                                fill
                                className="object-contain"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {settingsSaved && (
                        <div className="bg-green-900/50 text-green-400 p-3 rounded-md">
                          Settings saved successfully!
                        </div>
                      )}

                      <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleSaveSettings}>
                        Save Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Add App Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add New App</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">App Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newApp.name}
                  onChange={handleNewAppChange}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newApp.description}
                  onChange={handleNewAppChange}
                  className="bg-gray-700/50 border-gray-600 min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="whatsNew">What's New</Label>
                <Textarea
                  id="whatsNew"
                  name="whatsNew"
                  value={newApp.whatsNew || ""}
                  onChange={handleNewAppChange}
                  className="bg-gray-700/50 border-gray-600 min-h-[100px]"
                  placeholder="List the new features or changes in this version"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  value={newApp.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {settings.categories &&
                      settings.categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="developer">Developer</Label>
                <Input
                  id="developer"
                  name="developer"
                  value={newApp.developer}
                  onChange={handleNewAppChange}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="hashtags">Hashtags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="hashtags"
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="Enter hashtag (e.g. AI, Game)"
                  />
                  <Button type="button" onClick={addHashtag} className="bg-blue-600 hover:bg-blue-500">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newApp.hashtags?.map((tag, index) => (
                    <Badge key={index} className="bg-blue-900/50 text-blue-300 flex items-center gap-1">
                      #{tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeHashtag(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  name="version"
                  value={newApp.version}
                  onChange={handleNewAppChange}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  name="size"
                  value={newApp.size}
                  onChange={handleNewAppChange}
                  className="bg-gray-700/50 border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="downloadUrl">Download APK URL</Label>
                <Input
                  id="downloadUrl"
                  name="downloadUrl"
                  value={newApp.downloadUrl}
                  onChange={handleNewAppChange}
                  className="bg-gray-700/50 border-gray-600"
                  placeholder="Enter APK download URL (optional)"
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={newApp.websiteUrl}
                  onChange={handleNewAppChange}
                  className="bg-gray-700/50 border-gray-600"
                  placeholder="Enter website URL (optional)"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={newApp.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="logo">App Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={newApp.logo}
                  onChange={handleNewAppChange}
                  placeholder="Enter logo URL"
                  className="bg-gray-700/50 border-gray-600"
                />
                <div className="mt-2 relative h-20 w-20 border border-gray-600 rounded-md overflow-hidden">
                  <Image
                    src={newApp.logo || "/placeholder.svg"}
                    alt="App Logo Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 bg-gray-800 pt-2 pb-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleAddApp}>
              Add App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit App Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit App</DialogTitle>
          </DialogHeader>
          {currentApp && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">App Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={currentApp.name}
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={currentApp.description}
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-whatsNew">What's New</Label>
                  <Textarea
                    id="edit-whatsNew"
                    name="whatsNew"
                    value={currentApp.whatsNew || ""}
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600 min-h-[100px]"
                    placeholder="List the new features or changes in this version"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    name="category"
                    value={currentApp.category}
                    onValueChange={(value) => handleCurrentSelectChange("category", value)}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {settings.categories &&
                        settings.categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-developer">Developer</Label>
                  <Input
                    id="edit-developer"
                    name="developer"
                    value={currentApp.developer}
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-hashtags">Hashtags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="edit-hashtags"
                      value={currentHashtag}
                      onChange={(e) => setCurrentHashtag(e.target.value)}
                      className="bg-gray-700/50 border-gray-600"
                      placeholder="Enter hashtag (e.g. AI, Game)"
                    />
                    <Button type="button" onClick={addCurrentHashtag} className="bg-blue-600 hover:bg-blue-500">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentApp.hashtags?.map((tag, index) => (
                      <Badge key={index} className="bg-blue-900/50 text-blue-300 flex items-center gap-1">
                        #{tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeCurrentHashtag(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-version">Version</Label>
                  <Input
                    id="edit-version"
                    name="version"
                    value={currentApp.version}
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-size">Size</Label>
                  <Input
                    id="edit-size"
                    name="size"
                    value={currentApp.size}
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-releaseDate">Release Date</Label>
                  <Input
                    id="edit-releaseDate"
                    name="releaseDate"
                    type="date"
                    value={
                      currentApp.releaseDate
                        ? new Date(currentApp.releaseDate).toISOString().split("T")[0]
                        : new Date().toISOString().split("T")[0]
                    }
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-downloadUrl">Download APK URL</Label>
                  <Input
                    id="edit-downloadUrl"
                    name="downloadUrl"
                    value={currentApp.downloadUrl || ""}
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="Enter APK download URL (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-websiteUrl">Website URL</Label>
                  <Input
                    id="edit-websiteUrl"
                    name="websiteUrl"
                    value={currentApp.websiteUrl || ""}
                    onChange={handleCurrentAppChange}
                    className="bg-gray-700/50 border-gray-600"
                    placeholder="Enter website URL (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    name="status"
                    value={currentApp.status}
                    onValueChange={(value) => handleCurrentSelectChange("status", value)}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-logo">App Logo URL</Label>
                  <Input
                    id="edit-logo"
                    name="logo"
                    value={currentApp.logo}
                    onChange={handleCurrentAppChange}
                    placeholder="Enter logo URL"
                    className="bg-gray-700/50 border-gray-600"
                  />
                  <div className="mt-2 relative h-20 w-20 border border-gray-600 rounded-md overflow-hidden">
                    <Image
                      src={currentApp.logo || "/placeholder.svg"}
                      alt="App Logo Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sticky bottom-0 bg-gray-800 pt-2 pb-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleEditApp}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete App Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete App</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this app? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentApp && (
            <div className="py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={currentApp.logo || "/placeholder.svg"}
                    alt={currentApp.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{currentApp.name}</h3>
                  <p className="text-sm text-gray-400">{currentApp.developer}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteApp}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visitors Password Dialog */}
      <Dialog open={isVisitorsPasswordDialogOpen} onOpenChange={setIsVisitorsPasswordDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please enter the password to view visitor data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              value={visitorsPassword}
              onChange={(e) => setVisitorsPassword(e.target.value)}
              className="bg-gray-700/50 border-gray-600"
              placeholder="Enter password"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVisitorsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleVisitorsPasswordCheck}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visitors Dialog */}
      <Dialog open={isVisitorsDialogOpen} onOpenChange={setIsVisitorsDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visitor Data</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4">Date</th>
                    <th className="text-left py-2 px-4">Device</th>
                    <th className="text-left py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.length > 0 ? (
                    visitors.map((visitor) => (
                      <tr key={visitor.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                        <td className="py-2 px-4">{formatDate(visitor.visitDate)}</td>
                        <td className="py-2 px-4">{visitor.deviceName}</td>
                        <td className="py-2 px-4">{visitor.action || "Visited site"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-400">
                        No visitor data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={() => setIsVisitorsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

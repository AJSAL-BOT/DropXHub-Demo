"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { database } from "@/lib/database"
import { apps as defaultApps, defaultSettings, defaultVisitors } from "@/lib/data"

// Create context with undefined as initial value
const StoreContext = createContext(undefined)

export function StoreProvider({ children }) {
  const [apps, setApps] = useState([])
  const [settings, setSettings] = useState({})
  const [visitors, setVisitors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data
  useEffect(() => {
    try {
      // Try to get data from localStorage first
      let appData = database.apps.getAll()
      let settingsData = database.settings.get()
      let visitorsData = database.visitors.getAll()

      // If no data in localStorage, use default data
      if (!appData || appData.length === 0) {
        appData = defaultApps
        database.apps.setAll(defaultApps)
      }

      if (!settingsData || Object.keys(settingsData).length === 0) {
        settingsData = defaultSettings
        database.settings.set(defaultSettings)
      }

      if (!visitorsData || visitorsData.length === 0) {
        visitorsData = defaultVisitors || []
        if (defaultVisitors && defaultVisitors.length > 0) {
          database.visitors.setAll(defaultVisitors)
        }
      }

      setApps(appData)
      setSettings(settingsData)
      setVisitors(visitorsData)
    } catch (error) {
      console.error("Error initializing data:", error)
      // Use default data as fallback
      setApps(defaultApps || [])
      setSettings(defaultSettings || {})
      setVisitors(defaultVisitors || [])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getFeaturedApps = () => {
    try {
      if (!settings || !settings.featuredApps || !apps) {
        return []
      }

      return settings.featuredApps
        .map((id) => apps.find((app) => app.id === id))
        .filter((app) => app !== undefined && app.status === "published")
    } catch (error) {
      console.error("Error getting featured apps:", error)
      return []
    }
  }

  const addApp = async (app) => {
    try {
      const now = new Date().toISOString()
      const appWithDates = {
        ...app,
        releaseDate: now,
        updatedDate: now,
        downloads: 0,
      }

      database.apps.add(appWithDates)
      setApps(database.apps.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding app:", error)
      return Promise.reject(error)
    }
  }

  const updateApp = async (app) => {
    try {
      const updatedApp = {
        ...app,
        updatedDate: new Date().toISOString(),
      }

      database.apps.update(updatedApp)
      setApps(database.apps.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error updating app:", error)
      return Promise.reject(error)
    }
  }

  const deleteApp = async (id) => {
    try {
      database.apps.delete(id)

      if (settings.featuredApps && settings.featuredApps.includes(id)) {
        const updatedFeaturedApps = settings.featuredApps.filter((appId) => appId !== id)
        database.settings.updateFeaturedApps(updatedFeaturedApps)
        setSettings(database.settings.get())
      }

      setApps(database.apps.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error deleting app:", error)
      return Promise.reject(error)
    }
  }

  const addCategory = async (category) => {
    try {
      database.settings.categories.add(category)
      setSettings(database.settings.get())
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding category:", error)
      return Promise.reject(error)
    }
  }

  const updateCategory = async (category) => {
    try {
      database.settings.categories.update(category)
      setSettings(database.settings.get())
      return Promise.resolve()
    } catch (error) {
      console.error("Error updating category:", error)
      return Promise.reject(error)
    }
  }

  const deleteCategory = async (id) => {
    try {
      database.settings.categories.delete(id)
      setSettings(database.settings.get())
      return Promise.resolve()
    } catch (error) {
      console.error("Error deleting category:", error)
      return Promise.reject(error)
    }
  }

  const addCreator = async (creator) => {
    try {
      database.settings.creators.add(creator)
      setSettings(database.settings.get())
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding creator:", error)
      return Promise.reject(error)
    }
  }

  const updateCreator = async (creator) => {
    try {
      database.settings.creators.update(creator)
      setSettings(database.settings.get())
      return Promise.resolve()
    } catch (error) {
      console.error("Error updating creator:", error)
      return Promise.reject(error)
    }
  }

  const deleteCreator = async (id) => {
    try {
      database.settings.creators.delete(id)
      setSettings(database.settings.get())
      return Promise.resolve()
    } catch (error) {
      console.error("Error deleting creator:", error)
      return Promise.reject(error)
    }
  }

  const addReview = async (appId, review) => {
    try {
      database.reviews.add(appId, review)
      setApps(database.apps.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding review:", error)
      return Promise.reject(error)
    }
  }

  const updateReview = async (appId, review) => {
    try {
      database.reviews.update(appId, review)
      setApps(database.apps.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error updating review:", error)
      return Promise.reject(error)
    }
  }

  const deleteReview = async (appId, reviewId) => {
    try {
      database.reviews.delete(appId, reviewId)
      setApps(database.apps.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error deleting review:", error)
      return Promise.reject(error)
    }
  }

  const replyToReview = async (appId, reviewId, reply) => {
    try {
      database.reviews.addReply(appId, reviewId, reply)
      setApps(database.apps.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error replying to review:", error)
      return Promise.reject(error)
    }
  }

  const updateFeaturedApps = async (appIds) => {
    try {
      database.settings.updateFeaturedApps(appIds)
      setSettings(database.settings.get())
      return Promise.resolve()
    } catch (error) {
      console.error("Error updating featured apps:", error)
      return Promise.reject(error)
    }
  }

  const incrementDownloads = async (appId) => {
    try {
      database.apps.incrementDownloads(appId)
      setApps(database.apps.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error incrementing downloads:", error)
      return Promise.reject(error)
    }
  }

  const addVisitor = async (visitor) => {
    try {
      database.visitors.add(visitor)
      setVisitors(database.visitors.getAll())
      return Promise.resolve()
    } catch (error) {
      console.error("Error adding visitor:", error)
      return Promise.reject(error)
    }
  }

  const downloadDatabase = () => {
    try {
      return database.downloadDatabase()
    } catch (error) {
      console.error("Error downloading database:", error)
      return false
    }
  }

  // Create the context value object with all functions
  const value = {
    apps,
    setApps,
    settings,
    setSettings,
    visitors,
    setVisitors,
    getFeaturedApps,
    addApp,
    updateApp,
    deleteApp,
    addCategory,
    updateCategory,
    deleteCategory,
    addCreator,
    updateCreator,
    deleteCreator,
    addReview,
    updateReview,
    deleteReview,
    replyToReview,
    updateFeaturedApps,
    incrementDownloads,
    addVisitor,
    isLoading,
    downloadDatabase,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

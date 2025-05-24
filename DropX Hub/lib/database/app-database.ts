import { apps as defaultApps } from "@/lib/data"
import type { AppType } from "@/lib/types"

const STORAGE_KEY = "dropx-hub-apps"

// Initialize with default apps from data.ts
const apps: AppType[] = [...defaultApps]

// Get app data from localStorage if available
const initializeFromStorage = () => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedApps = JSON.parse(stored)
        if (Array.isArray(parsedApps) && parsedApps.length > 0) {
          // Replace the array contents while keeping the same reference
          apps.splice(0, apps.length, ...parsedApps)
        }
      }
    }
  } catch (error) {
    console.error("Error loading apps from localStorage:", error)
  }
}

// Save app data to localStorage
const saveToStorage = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
    }
  } catch (error) {
    console.error("Error saving apps to localStorage:", error)
  }
}

// Try to initialize from localStorage
if (typeof window !== "undefined") {
  initializeFromStorage()
}

export const appDatabase = {
  // Get all apps
  getAll: () => [...apps],

  // Get a single app by ID
  getById: (id: string) => apps.find((app) => app.id === id),

  // Add a new app
  add: (app: AppType) => {
    apps.push(app)
    saveToStorage()
    return app
  },

  // Update an existing app
  update: (app: AppType) => {
    const index = apps.findIndex((a) => a.id === app.id)
    if (index !== -1) {
      apps[index] = { ...app }
      saveToStorage()
      return app
    }
    return null
  },

  // Delete an app
  delete: (id: string) => {
    const index = apps.findIndex((app) => app.id === id)
    if (index !== -1) {
      const deleted = apps.splice(index, 1)[0]
      saveToStorage()
      return deleted
    }
    return null
  },

  // Set all apps (used for imports)
  setAll: (newApps: AppType[]) => {
    apps.splice(0, apps.length, ...newApps)
    saveToStorage()
  },

  // Increment downloads for an app
  incrementDownloads: (id: string) => {
    const app = apps.find((app) => app.id === id)
    if (app) {
      app.downloads = (app.downloads || 0) + 1
      saveToStorage()
      return app
    }
    return null
  },
}

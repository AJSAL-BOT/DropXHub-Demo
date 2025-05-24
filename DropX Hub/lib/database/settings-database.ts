import { defaultSettings } from "@/lib/data"
import type { AppStoreSettings, CategoryType, CreatorType } from "@/lib/types"

// Initialize with default settings
let settings: AppStoreSettings = { ...defaultSettings }

// Get settings from localStorage if available
const initializeFromStorage = () => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dropx-hub-settings")
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        if (parsedSettings && typeof parsedSettings === "object") {
          settings = { ...parsedSettings }
        }
      }
    }
  } catch (error) {
    console.error("Error loading settings from localStorage:", error)
  }
}

// Save settings to localStorage
const saveToStorage = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("dropx-hub-settings", JSON.stringify(settings))
    }
  } catch (error) {
    console.error("Error saving settings to localStorage:", error)
  }
}

// Try to initialize from localStorage
if (typeof window !== "undefined") {
  initializeFromStorage()
}

export const settingsDatabase = {
  // Get all settings
  get: () => ({ ...settings }),

  // Update settings
  set: (newSettings: AppStoreSettings) => {
    settings = { ...newSettings }
    saveToStorage()
    return settings
  },

  // Update featured apps
  updateFeaturedApps: (featuredApps: string[]) => {
    settings.featuredApps = [...featuredApps]
    saveToStorage()
    return settings
  },

  // Update logo and favicon
  updateLogoAndFavicon: (logoUrl: string, faviconUrl: string) => {
    settings.logoUrl = logoUrl
    settings.faviconUrl = faviconUrl
    saveToStorage()
    return settings
  },

  // Categories CRUD
  categories: {
    // Get all categories
    getAll: () => settings.categories || [],

    // Get a single category by ID
    getById: (id: string) => settings.categories?.find((category) => category.id === id) || null,

    // Add a new category
    add: (category: CategoryType) => {
      if (!settings.categories) {
        settings.categories = []
      }
      settings.categories.push(category)
      saveToStorage()
      return category
    },

    // Update an existing category
    update: (category: CategoryType) => {
      if (settings.categories) {
        const index = settings.categories.findIndex((c) => c.id === category.id)
        if (index !== -1) {
          settings.categories[index] = { ...category }
          saveToStorage()
          return category
        }
      }
      return null
    },

    // Delete a category
    delete: (id: string) => {
      if (settings.categories) {
        const index = settings.categories.findIndex((category) => category.id === id)
        if (index !== -1) {
          const deleted = settings.categories.splice(index, 1)[0]
          saveToStorage()
          return deleted
        }
      }
      return null
    },
  },

  // Creators CRUD
  creators: {
    // Get all creators
    getAll: () => settings.creators || [],

    // Get a single creator by ID
    getById: (id: string) => settings.creators?.find((creator) => creator.id === id) || null,

    // Add a new creator
    add: (creator: CreatorType) => {
      if (!settings.creators) {
        settings.creators = []
      }
      settings.creators.push(creator)
      saveToStorage()
      return creator
    },

    // Update an existing creator
    update: (creator: CreatorType) => {
      if (settings.creators) {
        const index = settings.creators.findIndex((c) => c.id === creator.id)
        if (index !== -1) {
          settings.creators[index] = { ...creator }
          saveToStorage()
          return creator
        }
      }
      return null
    },

    // Delete a creator
    delete: (id: string) => {
      if (settings.creators) {
        const index = settings.creators.findIndex((creator) => creator.id === id)
        if (index !== -1) {
          const deleted = settings.creators.splice(index, 1)[0]
          saveToStorage()
          return deleted
        }
      }
      return null
    },
  },
}

// Import with the correct export names
import { appDatabase } from "./app-database"
import { reviewDatabase } from "./review-database"
import { settingsDatabase } from "./settings-database"
import { visitorDatabase } from "./visitor-database"

// Export all database handlers with consistent naming
export const database = {
  apps: appDatabase,
  reviews: reviewDatabase,
  settings: settingsDatabase,
  visitors: visitorDatabase,

  // Utility function to download full database
  downloadDatabase: () => {
    try {
      const data = {
        apps: appDatabase.getAll(),
        settings: settingsDatabase.get(),
        visitors: visitorDatabase.getAll(),
      }

      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = "dropx-hub-database.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return true
    } catch (error) {
      console.error("Error downloading database:", error)
      return false
    }
  },

  // Initialize database with data (used for imports)
  initializeWithData: (data) => {
    try {
      if (data.apps) {
        appDatabase.setAll(data.apps)
      }
      if (data.settings) {
        settingsDatabase.set(data.settings)
      }
      if (data.visitors) {
        visitorDatabase.setAll(data.visitors)
      }
      return true
    } catch (error) {
      console.error("Error initializing database with data:", error)
      return false
    }
  },
}

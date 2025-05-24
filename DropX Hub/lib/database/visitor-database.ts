import { defaultVisitors } from "@/lib/data"
import type { VisitorType } from "@/lib/types"

// Initialize with default visitors
const visitors: VisitorType[] = [...(defaultVisitors || [])]

// Get visitor data from localStorage if available
const initializeFromStorage = () => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dropx-hub-visitors")
      if (stored) {
        const parsedVisitors = JSON.parse(stored)
        if (Array.isArray(parsedVisitors) && parsedVisitors.length > 0) {
          // Replace the array contents while keeping the same reference
          visitors.splice(0, visitors.length, ...parsedVisitors)
        }
      }
    }
  } catch (error) {
    console.error("Error loading visitors from localStorage:", error)
  }
}

// Save visitor data to localStorage
const saveToStorage = () => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("dropx-hub-visitors", JSON.stringify(visitors))
    }
  } catch (error) {
    console.error("Error saving visitors to localStorage:", error)
  }
}

// Extract device information from user agent
const extractDeviceInfo = (userAgent: string): string => {
  let deviceInfo = "Unknown Device"

  if (userAgent.match(/iPhone/i)) {
    deviceInfo = "iPhone"
  } else if (userAgent.match(/iPad/i)) {
    deviceInfo = "iPad"
  } else if (userAgent.match(/Android/i)) {
    const androidMatch = userAgent.match(/Android [0-9.]+; ([^;]+)/i)
    if (androidMatch && androidMatch[1]) {
      deviceInfo = androidMatch[1].trim()
    } else {
      deviceInfo = "Android Device"
    }
  } else if (userAgent.match(/Windows/i)) {
    deviceInfo = "Windows PC"
  } else if (userAgent.match(/Macintosh/i)) {
    deviceInfo = "Mac"
  } else if (userAgent.match(/Linux/i)) {
    deviceInfo = "Linux PC"
  }

  return deviceInfo
}

// Try to initialize from localStorage
if (typeof window !== "undefined") {
  initializeFromStorage()
}

export const visitorDatabase = {
  // Get all visitors
  getAll: () => [...visitors],

  // Add a new visitor
  add: (visitor: VisitorType) => {
    // Check if a similar visitor entry already exists in the last minute
    const now = new Date()
    const oneMinuteAgo = new Date(now.getTime() - 60000)
    const recentVisitor = visitors.find(
      (v) => v.userAgent === visitor.userAgent && new Date(v.visitDate) > oneMinuteAgo,
    )

    if (!recentVisitor) {
      // Extract device name from user agent
      const enhancedVisitor = {
        ...visitor,
        deviceName: extractDeviceInfo(visitor.userAgent),
      }

      visitors.push(enhancedVisitor)
      saveToStorage()
      return enhancedVisitor
    }

    return null
  },

  // Set all visitors (used for imports)
  setAll: (newVisitors: VisitorType[]) => {
    visitors.splice(0, visitors.length, ...newVisitors)
    saveToStorage()
  },
}

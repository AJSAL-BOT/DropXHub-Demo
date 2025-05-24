"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Copy, RefreshCw, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store-context"
import { copyToClipboard } from "@/lib/database/export-utils"
import { useAdminAuth } from "@/lib/hooks/use-admin-auth"

export default function DataManagementPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const { apps, settings, visitors, downloadDatabase } = useStore()
  const [activeTab, setActiveTab] = useState("export")
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [generatedCode, setGeneratedCode] = useState("")

  // If still loading or not authenticated, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const handleGenerateCode = () => {
    // Collect all data
    const data = {
      apps,
      settings,
      visitors,
    }

    // Convert to a single code block
    const code = `// Generated on ${new Date().toLocaleString()}
import type { AppType, CategoryType, CreatorType, AppStoreSettings, VisitorType } from "./types"

// Apps data
export const apps: AppType[] = ${JSON.stringify(apps, null, 2)}

// Settings data
export const defaultSettings: AppStoreSettings = ${JSON.stringify(settings, null, 2)}

// Visitors data (optional - can be removed if not needed)
export const defaultVisitors: VisitorType[] = ${JSON.stringify(visitors, null, 2)}
`

    setGeneratedCode(code)
    showNotification("Code generated successfully!", "success")
  }

  const handleDownloadCode = () => {
    if (!generatedCode) {
      showNotification("Please generate code first", "error")
      return
    }

    const blob = new Blob([generatedCode], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.ts"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showNotification("data.ts downloaded successfully!", "success")
  }

  const handleCopyCode = async () => {
    if (!generatedCode) {
      showNotification("Please generate code first", "error")
      return
    }

    const success = await copyToClipboard(generatedCode)
    if (success) {
      showNotification("Code copied to clipboard!", "success")
    } else {
      showNotification("Failed to copy code to clipboard", "error")
    }
  }

  const handleDownloadFullDatabase = () => {
    downloadDatabase()
    showNotification("Full database downloaded as JSON", "success")
  }

  const handleClearLocalStorage = () => {
    // Show instructions instead of actually clearing
    setActiveTab("clear-storage")
  }

  const showNotification = (message: string, type: string) => {
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Data Management
          </h1>
        </div>

        <Tabs defaultValue="export" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="bg-gray-800/50 border border-purple-700/30 w-full mb-6">
            <TabsTrigger value="export" className="flex-1">
              Export Data as Code
            </TabsTrigger>
            <TabsTrigger value="deploy" className="flex-1">
              Deployment Guide
            </TabsTrigger>
            <TabsTrigger value="clear-storage" className="flex-1">
              Clear Local Storage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-gray-800/50 border-purple-700/30 mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Export All Data as Code</h2>
                  <p className="text-gray-300 mb-6">
                    This feature allows you to export all your current data (apps, categories, settings, etc.) from
                    local storage as JavaScript code. You can then use this code to update your source files and
                    redeploy your application on Vercel.
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleGenerateCode}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Generate Code
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-500" onClick={handleDownloadFullDatabase}>
                      <Download className="mr-2 h-4 w-4" />
                      Download Full Database (JSON)
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700" onClick={handleClearLocalStorage}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear Local Storage
                    </Button>
                  </div>

                  {generatedCode && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">Complete Data Code (data.ts)</h3>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopyCode}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDownloadCode}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                        <div className="relative">
                          <Textarea
                            value={generatedCode}
                            readOnly
                            className="h-96 font-mono text-sm bg-gray-900/50 border-gray-700"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="deploy">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-gray-800/50 border-purple-700/30">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Deployment Guide</h2>
                  <p className="text-gray-300 mb-6">
                    Follow these steps to update your source code and redeploy your application on Vercel:
                  </p>

                  <div className="space-y-6">
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/30">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="bg-purple-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                          1
                        </span>
                        Export Your Data
                      </h3>
                      <p className="text-gray-300 ml-8">
                        Go to the "Export Data as Code" tab and click "Generate Code". Copy the generated code or
                        download the file.
                      </p>
                    </div>

                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/30">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="bg-purple-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                          2
                        </span>
                        Update Your Source Code
                      </h3>
                      <p className="text-gray-300 ml-8 mb-2">
                        Replace the content of your <code className="bg-gray-800 px-1 py-0.5 rounded">lib/data.ts</code>{" "}
                        file with the generated code.
                      </p>
                      <p className="text-gray-300 ml-8">
                        Make sure to keep any type definitions and other necessary imports at the top of the file.
                      </p>
                    </div>

                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/30">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="bg-purple-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                          3
                        </span>
                        Commit and Push Changes
                      </h3>
                      <p className="text-gray-300 ml-8 mb-2">
                        Commit your changes to your Git repository and push them to GitHub:
                      </p>
                      <div className="bg-gray-800 p-3 rounded-md font-mono text-sm ml-8 mb-2">
                        git add lib/data.ts
                        <br />
                        git commit -m "Update app data and settings"
                        <br />
                        git push
                      </div>
                      <p className="text-gray-300 ml-8">This will automatically trigger a new deployment on Vercel.</p>
                    </div>

                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/30">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <span className="bg-purple-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2">
                          4
                        </span>
                        Monitor Deployment
                      </h3>
                      <p className="text-gray-300 ml-8 mb-4">
                        Go to your Vercel dashboard to monitor the deployment progress.
                      </p>
                      <div className="flex ml-8">
                        <a
                          href="https://vercel.com/dashboard"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open Vercel Dashboard
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 border border-yellow-600/30 rounded-lg bg-yellow-900/20">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-300 flex items-center">
                      <span className="text-yellow-300 mr-2">⚠️</span>
                      Important Note
                    </h3>
                    <p className="text-gray-300">
                      This process updates the default data in your application. Any changes made by users in their
                      browsers will still be stored in their local storage. The updated default data will only be used
                      when a user visits your app for the first time or clears their browser data.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="clear-storage">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-gray-800/50 border-purple-700/30">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Clear Local Storage</h2>
                  <p className="text-gray-300 mb-6">Here's how to clear the local storage data from your browser:</p>

                  <div className="space-y-6">
                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/30">
                      <h3 className="text-lg font-semibold mb-2">Method 1: Using Browser Console</h3>
                      <p className="text-gray-300 mb-4">
                        Open your browser's developer tools (F12 or right-click and select "Inspect"), go to the Console
                        tab, and enter one of these commands:
                      </p>
                      <div className="bg-gray-800 p-3 rounded-md font-mono text-sm mb-4">
                        {/* Clear all local storage */}
                        localStorage.clear();
                      </div>
                      <p className="text-gray-300 mb-2">Or to clear only DropX Hub specific data:</p>
                      <div className="bg-gray-800 p-3 rounded-md font-mono text-sm">
                        localStorage.removeItem("dropx-hub-apps");
                        <br />
                        localStorage.removeItem("dropx-hub-settings");
                        <br />
                        localStorage.removeItem("dropx-hub-visitors");
                      </div>
                    </div>

                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/30">
                      <h3 className="text-lg font-semibold mb-2">Method 2: Using Browser Settings</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-300">
                        <li>Open your browser settings</li>
                        <li>Go to Privacy or Privacy and Security section</li>
                        <li>Find "Clear browsing data" or similar option</li>
                        <li>Select "Cookies and site data" or "Local storage"</li>
                        <li>Choose the time range (e.g., "All time")</li>
                        <li>Click "Clear data"</li>
                      </ol>
                      <p className="mt-4 text-gray-300">
                        Note: This will clear data for all websites, not just DropX Hub.
                      </p>
                    </div>

                    <div className="border border-gray-700 rounded-lg p-4 bg-gray-900/30">
                      <h3 className="text-lg font-semibold mb-2">Method 3: Clear Button</h3>
                      <p className="text-gray-300 mb-4">
                        Click the button below to clear all DropX Hub data from your browser's local storage:
                      </p>
                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                          localStorage.removeItem("dropx-hub-apps")
                          localStorage.removeItem("dropx-hub-settings")
                          localStorage.removeItem("dropx-hub-visitors")
                          showNotification(
                            "Local storage cleared successfully! Refresh the page to see changes.",
                            "success",
                          )
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear DropX Hub Data
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 p-4 border border-yellow-600/30 rounded-lg bg-yellow-900/20">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-300 flex items-center">
                      <span className="text-yellow-300 mr-2">⚠️</span>
                      Warning
                    </h3>
                    <p className="text-gray-300">
                      Clearing local storage will reset all your app data to the default values. This action cannot be
                      undone. After clearing, you'll need to refresh the page to see the changes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

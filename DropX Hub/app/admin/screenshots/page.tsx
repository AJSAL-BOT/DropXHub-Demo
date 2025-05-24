"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { useStore } from "@/lib/store-context"
import type { AppType } from "@/lib/types"

export default function ScreenshotsPage() {
  const { apps, updateApp } = useStore()
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null)
  const [appScreenshots, setAppScreenshots] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newScreenshotUrl, setNewScreenshotUrl] = useState("")
  const [screenshotToDelete, setScreenshotToDelete] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredApps = apps.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    if (selectedApp) {
      setAppScreenshots(selectedApp.screenshots || [])
    } else {
      setAppScreenshots([])
    }
  }, [selectedApp])

  const handleSelectApp = (app: AppType) => {
    setSelectedApp(app)
  }

  const handleAddScreenshot = () => {
    if (!newScreenshotUrl.trim()) return

    setAppScreenshots([...appScreenshots, newScreenshotUrl])
    setNewScreenshotUrl("")
    setIsAddDialogOpen(false)
  }

  const handleDeleteScreenshot = () => {
    if (screenshotToDelete === null) return

    const updatedScreenshots = [...appScreenshots]
    updatedScreenshots.splice(screenshotToDelete, 1)
    setAppScreenshots(updatedScreenshots)
    setIsDeleteDialogOpen(false)
    setScreenshotToDelete(null)
  }

  const openDeleteDialog = (index: number) => {
    setScreenshotToDelete(index)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveChanges = () => {
    if (!selectedApp) return

    const updatedApp = {
      ...selectedApp,
      screenshots: appScreenshots,
    }

    updateApp(updatedApp)
    alert("Screenshots saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700/50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Manage Screenshots
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* App Selection Panel */}
          <div className="md:col-span-1">
            <Card className="bg-gray-800/50 border-purple-700/30">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Select App</h2>
                <div className="mb-4">
                  <Input
                    placeholder="Search apps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700/50 border-gray-600"
                  />
                </div>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {filteredApps.map((app) => (
                    <div
                      key={app.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedApp?.id === app.id
                          ? "bg-purple-900/50 border border-purple-500"
                          : "bg-gray-700/30 border border-gray-700 hover:bg-gray-700/50"
                      }`}
                      onClick={() => handleSelectApp(app)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0">
                          <Image src={app.logo || "/placeholder.svg"} alt={app.name} fill className="object-contain" />
                        </div>
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-xs text-gray-400">
                            {app.screenshots?.length || 0} screenshot{app.screenshots?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredApps.length === 0 && <div className="text-center py-4 text-gray-400">No apps found</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Screenshots Panel */}
          <div className="md:col-span-2">
            <Card className="bg-gray-800/50 border-purple-700/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">
                    {selectedApp ? `Screenshots for ${selectedApp.name}` : "Select an app to manage screenshots"}
                  </h2>
                  {selectedApp && (
                    <div className="flex gap-2">
                      <Button
                        className="bg-purple-600 hover:bg-purple-500"
                        onClick={() => setIsAddDialogOpen(true)}
                        disabled={!selectedApp}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Screenshot
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-500"
                        onClick={handleSaveChanges}
                        disabled={!selectedApp}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                {selectedApp ? (
                  appScreenshots.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {appScreenshots.map((screenshot, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="relative group"
                        >
                          <div className="relative h-64 rounded-lg overflow-hidden border border-gray-700">
                            <Image
                              src={screenshot || "/placeholder.svg"}
                              alt={`Screenshot ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => openDeleteDialog(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ImageIcon className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                      <p className="text-gray-400">No screenshots found for this app.</p>
                      <Button
                        className="mt-4 bg-purple-600 hover:bg-purple-500"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        Add First Screenshot
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">Select an app from the left panel to manage its screenshots.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Screenshot Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Screenshot</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <Input
                placeholder="Enter screenshot URL"
                value={newScreenshotUrl}
                onChange={(e) => setNewScreenshotUrl(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
              {newScreenshotUrl && (
                <div className="relative h-48 rounded-lg overflow-hidden border border-gray-700">
                  <Image src={newScreenshotUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleAddScreenshot}>
              Add Screenshot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Screenshot Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Screenshot</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this screenshot? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {screenshotToDelete !== null && appScreenshots[screenshotToDelete] && (
            <div className="py-4">
              <div className="relative h-48 rounded-lg overflow-hidden border border-gray-700">
                <Image
                  src={appScreenshots[screenshotToDelete] || "/placeholder.svg"}
                  alt="Screenshot to delete"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteScreenshot}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Screenshot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

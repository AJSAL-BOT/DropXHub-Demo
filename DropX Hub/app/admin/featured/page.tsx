"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useStore } from "@/lib/store-context"
import type { AppType } from "@/lib/types"

export default function FeaturedAppsPage() {
  const { apps, settings, updateFeaturedApps } = useStore()
  const [featuredApps, setFeaturedApps] = useState<AppType[]>([])
  const [availableApps, setAvailableApps] = useState<AppType[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Get the featured apps
    const featured = settings.featuredApps
      .map((id) => apps.find((app) => app.id === id))
      .filter((app): app is AppType => app !== undefined && app.status === "published")

    setFeaturedApps(featured)

    // Get the available apps (published apps that are not featured)
    const available = apps.filter((app) => app.status === "published" && !settings.featuredApps.includes(app.id))

    setAvailableApps(available)
  }, [apps, settings.featuredApps])

  const handleDragStart = (index: number) => {
    setDraggedItem(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedItem === null) return

    const newFeaturedApps = [...featuredApps]
    const draggedItemValue = newFeaturedApps[draggedItem]

    // Remove the dragged item
    newFeaturedApps.splice(draggedItem, 1)
    // Add it at the new position
    newFeaturedApps.splice(index, 0, draggedItemValue)

    setFeaturedApps(newFeaturedApps)
    setDraggedItem(index)
    setHasChanges(true)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleSaveOrder = () => {
    // Update the featured apps in the store
    updateFeaturedApps(featuredApps.map((app) => app.id))
    setHasChanges(false)
  }

  const handleAddToFeatured = (app: AppType) => {
    setFeaturedApps([...featuredApps, app])
    setAvailableApps(availableApps.filter((a) => a.id !== app.id))
    setHasChanges(true)
    setIsAddDialogOpen(false)
  }

  const handleRemoveFromFeatured = (app: AppType) => {
    setFeaturedApps(featuredApps.filter((a) => a.id !== app.id))
    setAvailableApps([...availableApps, app])
    setHasChanges(true)
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
              Manage Featured Apps
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add App
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveOrder} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-purple-700/30 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Featured Apps</h2>
            <p className="text-gray-400 mb-6">
              Drag and drop to reorder. These apps will be displayed in the slider on the home page.
            </p>

            <div className="space-y-4">
              {featuredApps.length > 0 ? (
                featuredApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-center">
                      <div className="mr-2 text-gray-500">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="relative h-12 w-12 mr-4">
                        <Image src={app.logo || "/placeholder.svg"} alt={app.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{app.name}</h3>
                        <p className="text-sm text-gray-400">
                          {app.category} • v{app.version}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 border-gray-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800"
                        onClick={() => handleRemoveFromFeatured(app)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No featured apps. Add some apps to the featured section!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Featured App Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add Featured App</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {availableApps.length > 0 ? (
                availableApps.map((app) => (
                  <div
                    key={app.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={() => handleAddToFeatured(app)}
                  >
                    <div className="flex items-center">
                      <div className="relative h-12 w-12 mr-4">
                        <Image src={app.logo || "/placeholder.svg"} alt={app.name} fill className="object-contain" />
                      </div>
                      <div>
                        <h3 className="font-bold">{app.name}</h3>
                        <p className="text-sm text-gray-400">
                          {app.category} • v{app.version}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No more apps available to feature.</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

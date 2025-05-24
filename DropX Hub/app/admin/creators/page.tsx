"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2, Edit, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { v4 as uuidv4 } from "uuid"
import type { CreatorType } from "@/lib/types"
import { useAdminAuth } from "@/lib/hooks/use-admin-auth"

export default function CreatorsPage() {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const { settings, addCreator, updateCreator, deleteCreator } = useStore()
  const [creators, setCreators] = useState<CreatorType[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCreator, setCurrentCreator] = useState<CreatorType | null>(null)
  const [newCreator, setNewCreator] = useState<CreatorType>({
    id: "",
    name: "",
    link: "",
    description: "",
    image: "/placeholder.svg?height=400&width=400",
  })

  const updateCreators = useCallback(() => {
    setCreators(settings.creators)
  }, [settings.creators])

  useEffect(() => {
    updateCreators()
  }, [updateCreators])

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

  const handleNewCreatorChange = (e) => {
    const { name, value } = e.target
    setNewCreator((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCurrentCreatorChange = (e) => {
    const { name, value } = e.target
    if (currentCreator) {
      setCurrentCreator({
        ...currentCreator,
        [name]: value,
      })
    }
  }

  const handleAddCreator = () => {
    const creatorToAdd = {
      ...newCreator,
      id: uuidv4(),
    }

    addCreator(creatorToAdd)
    setIsAddDialogOpen(false)
    setNewCreator({
      id: "",
      name: "",
      link: "",
      description: "",
      image: "/placeholder.svg?height=400&width=400",
    })
  }

  const handleEditCreator = () => {
    if (!currentCreator) return
    updateCreator(currentCreator)
    setIsEditDialogOpen(false)
    setCurrentCreator(null)
  }

  const handleDeleteCreator = () => {
    if (!currentCreator) return
    deleteCreator(currentCreator.id)
    setIsDeleteDialogOpen(false)
    setCurrentCreator(null)
  }

  const openEditDialog = (creator: CreatorType) => {
    setCurrentCreator(creator)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (creator: CreatorType) => {
    setCurrentCreator(creator)
    setIsDeleteDialogOpen(true)
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
              Manage Creators
            </h1>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Creator
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creators.length > 0 ? (
            creators.map((creator) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gray-800/50 border-purple-700/30 overflow-hidden h-full">
                  <div className="relative h-48 bg-gradient-to-br from-purple-900/50 to-gray-900">
                    <Image src={creator.image || "/placeholder.svg"} alt={creator.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-bold">{creator.name}</h2>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-300 mb-6">{creator.description}</p>
                    <div className="flex items-center justify-between">
                      <a
                        href={creator.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors"
                      >
                        <Youtube className="h-4 w-4" />
                        YouTube
                      </a>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-gray-700"
                          onClick={() => openEditDialog(creator)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-gray-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800"
                          onClick={() => openDeleteDialog(creator)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-400">No creators found. Add your first creator!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Creator Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Creator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Creator Name</Label>
              <Input
                id="name"
                name="name"
                value={newCreator.name}
                onChange={handleNewCreatorChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">YouTube Link</Label>
              <Input
                id="link"
                name="link"
                value={newCreator.link}
                onChange={handleNewCreatorChange}
                className="bg-gray-700 border-gray-600"
                placeholder="https://www.youtube.com/@channel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={newCreator.image}
                onChange={handleNewCreatorChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newCreator.description}
                onChange={handleNewCreatorChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleAddCreator}>
              Add Creator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Creator Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Creator</DialogTitle>
          </DialogHeader>
          {currentCreator && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Creator Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentCreator.name}
                  onChange={handleCurrentCreatorChange}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link">YouTube Link</Label>
                <Input
                  id="edit-link"
                  name="link"
                  value={currentCreator.link}
                  onChange={handleCurrentCreatorChange}
                  className="bg-gray-700 border-gray-600"
                  placeholder="https://www.youtube.com/@channel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  name="image"
                  value={currentCreator.image}
                  onChange={handleCurrentCreatorChange}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={currentCreator.description}
                  onChange={handleCurrentCreatorChange}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleEditCreator}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Creator Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Creator</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this creator? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentCreator && (
            <div className="py-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-md overflow-hidden">
                  <Image
                    src={currentCreator.image || "/placeholder.svg"}
                    alt={currentCreator.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{currentCreator.name}</h3>
                  <p className="text-sm text-gray-400">{currentCreator.link}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteCreator}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Creator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

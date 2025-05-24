"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Trash2, Edit } from "lucide-react"
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
import type { CategoryType } from "@/lib/types"

export default function CategoriesPage() {
  const { settings, addCategory, updateCategory, deleteCategory } = useStore()
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null)
  const [newCategory, setNewCategory] = useState<CategoryType>({
    id: "",
    name: "",
    slug: "",
    description: "",
  })
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  useEffect(() => {
    setCategories(settings.categories)
  }, [settings.categories])

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target

    // Auto-generate slug from name if name is being changed
    if (name === "name") {
      setNewCategory((prev) => ({
        ...prev,
        [name]: value,
        slug: value.toLowerCase().replace(/\s+/g, "-"),
      }))
    } else {
      setNewCategory((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleCurrentCategoryChange = (e) => {
    const { name, value } = e.target

    // Auto-generate slug from name if name is being changed
    if (name === "name" && currentCategory) {
      setCurrentCategory({
        ...currentCategory,
        [name]: value,
        slug: value.toLowerCase().replace(/\s+/g, "-"),
      })
    } else if (currentCategory) {
      setCurrentCategory({
        ...currentCategory,
        [name]: value,
      })
    }
  }

  const handleAddCategory = () => {
    const categoryToAdd = {
      ...newCategory,
      id: uuidv4(),
    }

    addCategory(categoryToAdd)
    setIsAddDialogOpen(false)
    setNewCategory({
      id: "",
      name: "",
      slug: "",
      description: "",
    })
  }

  const handleEditCategory = () => {
    if (!currentCategory) return
    updateCategory(currentCategory)
    setIsEditDialogOpen(false)
    setCurrentCategory(null)
  }

  const handleDeleteCategory = () => {
    if (!currentCategory) return
    deleteCategory(currentCategory.id)
    setIsDeleteDialogOpen(false)
    setCurrentCategory(null)
  }

  const openEditDialog = (category: CategoryType) => {
    setCurrentCategory(category)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (category: CategoryType) => {
    setCurrentCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleDragStart = (index: number) => {
    setDraggedItem(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedItem === null) return

    const newCategories = [...categories]
    const draggedItemValue = newCategories[draggedItem]

    // Remove the dragged item
    newCategories.splice(draggedItem, 1)
    // Add it at the new position
    newCategories.splice(index, 0, draggedItemValue)

    setCategories(newCategories)
    setDraggedItem(index)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    // Update the store with the new order
    categories.forEach((category, index) => {
      updateCategory({
        ...category,
      })
    })
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
              Manage Categories
            </h1>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Category
          </Button>
        </div>

        <Card className="bg-gray-800/50 border-purple-700/30">
          <CardContent className="p-6">
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/50 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{category.name}</h3>
                        <p className="text-sm text-gray-400">Slug: {category.slug}</p>
                        {category.description && <p className="text-sm text-gray-300 mt-2">{category.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 border-gray-700"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0 border-gray-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800"
                          onClick={() => openDeleteDialog(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No categories found. Add your first category!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleNewCategoryChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={newCategory.slug}
                onChange={handleNewCategoryChange}
                className="bg-gray-700 border-gray-600"
              />
              <p className="text-xs text-gray-400">
                The slug is used in URLs and is automatically generated from the name.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleNewCategoryChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {currentCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Category Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleCurrentCategoryChange}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  name="slug"
                  value={currentCategory.slug}
                  onChange={handleCurrentCategoryChange}
                  className="bg-gray-700 border-gray-600"
                />
                <p className="text-xs text-gray-400">
                  The slug is used in URLs and is automatically generated from the name.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={currentCategory.description || ""}
                  onChange={handleCurrentCategoryChange}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleEditCategory}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="py-4">
              <h3 className="font-bold">{currentCategory.name}</h3>
              <p className="text-sm text-gray-400">Slug: {currentCategory.slug}</p>
              {currentCategory.description && (
                <p className="text-sm text-gray-300 mt-2">{currentCategory.description}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteCategory}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

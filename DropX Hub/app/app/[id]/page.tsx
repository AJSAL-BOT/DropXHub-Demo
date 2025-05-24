"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Share2, Star, Send, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store-context"
import ScreenshotPreview from "@/components/screenshot-preview"
import { v4 as uuidv4 } from "uuid"

export default function AppDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { apps, addReview, incrementDownloads } = useStore()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    rating: 5,
    comment: "",
  })
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: "" })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Find the app from the store
    const foundApp = apps.find((a) => a.id === params.id)

    if (foundApp) {
      setApp(foundApp)
    } else {
      // App not found, redirect to home
      router.push("/")
    }

    setLoading(false)
  }, [params.id, router, apps])

  const handleDownload = () => {
    if (app && app.downloadUrl) {
      // Increment download count
      incrementDownloads(app.id)

      // Open the download URL
      window.open(app.downloadUrl, "_blank", "noopener,noreferrer")
    } else if (app && app.websiteUrl) {
      // If no download URL but website URL exists, open the website
      window.open(app.websiteUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: app.name,
        text: `Check out ${app.name} on DropX Hub!`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleReviewChange = (e) => {
    const { name, value } = e.target
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      rating,
    }))
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!newReview.name || !newReview.email || !newReview.comment) {
      setSubmitStatus({
        success: false,
        message: "Please fill out all fields",
      })
      return
    }

    // Create new review
    const review = {
      id: uuidv4(),
      name: newReview.name,
      email: newReview.email,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
    }

    // Add the review to the app
    addReview(app.id, review)

    // Reset form
    setNewReview({
      name: "",
      email: "",
      rating: 5,
      comment: "",
    })

    setSubmitStatus({
      success: true,
      message: "Review submitted successfully!",
    })

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSubmitStatus({ success: false, message: "" })
    }, 3000)
  }

  const openScreenshotPreview = (index) => {
    setPreviewIndex(index)
    setIsPreviewOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 flex items-center justify-center">
        <div className="h-16 w-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!app) return null

  // Format dates
  const releaseDate = app.releaseDate || new Date().toISOString()
  const updatedDate = app.updatedDate || releaseDate

  // Format dates for display
  const formattedReleaseDate = new Date(releaseDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const formattedUpdatedDate = new Date(updatedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Check if screenshots array exists and has valid items
  const hasValidScreenshots =
    app.screenshots &&
    Array.isArray(app.screenshots) &&
    app.screenshots.length > 0 &&
    app.screenshots.some((url) => url && typeof url === "string")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            App Details
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 border border-purple-700/30 rounded-xl p-6 flex flex-col items-center backdrop-blur-sm"
            >
              <div className="relative h-48 w-48 mb-6">
                <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-xl"></div>
                <Image
                  src={
                    imageError
                      ? "/placeholder.svg?height=200&width=200"
                      : app.logo || "/placeholder.svg?height=200&width=200"
                  }
                  alt={app.name}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2">{app.name}</h2>
              <p className="text-gray-400 text-center mb-4">{app.developer}</p>

              <div className="flex gap-2 mb-6">
                <Badge className="bg-purple-600">{app.category}</Badge>
                <Badge variant="outline" className="border-purple-500 text-purple-400">
                  v{app.version}
                </Badge>
              </div>

              <div className="flex items-center gap-1 text-yellow-400 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-5 w-5 ${star <= app.rating ? "fill-yellow-400" : ""}`} />
                ))}
                <span className="ml-2 text-gray-300">({app.reviews})</span>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                {(app.downloadUrl || app.websiteUrl) && (
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-700/20 w-full"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-900/30 w-full"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="bg-gray-800/50 border border-purple-700/30 w-full">
                  <TabsTrigger value="description" className="flex-1">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="screenshots" className="flex-1">
                    Screenshots
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                  <div className="bg-gray-800/50 border border-purple-700/30 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4">About this app</h3>
                    <div className="text-gray-300 mb-4 whitespace-pre-line">{app.description}</div>

                    {app.whatsNew && (
                      <>
                        <h4 className="text-lg font-bold mt-6 mb-3">What's New</h4>
                        <div className="text-gray-300 whitespace-pre-line">{app.whatsNew}</div>
                      </>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Size</p>
                          <p className="text-white">{app.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Updated</p>
                          <p className="text-white">{formattedUpdatedDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Downloads</p>
                          <p className="text-white">{app.downloads?.toLocaleString() || "0"}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Released</p>
                          <p className="text-white">{formattedReleaseDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Current Version</p>
                          <p className="text-white">v{app.version}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="screenshots" className="mt-6">
                  <div className="bg-gray-800/50 border border-purple-700/30 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4">Screenshots</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hasValidScreenshots
                        ? app.screenshots.map((screenshot, index) =>
                            screenshot && typeof screenshot === "string" ? (
                              <div
                                key={index}
                                className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
                                onClick={() => openScreenshotPreview(index)}
                              >
                                <Image
                                  src={screenshot || "/placeholder.svg"}
                                  alt={`Screenshot ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = `/placeholder.svg?height=600&width=300&text=Screenshot+${index + 1}`
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Maximize2 className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            ) : null,
                          )
                        : [1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative h-64 rounded-lg overflow-hidden">
                              <Image
                                src={`/placeholder.svg?height=600&width=300&text=Screenshot+${i}`}
                                alt={`Screenshot ${i}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="bg-gray-800/50 border border-purple-700/30 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold mb-4">User Reviews</h3>

                    {/* Review submission form */}
                    <div className="mb-8 p-4 border border-purple-700/30 rounded-lg bg-gray-900/50">
                      <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={newReview.name}
                              onChange={handleReviewChange}
                              className="bg-gray-800/50 border-gray-700"
                              placeholder="Your name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={newReview.email}
                              onChange={handleReviewChange}
                              className="bg-gray-800/50 border-gray-700"
                              placeholder="Your email"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Rating</Label>
                          <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRatingChange(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-6 w-6 ${star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="comment">Review</Label>
                          <Textarea
                            id="comment"
                            name="comment"
                            value={newReview.comment}
                            onChange={handleReviewChange}
                            className="bg-gray-800/50 border-gray-700 min-h-[100px]"
                            placeholder="Write your review here..."
                          />
                        </div>

                        {submitStatus.message && (
                          <div
                            className={`p-2 rounded ${submitStatus.success ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
                          >
                            {submitStatus.message}
                          </div>
                        )}

                        <Button type="submit" className="bg-purple-600 hover:bg-purple-500">
                          <Send className="mr-2 h-4 w-4" /> Submit Review
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      {app.reviewsList && app.reviewsList.length > 0 ? (
                        app.reviewsList.map((review) => (
                          <div key={review.id} className="border-b border-gray-700 pb-4 last:border-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center">
                                <span>{review.name[0]}</span>
                              </div>
                              <span className="font-medium">{review.name}</span>
                              {review.date && <span className="text-xs text-gray-400 ml-2">{review.date}</span>}
                              <div className="flex ml-auto">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300 whitespace-pre-line">{review.comment}</p>

                            {review.adminReply && (
                              <div className="mt-3 ml-6 p-3 bg-purple-900/30 border-l-2 border-purple-500 rounded">
                                <p className="text-sm font-semibold text-purple-300">Admin Reply:</p>
                                <p className="text-sm text-gray-300 whitespace-pre-line">{review.adminReply}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Screenshot Preview Dialog - Only show if there are valid screenshots */}
      {hasValidScreenshots && (
        <ScreenshotPreview
          screenshots={app.screenshots.filter((url) => url && typeof url === "string")}
          initialIndex={previewIndex}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      )}
    </div>
  )
}

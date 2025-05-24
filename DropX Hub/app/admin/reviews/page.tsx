"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, MessageSquare, Trash2, Star, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
import type { AppType, ReviewType } from "@/lib/types"

export default function ReviewsPage() {
  const { apps, updateReview, deleteReview, replyToReview } = useStore()
  const [allReviews, setAllReviews] = useState<{ app: AppType; review: ReviewType }[]>([])
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState<{ app: AppType; review: ReviewType } | null>(null)
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    // Collect all reviews from all apps
    const reviews = apps.reduce<{ app: AppType; review: ReviewType }[]>((acc, app) => {
      if (app.reviewsList && app.reviewsList.length > 0) {
        const appReviews = app.reviewsList.map((review) => ({
          app,
          review,
        }))
        return [...acc, ...appReviews]
      }
      return acc
    }, [])

    // Sort by date (newest first)
    reviews.sort((a, b) => {
      const dateA = new Date(a.review.date).getTime()
      const dateB = new Date(b.review.date).getTime()
      return dateB - dateA
    })

    setAllReviews(reviews)
  }, [apps])

  const openReplyDialog = (appReview: { app: AppType; review: ReviewType }) => {
    setCurrentReview(appReview)
    setReplyText(appReview.review.adminReply || "")
    setIsReplyDialogOpen(true)
  }

  const openDeleteDialog = (appReview: { app: AppType; review: ReviewType }) => {
    setCurrentReview(appReview)
    setIsDeleteDialogOpen(true)
  }

  const handleReply = () => {
    if (!currentReview) return

    replyToReview(currentReview.app.id, currentReview.review.id, replyText)
    setIsReplyDialogOpen(false)
    setCurrentReview(null)
    setReplyText("")
  }

  const handleDeleteReview = () => {
    if (!currentReview) return

    deleteReview(currentReview.app.id, currentReview.review.id)
    setIsDeleteDialogOpen(false)
    setCurrentReview(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 hover:bg-gray-700/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Manage Reviews
          </h1>
        </div>

        <Card className="bg-gray-800/50 border-purple-700/30">
          <CardContent className="p-6">
            <div className="space-y-6">
              {allReviews.length > 0 ? (
                allReviews.map(({ app, review }) => (
                  <motion.div
                    key={review.id}
                    className="border border-gray-700 rounded-lg p-4 bg-gray-800/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image src={app.logo || "/placeholder.svg"} alt={app.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold">{app.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400">{review.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-gray-700 text-gray-300 hover:bg-purple-900/20 hover:text-purple-300"
                              onClick={() => openReplyDialog({ app, review })}
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-gray-700 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800"
                              onClick={() => openDeleteDialog({ app, review })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-gray-300">{review.comment}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium">{review.name}</span>
                            {review.email && <span className="text-xs text-gray-400">({review.email})</span>}
                          </div>
                        </div>
                        {review.adminReply && (
                          <div className="mt-3 ml-4 p-3 bg-purple-900/30 border-l-2 border-purple-500 rounded">
                            <p className="text-sm font-semibold text-purple-300">Admin Reply:</p>
                            <p className="text-sm text-gray-300">{review.adminReply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">No reviews found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
          </DialogHeader>
          {currentReview && (
            <div className="py-4">
              <div className="mb-4 p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= currentReview.review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{currentReview.review.date}</span>
                </div>
                <p className="text-gray-300">{currentReview.review.comment}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium">{currentReview.review.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply here..."
                  className="bg-gray-700 border-gray-600 min-h-[120px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={handleReply}>
              Submit Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Review Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentReview && (
            <div className="py-4">
              <div className="p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${star <= currentReview.review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{currentReview.review.date}</span>
                </div>
                <p className="text-gray-300">{currentReview.review.comment}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium">{currentReview.review.name}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteReview}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

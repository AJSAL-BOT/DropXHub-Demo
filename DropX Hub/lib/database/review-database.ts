import { appDatabase } from "./app-database"
import type { ReviewType } from "@/lib/types"

export const reviewDatabase = {
  // Get all reviews for an app
  getAll: (appId: string) => {
    const app = appDatabase.getById(appId)
    return app?.reviews || []
  },

  // Get a single review by ID
  getById: (appId: string, reviewId: string) => {
    const app = appDatabase.getById(appId)
    return app?.reviews?.find((review) => review.id === reviewId) || null
  },

  // Add a new review
  add: (appId: string, review: ReviewType) => {
    const app = appDatabase.getById(appId)
    if (app) {
      if (!app.reviews) {
        app.reviews = []
      }
      app.reviews.push(review)
      appDatabase.update(app)
      return review
    }
    return null
  },

  // Update an existing review
  update: (appId: string, review: ReviewType) => {
    const app = appDatabase.getById(appId)
    if (app && app.reviews) {
      const index = app.reviews.findIndex((r) => r.id === review.id)
      if (index !== -1) {
        app.reviews[index] = { ...review }
        appDatabase.update(app)
        return review
      }
    }
    return null
  },

  // Delete a review
  delete: (appId: string, reviewId: string) => {
    const app = appDatabase.getById(appId)
    if (app && app.reviews) {
      const index = app.reviews.findIndex((review) => review.id === reviewId)
      if (index !== -1) {
        const deleted = app.reviews.splice(index, 1)[0]
        appDatabase.update(app)
        return deleted
      }
    }
    return null
  },

  // Add a reply to a review
  addReply: (appId: string, reviewId: string, reply: string) => {
    const app = appDatabase.getById(appId)
    if (app && app.reviews) {
      const review = app.reviews.find((r) => r.id === reviewId)
      if (review) {
        review.reply = reply
        review.replyDate = new Date().toISOString()
        appDatabase.update(app)
        return review
      }
    }
    return null
  },
}

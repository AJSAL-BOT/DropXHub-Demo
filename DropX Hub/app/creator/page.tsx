"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Youtube, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store-context"

export default function CreatorPage() {
  const { settings } = useStore()
  const [creators, setCreators] = useState([])
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: "" })

  useEffect(() => {
    // Get creators from the store, with a fallback to an empty array if undefined
    if (settings && settings.creators) {
      setCreators(settings.creators)
    }
  }, [settings])

  const handleApplyFormChange = (e) => {
    const { name, value } = e.target
    setApplicationForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleApplySubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!applicationForm.name || !applicationForm.email || !applicationForm.message) {
      setSubmitStatus({
        success: false,
        message: "Please fill out all fields",
      })
      return
    }

    // Construct mailto URL
    const subject = encodeURIComponent(`Creator Application - ${applicationForm.name}`)
    const body = encodeURIComponent(
      `Name: ${applicationForm.name}\nEmail: ${applicationForm.email}\n\nMessage:\n${applicationForm.message}`,
    )
    const mailtoUrl = `mailto:mail.dropxhub@gmail.com?subject=${subject}&body=${body}`

    // Open email client
    window.location.href = mailtoUrl

    // Reset form
    setApplicationForm({
      name: "",
      email: "",
      message: "",
    })

    setSubmitStatus({
      success: true,
      message: "Email client opened. Please send the email to complete your application.",
    })

    // Clear success message after 5 seconds
    setTimeout(() => {
      setSubmitStatus({ success: false, message: "" })
      setIsApplyDialogOpen(false)
    }, 5000)
  }

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
            Our Creators
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-gray-300 text-center mb-12">
            DropX Hub is proudly brought to you by these amazing content creators. Check out their channels for
            tutorials, tips, and more!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {creators && creators.length > 0 ? (
              creators.map((creator) => (
                <Card key={creator.id} className="bg-gray-800/50 border-purple-700/30 overflow-hidden">
                  <div className="relative h-48 bg-gradient-to-br from-purple-900/50 to-gray-900">
                    <Image
                      src={creator.image || "/placeholder.svg?height=200&width=200"}
                      alt={creator.name || "Creator"}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-bold">{creator.name}</h2>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-300 mb-6">{creator.description}</p>
                    <a
                      href={creator.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Youtube className="h-5 w-5" />
                      Visit YouTube Channel
                    </a>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-400">No creators found.</p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-xl font-bold mb-4">Want to become a creator?</h3>
            <p className="text-gray-300 mb-6">
              If you're interested in publishing your apps on DropX Hub, we'd love to hear from you!
            </p>
            <Button className="bg-purple-600 hover:bg-purple-500" onClick={() => setIsApplyDialogOpen(true)}>
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      {/* Apply Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Apply to Become a Creator</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplySubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={applicationForm.name}
                onChange={handleApplyFormChange}
                className="bg-gray-700 border-gray-600"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={applicationForm.email}
                onChange={handleApplyFormChange}
                className="bg-gray-700 border-gray-600"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Tell us about yourself and your apps</Label>
              <Textarea
                id="message"
                name="message"
                value={applicationForm.message}
                onChange={handleApplyFormChange}
                className="bg-gray-700 border-gray-600 min-h-[150px]"
                placeholder="Share details about your experience, the apps you've created, and why you'd like to join DropX Hub..."
              />
            </div>

            {submitStatus.message && (
              <div
                className={`p-3 rounded ${submitStatus.success ? "bg-green-900/50 text-green-300" : "bg-red-900/50 text-red-300"}`}
              >
                {submitStatus.message}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsApplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-500">
                <Mail className="mr-2 h-4 w-4" /> Send Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

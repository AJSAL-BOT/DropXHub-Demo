"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScreenshotPreviewProps {
  screenshots: string[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ScreenshotPreview({
  screenshots,
  initialIndex = 0,
  open,
  onOpenChange,
}: ScreenshotPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [imageError, setImageError] = useState(false)

  // Reset current index when the dialog opens or initialIndex changes
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
      setImageError(false)
    }
  }, [open, initialIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
    setImageError(false)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Filter out any invalid screenshots
  const validScreenshots = screenshots.filter((url) => url && typeof url === "string")

  // If there are no valid screenshots, don't render the component
  if (!validScreenshots.length) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-gray-900/95 border-purple-700/30">
        <div className="relative h-[80vh] w-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70 z-10"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 z-10"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="relative h-full w-full flex items-center justify-center p-4">
            {imageError ? (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <p>Image could not be loaded</p>
                <p className="text-sm mt-2">
                  Screenshot {currentIndex + 1} of {validScreenshots.length}
                </p>
              </div>
            ) : (
              <Image
                src={
                  validScreenshots[currentIndex] ||
                  `/placeholder.svg?height=800&width=400&text=Screenshot+${currentIndex + 1}`
                }
                alt={`Screenshot ${currentIndex + 1}`}
                fill
                className="object-contain"
                onError={handleImageError}
              />
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 z-10"
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {validScreenshots.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

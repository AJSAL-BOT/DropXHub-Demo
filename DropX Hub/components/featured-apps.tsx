"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"

export function FeaturedApps() {
  const { getFeaturedApps } = useStore()
  const [featuredApps, setFeaturedApps] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    const apps = getFeaturedApps()
    setFeaturedApps(apps)

    // Auto-slide every 5 seconds
    intervalRef.current = setInterval(() => {
      handleNext()
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [getFeaturedApps])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? featuredApps.length - 1 : prevIndex - 1))

    // Reset the interval when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        handleNext()
      }, 5000)
    }
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex === featuredApps.length - 1 ? 0 : prevIndex + 1))

    // Reset the interval when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        handleNext()
      }, 5000)
    }
  }

  if (!featuredApps || featuredApps.length === 0) {
    return null
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const currentApp = featuredApps[currentIndex]

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-purple-950 border border-purple-700/30">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20 z-0"></div>

      <div className="relative h-[300px] md:h-[400px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col md:flex-row items-center p-6 md:p-10"
          >
            <div className="relative h-32 w-32 md:h-48 md:w-48 flex-shrink-0 mb-4 md:mb-0 md:mr-8">
              <Image
                src={currentApp.logo || "/placeholder.svg"}
                alt={currentApp.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentApp.name}</h2>
              <p className="text-gray-300 mb-4 line-clamp-3">{currentApp.description}</p>
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                {currentApp.hashtags?.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              <Link href={`/app/${currentApp.id}`}>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  View Details
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {featuredApps.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-purple-500" : "bg-gray-600"}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  )
}

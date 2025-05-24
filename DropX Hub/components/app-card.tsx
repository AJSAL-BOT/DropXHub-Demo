"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { AppType } from "@/lib/types"

interface AppCardProps {
  app: AppType
}

export default function AppCard({ app }: AppCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (app.downloadUrl) {
      window.open(app.downloadUrl, "_blank")
    }
  }

  return (
    <Link href={`/app/${app.id}`}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="overflow-hidden bg-gray-800/50 border-purple-700/30 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm h-full">
          <div className="relative h-32 sm:h-40 w-full bg-gradient-to-br from-purple-900/50 to-gray-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-800/20 via-transparent to-transparent"></div>
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              <Image
                src={app.logo || "/placeholder.svg"}
                alt={app.name || "App"}
                fill
                className="object-contain p-4"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            </motion.div>
            <Badge className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-500">v{app.version || "1.0"}</Badge>
          </div>
          <CardContent className="p-3 sm:p-4">
            <div className="flex justify-between items-start mb-1 sm:mb-2">
              <h3 className="font-bold text-sm sm:text-lg text-white">{app.name || "App Name"}</h3>
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleDownload}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button size="sm" className="bg-purple-600 hover:bg-purple-500 h-7 w-7 sm:h-8 sm:w-8 p-0">
                  <Download size={14} />
                </Button>
              </motion.div>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
              {app.description || "No description available"}
            </p>
            <motion.div
              className="flex gap-1 sm:gap-2 mt-2 sm:mt-3 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                {app.category || "Uncategorized"}
              </Badge>
              <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                {app.size || "Unknown"}
              </Badge>
              {app.hashtags && app.hashtags.length > 0 && (
                <Badge variant="outline" className="text-xs border-blue-700/50 text-blue-400">
                  #{app.hashtags[0]}
                </Badge>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Code, Download, Star, Users, Shield, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store-context"

export default function AboutPage() {
  const { settings } = useStore()
  const [siteName, setSiteName] = useState("")
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setSiteName(settings.siteName)
  }, [settings.siteName])

  const features = [
    {
      icon: <Code className="h-10 w-10 text-purple-400" />,
      title: "Developer Friendly",
      description: "Built with developers in mind, making it easy to showcase and distribute your applications.",
    },
    {
      icon: <Download className="h-10 w-10 text-purple-400" />,
      title: "Easy Downloads",
      description: "Simple and straightforward download process for all applications.",
    },
    {
      icon: <Star className="h-10 w-10 text-purple-400" />,
      title: "User Reviews",
      description: "Get valuable feedback from users to improve your applications.",
    },
    {
      icon: <Users className="h-10 w-10 text-purple-400" />,
      title: "Creator Community",
      description: "Join a community of passionate developers and creators.",
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-400" />,
      title: "Secure Platform",
      description: "All applications are verified for security and quality.",
    },
    {
      icon: <Mail className="h-10 w-10 text-purple-400" />,
      title: "Direct Support",
      description: "Get direct support from our team for any issues or questions.",
    },
  ]

  const teamMembers = [
    {
      name: "Ajsal",
      role: "Founder & Lead Developer",
      image: "/placeholder.svg?height=300&width=300",
      bio: "Passionate about creating tools that help developers showcase their work.",
    },
    {
      name: "DropX Team",
      role: "Development & Support",
      image: "/placeholder.svg?height=300&width=300",
      bio: "A dedicated team working to make DropX Hub the best platform for app distribution.",
    },
  ]

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
            About {siteName}
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="relative h-40 w-40 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-xl"></div>
              <Image
                src="https://ik.imagekit.io/ajsal/dropxhub%20web%20logo%20(1).png?updatedAt=1747478632554"
                alt={siteName}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
              DropX Hub
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {siteName} is dedicated to providing a platform where developers can showcase their applications and users
              can discover amazing software. We believe in fostering a community of innovation and creativity.
            </p>
          </motion.div>

          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 border-purple-700/30 h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-4 p-3 bg-purple-900/30 rounded-full">{feature.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <Card className="bg-gray-800/50 border-purple-700/30 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-auto md:w-1/3 bg-gradient-to-br from-purple-900/50 to-gray-900">
                        <Image
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=300&width=300"
                          }}
                        />
                      </div>
                      <CardContent className="p-6 md:w-2/3">
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-purple-400 mb-4">{member.role}</p>
                        <p className="text-gray-300">{member.bio}</p>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-800/50 border border-purple-700/30 rounded-xl p-8 text-center"
            >
              <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
              <p className="text-gray-300 mb-6">Have questions or feedback? We'd love to hear from you!</p>
              <a
                href="mailto:mail.dropxhub@gmail.com"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5" />
                Contact Us
              </a>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  )
}

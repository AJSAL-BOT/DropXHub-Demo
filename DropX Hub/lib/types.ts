export type AppType = {
  id: string
  name: string
  description: string
  logo: string
  category: string
  version: string
  size: string
  creator: string
  downloadUrl: string
  webUrl: string
  screenshots: string[]
  hashtags: string[]
  status: string
  releaseDate: string
  updatedDate: string
  downloads: number
  reviews: ReviewType[]
  developer?: string
  websiteUrl?: string
  whatsNew?: string
  rating?: number
}

export type ReviewType = {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  reply?: string
}

export type CategoryType = {
  id: string
  name: string
  slug: string
  description: string
}

export type CreatorType = {
  id: string
  name: string
  logo: string
  website: string
  description: string
}

export type VisitorType = {
  id: string
  date: string
  page: string
  referrer: string
  userAgent: string
  deviceName?: string
  ipAddress?: string
  action?: string
  visitDate?: string
}

export type AppStoreSettings = {
  siteName: string
  featuredApps: string[]
  categories: CategoryType[]
  creators: CreatorType[]
  siteDescription?: string
  primaryColor?: string
  secondaryColor?: string
  logoUrl?: string
  faviconUrl?: string
}

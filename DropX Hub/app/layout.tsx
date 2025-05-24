import "./globals.css"
import { Inter } from "next/font/google"
import { StoreProvider } from "@/lib/store-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DropX Hub",
  description: "Your one-stop destination for mobile apps",
  icons: {
    icon: "/logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}

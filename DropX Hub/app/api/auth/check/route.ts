import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the cookie from the request
    const cookieHeader = request.headers.get("cookie") || ""
    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim())
    const adminCookie = cookies.find((cookie) => cookie.startsWith("admin_authenticated="))

    // Check if the admin cookie exists and is valid
    if (adminCookie && adminCookie.split("=")[1] === "true") {
      return NextResponse.json({ authenticated: true })
    }

    // If no valid cookie found, return not authenticated
    return NextResponse.json({ authenticated: false })
  } catch (error) {
    console.error("Error checking authentication:", error)
    return NextResponse.json({ authenticated: false, error: "Authentication check failed" }, { status: 500 })
  }
}

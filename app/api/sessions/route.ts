import { type NextRequest, NextResponse } from "next/server"

interface SessionRequest {
  email: string
  businessType: string
  language: string
  aiProvider: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SessionRequest = await request.json()
    const { email, businessType, language, aiProvider } = body

    // Validate required fields
    if (!email || !businessType) {
      return NextResponse.json({ error: "Email and business type are required" }, { status: 400 })
    }

    // Create session object
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      businessType,
      language: language || "en",
      aiProvider: aiProvider || "anthropic",
      status: "active" as const,
      createdAt: new Date(),
    }

    // In a real app, you would save this to a database
    // For now, we'll just return the session
    console.log("Created session:", session)

    return NextResponse.json(session)
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: "Sessions API is working" })
}

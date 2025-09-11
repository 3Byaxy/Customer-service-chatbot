import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { email, businessType, language, aiProvider } = await request.json()

    if (!email || !businessType || !language || !aiProvider) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create or get user
    let user = await dbHelpers.getUserByEmail(email)
    if (!user) {
      user = await dbHelpers.createUser({
        email,
        preferred_language: language,
        business_type: businessType,
      })
    }

    // Create session
    const session = await dbHelpers.createSession({
      user_id: user.id,
      email,
      business_type: businessType,
      language,
      ai_provider: aiProvider,
      status: "active",
      metadata: {
        user_agent: request.headers.get("user-agent"),
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
        timestamp: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      userId: user.id,
      businessType,
      language,
      aiProvider,
      status: "active",
    })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 })
  }

  try {
    const session = await dbHelpers.getSession(sessionId)
    const messages = await dbHelpers.getMessages(sessionId)

    return NextResponse.json({
      session,
      messages,
    })
  } catch (error) {
    console.error("Session retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 })
  }
}

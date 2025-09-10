import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://uckvdxvgdfzhzjqdhztz.supabase.co"
const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja3ZkeHZnZGZ6aHpqcWRoenR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDk5NDIsImV4cCI6MjA3MzAyNTk0Mn0.-3qr1-HRAm3q1va_2rPQTPg5VSKecDhkK4Rs8JzpMSU"

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const { email, businessType, language } = await request.json()

    if (!email || !businessType || !language) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: email, businessType, language",
        },
        { status: 400 },
      )
    }

    // Create or get user
    let { data: user, error: userError } = await supabase.from("users").select("*").eq("email", email).single()

    if (userError && userError.code !== "PGRST116") {
      console.error("User lookup error:", userError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
        },
        { status: 500 },
      )
    }

    if (!user) {
      const { data: newUser, error: createUserError } = await supabase
        .from("users")
        .insert([
          {
            email,
            profile: {
              preferred_language: language,
              business_type: businessType,
            },
          },
        ])
        .select()
        .single()

      if (createUserError) {
        console.error("User creation error:", createUserError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to create user",
          },
          { status: 500 },
        )
      }

      user = newUser
    }

    // Generate a session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // In a real app, you would save this to your database
    const sessionData = {
      sessionId,
      email,
      businessType,
      language,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    // Create new session
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert([
        {
          id: sessionId,
          user_id: user.id,
          business_type: businessType,
          language,
          status: "active",
          context: {
            started_at: new Date().toISOString(),
            user_agent: request.headers.get("user-agent"),
            ip_address: request.headers.get("x-forwarded-for") || "unknown",
          },
        },
      ])
      .select()
      .single()

    if (sessionError) {
      console.error("Session creation error:", sessionError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create session",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: sessionData,
    })
  } catch (error) {
    console.error("Session creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Session ID required",
        },
        { status: 400 },
      )
    }

    const { data: session, error } = await supabase
      .from("sessions")
      .select(`
        *,
        users (
          id,
          email,
          profile
        ),
        messages (
          id,
          sender,
          content,
          timestamp,
          metadata
        )
      `)
      .eq("id", sessionId)
      .single()

    if (error) {
      console.error("Session lookup error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Session not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error("Session lookup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

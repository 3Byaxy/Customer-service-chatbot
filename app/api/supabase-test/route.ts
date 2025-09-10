import { type NextRequest, NextResponse } from "next/server"
import { supabase, dbHelpers } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase.from("users").select("count").limit(1)

    if (connectionError) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionError.message,
        },
        { status: 500 },
      )
    }

    // Test knowledge base search
    const knowledgeResults = await dbHelpers.searchKnowledgeBase("data bundle", "telecom", "en")

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful",
      tests: {
        connection: "OK",
        knowledgeBase: {
          query: "data bundle",
          results: knowledgeResults.length,
          sample: knowledgeResults[0] || null,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Supabase test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Supabase test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case "create_test_session":
        // Create a test user and session
        const testUser = await dbHelpers.createUser("test@example.com", {
          name: "Test User",
          language_preference: "en",
          business_type: "telecom",
        })

        const testSession = await dbHelpers.createSession(testUser.id, "telecom", "en")

        const testMessage = await dbHelpers.createMessage(
          testSession.id,
          "user",
          "Hello, I need help with my data bundle",
          {
            intent: "data_inquiry",
            sentiment: "neutral",
            language_detected: "en",
          },
        )

        return NextResponse.json({
          success: true,
          message: "Test session created successfully",
          data: {
            user: testUser,
            session: testSession,
            message: testMessage,
          },
        })

      case "search_knowledge":
        const { query, businessType, language } = data
        const results = await dbHelpers.searchKnowledgeBase(query, businessType, language)

        return NextResponse.json({
          success: true,
          message: "Knowledge base search completed",
          data: {
            query,
            businessType,
            language,
            results: results.length,
            entries: results,
          },
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unknown action",
          },
          { status: 400 },
        )
    }
  } catch (error) {
    console.error("Supabase POST test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test operation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

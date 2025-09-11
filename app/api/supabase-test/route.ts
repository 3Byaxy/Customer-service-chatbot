import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const connectionTest = await dbHelpers.testConnection()

    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionTest.details,
          message: connectionTest.message,
          fallback: "Using mock database for testing",
        },
        { status: 200 }, // Return 200 even for mock mode
      )
    }

    // Test basic operations
    const testResults = {
      connection: connectionTest,
      operations: {
        createUser: false,
        createSession: false,
        createMessage: false,
        createTicket: false,
      },
    }

    try {
      // Test user creation
      const testUser = await dbHelpers.createUser({
        email: `test_${Date.now()}@example.com`,
        preferred_language: "en",
        business_type: "telecom",
      })
      testResults.operations.createUser = !!testUser.id

      // Test session creation
      const testSession = await dbHelpers.createSession({
        user_id: testUser.id,
        email: testUser.email,
        business_type: "telecom",
        language: "en",
        ai_provider: "mock",
        status: "active",
        metadata: { test: true },
      })
      testResults.operations.createSession = !!testSession.id

      // Test message creation
      const testMessage = await dbHelpers.createMessage({
        session_id: testSession.id,
        role: "user",
        content: "Test message",
        language: "en",
        metadata: { test: true },
      })
      testResults.operations.createMessage = !!testMessage.id

      // Test ticket creation
      const testTicket = await dbHelpers.createTicket({
        session_id: testSession.id,
        user_id: testUser.id,
        title: "Test Ticket",
        description: "This is a test ticket",
        priority: "medium",
        status: "open",
      })
      testResults.operations.createTicket = !!testTicket.id
    } catch (operationError) {
      console.error("Database operation test error:", operationError)
    }

    return NextResponse.json({
      success: true,
      message: "Database tests completed",
      results: testResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Supabase test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
        fallback: "System will use mock database",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case "test_connection":
        const connectionResult = await dbHelpers.testConnection()
        return NextResponse.json(connectionResult)

      case "create_test_data":
        try {
          // Create test user
          const testUser = await dbHelpers.createUser({
            email: data?.email || `test_${Date.now()}@example.com`,
            preferred_language: data?.language || "en",
            business_type: data?.businessType || "telecom",
          })

          // Create test session
          const testSession = await dbHelpers.createSession({
            user_id: testUser.id,
            email: testUser.email,
            business_type: testUser.business_type,
            language: testUser.preferred_language,
            ai_provider: "mock",
            status: "active",
            metadata: { test: true, created_via: "api_test" },
          })

          // Create test messages
          const userMessage = await dbHelpers.createMessage({
            session_id: testSession.id,
            role: "user",
            content: data?.userMessage || "Hello, I need help with my account",
            language: testUser.preferred_language,
            metadata: { test: true },
          })

          const assistantMessage = await dbHelpers.createMessage({
            session_id: testSession.id,
            role: "assistant",
            content:
              data?.assistantMessage ||
              "I'd be happy to help you with your account. What specific issue are you experiencing?",
            language: testUser.preferred_language,
            ai_provider: "mock",
            metadata: { test: true },
          })

          return NextResponse.json({
            success: true,
            message: "Test data created successfully",
            data: {
              user: testUser,
              session: testSession,
              messages: [userMessage, assistantMessage],
            },
          })
        } catch (createError) {
          return NextResponse.json(
            {
              success: false,
              error: "Failed to create test data",
              details: createError instanceof Error ? createError.message : "Unknown error",
            },
            { status: 500 },
          )
        }

      case "cleanup_test_data":
        return NextResponse.json({
          success: true,
          message: "Test data cleanup completed (mock implementation)",
          note: "In production, this would clean up test records",
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Unknown action",
            availableActions: ["test_connection", "create_test_data", "cleanup_test_data"],
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

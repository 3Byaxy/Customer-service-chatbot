import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const businessType = searchParams.get("businessType")
    const language = searchParams.get("language")

    if (query) {
      // Search knowledge base
      const results = await dbHelpers.searchKnowledgeBase(query, businessType || undefined, language || undefined)

      return NextResponse.json({
        success: true,
        data: {
          results,
          query,
          filters: { businessType, language },
        },
      })
    } else {
      // Get all knowledge base entries
      const entries = await dbHelpers.getKnowledgeBaseEntries(businessType || undefined, language || undefined)

      return NextResponse.json({
        success: true,
        data: {
          entries,
          filters: { businessType, language },
        },
      })
    }
  } catch (error) {
    console.error("Knowledge base retrieval error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve knowledge base",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, category, businessType, language, tags } = await request.json()

    if (!title || !content || !category || !businessType || !language) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, content, category, businessType, language",
        },
        { status: 400 },
      )
    }

    const entry = await dbHelpers.createKnowledgeBaseEntry({
      title,
      content,
      category,
      business_type: businessType,
      language,
      tags: tags || [],
    })

    return NextResponse.json({
      success: true,
      data: entry,
    })
  } catch (error) {
    console.error("Knowledge base creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create knowledge base entry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

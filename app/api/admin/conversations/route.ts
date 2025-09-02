import { type NextRequest, NextResponse } from "next/server"
import { approvalSystem } from "@/environment/approval-system"

export async function GET(req: NextRequest) {
  try {
    const conversations = approvalSystem.getActiveConversations()

    return NextResponse.json({
      conversations,
      total: conversations.length,
    })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 })
  }
}

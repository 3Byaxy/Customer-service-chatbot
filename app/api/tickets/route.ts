import { type NextRequest, NextResponse } from "next/server"
import { dbHelpers } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const assignedTo = searchParams.get("assignedTo")

    const filters: any = {}
    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (assignedTo) filters.assigned_to = assignedTo

    const tickets = await dbHelpers.getTickets(filters)

    return NextResponse.json({
      success: true,
      data: {
        tickets,
        filters,
      },
    })
  } catch (error) {
    console.error("Tickets retrieval error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve tickets",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, title, description, priority } = await request.json()

    if (!sessionId || !title || !description || !priority) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: sessionId, title, description, priority",
        },
        { status: 400 },
      )
    }

    const ticket = await dbHelpers.createTicket(sessionId, title, description, priority)

    return NextResponse.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    console.error("Ticket creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create ticket",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticketId = searchParams.get("id")

    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing ticket ID",
        },
        { status: 400 },
      )
    }

    const updates = await request.json()
    const ticket = await dbHelpers.updateTicket(ticketId, updates)

    return NextResponse.json({
      success: true,
      data: ticket,
    })
  } catch (error) {
    console.error("Ticket update error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update ticket",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

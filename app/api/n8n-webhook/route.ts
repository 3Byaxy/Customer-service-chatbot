import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Check if n8n is configured
    if (!process.env.N8N_WEBHOOK_URL) {
      return NextResponse.json({
        success: false,
        message: "n8n webhook not configured",
      })
    }

    // Send data to n8n webhook
    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.N8N_API_KEY || ""}`,
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: "ai-customer-support",
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("n8n Webhook Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send webhook",
      },
      { status: 500 },
    )
  }
}

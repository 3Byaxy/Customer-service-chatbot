import { type NextRequest, NextResponse } from "next/server"
import { approvalSystem } from "@/environment/approval-system"
import { realtimeManager } from "@/environment/realtime-apis"

export async function POST(req: NextRequest) {
  try {
    const { approvalId, action, customResponse, reason, adminId } = await req.json()

    if (action === "approve") {
      const success = approvalSystem.approveRequest(approvalId, adminId, customResponse)

      if (success) {
        // Send real-time notification
        const request = approvalSystem.getPendingApprovals().find((r) => r.id === approvalId)
        if (request) {
          realtimeManager.sendSolutionNotification(request.userId, {
            response: customResponse || request.suggestedResponse,
            approvedBy: adminId,
            timestamp: new Date(),
          })
        }

        return NextResponse.json({ success: true, message: "Request approved" })
      } else {
        return NextResponse.json({ success: false, message: "Failed to approve request" }, { status: 400 })
      }
    } else if (action === "reject") {
      const success = approvalSystem.rejectRequest(approvalId, adminId, reason)

      if (success) {
        return NextResponse.json({ success: true, message: "Request rejected" })
      } else {
        return NextResponse.json({ success: false, message: "Failed to reject request" }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Approval action error:", error)
    return NextResponse.json({ error: "Failed to process approval action" }, { status: 500 })
  }
}

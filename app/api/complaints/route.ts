import type { NextRequest } from "next/server"
import { findRelevantSolution, ALL_COMPLAINTS } from "@/environment/complaints-solutions"
import { complaintTracker } from "@/environment/realtime-apis"
import { voiceIntegration } from "@/environment/voice-integration"

export async function POST(request: NextRequest) {
  try {
    const { complaint, businessType, userId, sessionId, language = "en", generateVoice = false } = await request.json()

    if (!complaint || !businessType) {
      return Response.json({ error: "Complaint and business type are required" }, { status: 400 })
    }

    // Find relevant solution
    const solution = findRelevantSolution(complaint, businessType)

    // Create complaint tracking
    const complaintId = complaintTracker.createComplaint(userId, sessionId, complaint, businessType)

    let voiceResponse = null
    if (generateVoice && solution) {
      // Generate voice response
      voiceResponse = await voiceIntegration.generateBusinessSpeech(solution.solution, businessType, language)
    }

    // Update complaint with solution
    if (solution) {
      complaintTracker.updateComplaint(complaintId, "solution_provided", {
        solutionId: solution.id,
        category: solution.category,
        priority: solution.priority,
        estimatedTime: solution.estimatedTime,
        escalationRequired: solution.escalationRequired,
      })
    } else {
      complaintTracker.updateComplaint(complaintId, "needs_analysis", {
        reason: "No matching solution found",
      })
    }

    return Response.json({
      success: true,
      complaintId,
      solution,
      voiceResponse,
      recommendations: solution
        ? {
            priority: solution.priority,
            estimatedTime: solution.estimatedTime,
            escalationRequired: solution.escalationRequired,
            followUpActions: solution.followUpActions,
          }
        : null,
    })
  } catch (error) {
    console.error("Complaints API error:", error)
    return Response.json(
      {
        error: "Failed to process complaint",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const businessType = searchParams.get("businessType")
  const category = searchParams.get("category")

  try {
    const complaints = ALL_COMPLAINTS

    if (businessType && complaints[businessType as keyof typeof complaints]) {
      const businessComplaints = complaints[businessType as keyof typeof complaints]

      if (category) {
        const filtered = businessComplaints.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()))
        return Response.json({ complaints: filtered })
      }

      return Response.json({ complaints: businessComplaints })
    }

    return Response.json({ complaints: Object.values(complaints).flat() })
  } catch (error) {
    console.error("Get complaints error:", error)
    return Response.json(
      {
        error: "Failed to get complaints",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * Open Source Real-time API Integration
 * WebSocket, Server-Sent Events, and Real-time Communication
 */

import { EventEmitter } from "events"

export interface RealtimeEvent {
  id: string
  type: "complaint" | "solution" | "escalation" | "status_update" | "voice_call"
  timestamp: Date
  data: any
  userId?: string
  sessionId?: string
  priority: "low" | "medium" | "high" | "critical"
}

export interface WebSocketConnection {
  id: string
  userId: string
  sessionId: string
  socket: any
  lastActivity: Date
  subscriptions: string[]
}

export class RealtimeManager extends EventEmitter {
  private connections: Map<string, WebSocketConnection> = new Map()
  private eventHistory: RealtimeEvent[] = []
  private maxHistorySize = 1000

  constructor() {
    super()
    this.startCleanupInterval()
  }

  // WebSocket connection management
  addConnection(connectionId: string, userId: string, sessionId: string, socket: any) {
    const connection: WebSocketConnection = {
      id: connectionId,
      userId,
      sessionId,
      socket,
      lastActivity: new Date(),
      subscriptions: [],
    }

    this.connections.set(connectionId, connection)

    // Send connection confirmation
    this.sendToConnection(connectionId, {
      type: "connection_established",
      data: { connectionId, timestamp: new Date() },
    })

    console.log(`WebSocket connection established: ${connectionId}`)
  }

  removeConnection(connectionId: string) {
    this.connections.delete(connectionId)
    console.log(`WebSocket connection removed: ${connectionId}`)
  }

  // Event broadcasting
  broadcastEvent(event: RealtimeEvent) {
    // Add to history
    this.eventHistory.push(event)
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift()
    }

    // Broadcast to all relevant connections
    this.connections.forEach((connection) => {
      if (this.shouldReceiveEvent(connection, event)) {
        this.sendToConnection(connection.id, {
          type: "realtime_event",
          data: event,
        })
      }
    })

    // Emit for internal listeners
    this.emit("event", event)
  }

  // Send complaint update
  sendComplaintUpdate(complaintId: string, status: string, details: any) {
    const event: RealtimeEvent = {
      id: `complaint_${complaintId}_${Date.now()}`,
      type: "complaint",
      timestamp: new Date(),
      data: {
        complaintId,
        status,
        details,
        action: "status_update",
      },
      priority: "medium",
    }

    this.broadcastEvent(event)
  }

  // Send solution notification
  sendSolutionNotification(userId: string, solution: any) {
    const event: RealtimeEvent = {
      id: `solution_${userId}_${Date.now()}`,
      type: "solution",
      timestamp: new Date(),
      data: {
        solution,
        action: "solution_provided",
      },
      userId,
      priority: "high",
    }

    this.broadcastEvent(event)
  }

  // Send escalation alert
  sendEscalationAlert(sessionId: string, reason: string, priority: "high" | "critical") {
    const event: RealtimeEvent = {
      id: `escalation_${sessionId}_${Date.now()}`,
      type: "escalation",
      timestamp: new Date(),
      data: {
        reason,
        action: "escalation_required",
        requiresImmediate: priority === "critical",
      },
      sessionId,
      priority,
    }

    this.broadcastEvent(event)
  }

  // Voice call events
  sendVoiceCallEvent(sessionId: string, eventType: string, data: any) {
    const event: RealtimeEvent = {
      id: `voice_${sessionId}_${Date.now()}`,
      type: "voice_call",
      timestamp: new Date(),
      data: {
        eventType,
        ...data,
      },
      sessionId,
      priority: "high",
    }

    this.broadcastEvent(event)
  }

  // Server-Sent Events support
  createSSEStream(userId: string, sessionId: string) {
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const initialMessage = `data: ${JSON.stringify({
          type: "connection_established",
          timestamp: new Date(),
          userId,
          sessionId,
        })}\n\n`

        controller.enqueue(new TextEncoder().encode(initialMessage))

        // Set up event listener
        const eventListener = (event: RealtimeEvent) => {
          if (event.userId === userId || event.sessionId === sessionId) {
            const message = `data: ${JSON.stringify(event)}\n\n`
            controller.enqueue(new TextEncoder().encode(message))
          }
        }

        // Add listener
        this.on("event", eventListener)

        // Cleanup on close
        return () => {
          this.off("event", eventListener)
        }
      },
    })

    return stream
  }

  // Get event history
  getEventHistory(userId?: string, sessionId?: string, limit = 50): RealtimeEvent[] {
    let events = this.eventHistory

    if (userId) {
      events = events.filter((e) => e.userId === userId)
    }

    if (sessionId) {
      events = events.filter((e) => e.sessionId === sessionId)
    }

    return events.slice(-limit).reverse()
  }

  // Private helper methods
  private sendToConnection(connectionId: string, message: any) {
    const connection = this.connections.get(connectionId)
    if (connection && connection.socket.readyState === 1) {
      // WebSocket.OPEN
      try {
        connection.socket.send(JSON.stringify(message))
        connection.lastActivity = new Date()
      } catch (error) {
        console.error(`Failed to send message to connection ${connectionId}:`, error)
        this.removeConnection(connectionId)
      }
    }
  }

  private shouldReceiveEvent(connection: WebSocketConnection, event: RealtimeEvent): boolean {
    // User-specific events
    if (event.userId && event.userId === connection.userId) return true

    // Session-specific events
    if (event.sessionId && event.sessionId === connection.sessionId) return true

    // Critical events go to all connections
    if (event.priority === "critical") return true

    // Check subscriptions
    if (connection.subscriptions.includes(event.type)) return true

    return false
  }

  private startCleanupInterval() {
    // Clean up inactive connections every 5 minutes
    setInterval(
      () => {
        const now = new Date()
        const timeout = 30 * 60 * 1000 // 30 minutes

        this.connections.forEach((connection, id) => {
          if (now.getTime() - connection.lastActivity.getTime() > timeout) {
            this.removeConnection(id)
          }
        })
      },
      5 * 60 * 1000,
    )
  }
}

// Global realtime manager instance
export const realtimeManager = new RealtimeManager()

// WebSocket handler for Next.js API routes
export function handleWebSocket(req: any, socket: any, head: any) {
  // This would be implemented in a WebSocket server
  // For Next.js, we'll use Server-Sent Events instead
  console.log("WebSocket connection attempt")
}

// Real-time complaint tracking
export class ComplaintTracker {
  private complaints: Map<string, any> = new Map()

  createComplaint(userId: string, sessionId: string, complaint: string, businessType: string) {
    const complaintId = `complaint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const complaintData = {
      id: complaintId,
      userId,
      sessionId,
      complaint,
      businessType,
      status: "received",
      timestamp: new Date(),
      priority: this.calculatePriority(complaint),
      updates: [],
    }

    this.complaints.set(complaintId, complaintData)

    // Send real-time notification
    realtimeManager.sendComplaintUpdate(complaintId, "received", complaintData)

    return complaintId
  }

  updateComplaint(complaintId: string, status: string, details: any) {
    const complaint = this.complaints.get(complaintId)
    if (complaint) {
      complaint.status = status
      complaint.updates.push({
        timestamp: new Date(),
        status,
        details,
      })

      this.complaints.set(complaintId, complaint)

      // Send real-time update
      realtimeManager.sendComplaintUpdate(complaintId, status, details)
    }
  }

  getComplaint(complaintId: string) {
    return this.complaints.get(complaintId)
  }

  private calculatePriority(complaint: string): "low" | "medium" | "high" | "critical" {
    const urgentKeywords = ["urgent", "emergency", "critical", "immediately", "help"]
    const highKeywords = ["problem", "issue", "not working", "failed", "broken"]

    const lowerComplaint = complaint.toLowerCase()

    if (urgentKeywords.some((keyword) => lowerComplaint.includes(keyword))) {
      return "critical"
    }

    if (highKeywords.some((keyword) => lowerComplaint.includes(keyword))) {
      return "high"
    }

    return "medium"
  }
}

export const complaintTracker = new ComplaintTracker()

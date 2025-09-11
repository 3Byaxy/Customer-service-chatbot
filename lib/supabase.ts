import { createClient } from "@supabase/supabase-js"
import { API_KEYS, isServiceAvailable } from "./api-keys"

// Initialize Supabase client with error handling
let supabase: any = null
let isSupabaseAvailable = false

try {
  if (isServiceAvailable("SUPABASE")) {
    supabase = createClient(API_KEYS.SUPABASE_URL, API_KEYS.SUPABASE_ANON_KEY)
    isSupabaseAvailable = true
    console.log("✅ Supabase client initialized successfully")
  } else {
    console.warn("⚠️ Supabase not configured - using mock database")
  }
} catch (error) {
  console.error("❌ Failed to initialize Supabase:", error)
  isSupabaseAvailable = false
}

// Type definitions
export interface User {
  id: string
  email: string
  name?: string
  preferred_language: string
  business_type: string
  created_at: string
  updated_at: string
}

export interface ChatSession {
  id: string
  user_id: string
  email: string
  business_type: string
  language: string
  ai_provider: string
  status: "active" | "escalated" | "resolved" | "closed"
  metadata: any
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  session_id: string
  role: "user" | "assistant" | "system"
  content: string
  language: string
  ai_provider?: string
  escalated?: boolean
  metadata: any
  created_at: string
}

export interface Ticket {
  id: string
  session_id: string
  user_id?: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "open" | "in_progress" | "resolved" | "closed"
  assigned_to?: string
  created_at: string
  updated_at: string
  resolved_at?: string
}

// Mock data store for when Supabase is not available
const mockStore = {
  users: new Map<string, User>(),
  sessions: new Map<string, ChatSession>(),
  messages: new Map<string, Message[]>(),
  tickets: new Map<string, Ticket>(),
}

// Generate mock IDs
const generateId = () => `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Database helpers with fallback to mock storage
export const dbHelpers = {
  // Check if Supabase is available
  isAvailable: () => isSupabaseAvailable,

  // User operations
  async createUser(userData: Omit<User, "id" | "created_at" | "updated_at">): Promise<User> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase.from("users").insert([userData]).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase createUser error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    const user: User = {
      id: generateId(),
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockStore.users.set(user.email, user)
    return user
  },

  async getUserByEmail(email: string): Promise<User | null> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

        if (error && error.code !== "PGRST116") throw error
        if (data) return data
      } catch (error) {
        console.error("Supabase getUserByEmail error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    return mockStore.users.get(email) || null
  },

  // Session operations
  async createSession(sessionData: Omit<ChatSession, "id" | "created_at" | "updated_at">): Promise<ChatSession> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase.from("chat_sessions").insert([sessionData]).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase createSession error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    const session: ChatSession = {
      id: generateId(),
      ...sessionData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockStore.sessions.set(session.id, session)
    return session
  },

  async getSession(sessionId: string): Promise<ChatSession | null> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase.from("chat_sessions").select("*").eq("id", sessionId).single()

        if (error && error.code !== "PGRST116") throw error
        if (data) return data
      } catch (error) {
        console.error("Supabase getSession error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    return mockStore.sessions.get(sessionId) || null
  },

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase
          .from("chat_sessions")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", sessionId)
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase updateSession error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    const session = mockStore.sessions.get(sessionId)
    if (session) {
      const updatedSession = {
        ...session,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      mockStore.sessions.set(sessionId, updatedSession)
      return updatedSession
    }
    throw new Error("Session not found")
  },

  // Message operations
  async createMessage(messageData: Omit<Message, "id" | "created_at">): Promise<Message> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase.from("chat_messages").insert([messageData]).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase createMessage error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    const message: Message = {
      id: generateId(),
      ...messageData,
      created_at: new Date().toISOString(),
    }

    const sessionMessages = mockStore.messages.get(messageData.session_id) || []
    sessionMessages.push(message)
    mockStore.messages.set(messageData.session_id, sessionMessages)
    return message
  },

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true })

        if (error) throw error
        return data || []
      } catch (error) {
        console.error("Supabase getSessionMessages error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    return mockStore.messages.get(sessionId) || []
  },

  // Ticket operations
  async createTicket(ticketData: Omit<Ticket, "id" | "created_at" | "updated_at">): Promise<Ticket> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase.from("tickets").insert([ticketData]).select().single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase createTicket error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    const ticket: Ticket = {
      id: generateId(),
      ...ticketData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockStore.tickets.set(ticket.id, ticket)
    return ticket
  },

  async getTickets(filters?: { user_id?: string; status?: string; priority?: string }): Promise<Ticket[]> {
    if (isSupabaseAvailable && supabase) {
      try {
        let query = supabase.from("tickets").select("*")

        if (filters?.user_id) {
          query = query.eq("user_id", filters.user_id)
        }
        if (filters?.status) {
          query = query.eq("status", filters.status)
        }
        if (filters?.priority) {
          query = query.eq("priority", filters.priority)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) throw error
        return data || []
      } catch (error) {
        console.error("Supabase getTickets error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    let tickets = Array.from(mockStore.tickets.values())

    if (filters?.user_id) {
      tickets = tickets.filter((t) => t.user_id === filters.user_id)
    }
    if (filters?.status) {
      tickets = tickets.filter((t) => t.status === filters.status)
    }
    if (filters?.priority) {
      tickets = tickets.filter((t) => t.priority === filters.priority)
    }

    return tickets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async updateTicket(ticketId: string, updates: Partial<Ticket>): Promise<Ticket> {
    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase
          .from("tickets")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", ticketId)
          .select()
          .single()

        if (error) throw error
        return data
      } catch (error) {
        console.error("Supabase updateTicket error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    const ticket = mockStore.tickets.get(ticketId)
    if (ticket) {
      const updatedTicket = {
        ...ticket,
        ...updates,
        updated_at: new Date().toISOString(),
      }
      mockStore.tickets.set(ticketId, updatedTicket)
      return updatedTicket
    }
    throw new Error("Ticket not found")
  },

  // Analytics operations
  async getSessionStats(timeframe: "day" | "week" | "month" = "day") {
    const startDate = new Date()
    if (timeframe === "week") startDate.setDate(startDate.getDate() - 7)
    if (timeframe === "month") startDate.setMonth(startDate.getMonth() - 1)

    if (isSupabaseAvailable && supabase) {
      try {
        const { data, error } = await supabase
          .from("chat_sessions")
          .select("status, created_at, language, business_type")
          .gte("created_at", startDate.toISOString())

        if (error) throw error
        return data || []
      } catch (error) {
        console.error("Supabase getSessionStats error:", error)
        // Fall back to mock
      }
    }

    // Mock implementation
    const sessions = Array.from(mockStore.sessions.values())
    return sessions.filter((s) => new Date(s.created_at) >= startDate)
  },

  // Test connection
  async testConnection(): Promise<{ success: boolean; message: string; details?: any }> {
    if (!isSupabaseAvailable || !supabase) {
      return {
        success: false,
        message: "Supabase not configured - using mock database",
        details: {
          supabase_url: !!API_KEYS.SUPABASE_URL,
          supabase_key: !!API_KEYS.SUPABASE_ANON_KEY,
          mock_data: {
            users: mockStore.users.size,
            sessions: mockStore.sessions.size,
            messages: Array.from(mockStore.messages.values()).reduce((sum, msgs) => sum + msgs.length, 0),
            tickets: mockStore.tickets.size,
          },
        },
      }
    }

    try {
      // Test basic connection
      const { data, error } = await supabase.from("users").select("count").limit(1)

      if (error) {
        return {
          success: false,
          message: "Database connection failed",
          details: error,
        }
      }

      return {
        success: true,
        message: "Supabase connection successful",
        details: {
          connection: "OK",
          timestamp: new Date().toISOString(),
        },
      }
    } catch (error) {
      return {
        success: false,
        message: "Connection test failed",
        details: error,
      }
    }
  },
}

export { supabase }

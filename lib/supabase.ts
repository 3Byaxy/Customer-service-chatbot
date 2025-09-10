import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uckvdxvgdfzhzjqdhztz.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja3ZkeHZnZGZ6aHpqcWRoenR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDk5NDIsImV4cCI6MjA3MzAyNTk0Mn0.-3qr1-HRAm3q1va_2rPQTPg5VSKecDhkK4Rs8JzpMSU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key for admin operations
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja3ZkeHZnZGZ6aHpqcWRoenR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ0OTk0MiwiZXhwIjoyMDczMDI1OTQyfQ.ITJ08qB90zmBQAsBwJCsZlH14l3RnUiU5jh-CKMWMHM"

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database schema types
export interface User {
  id: string
  email: string
  profile: {
    preferred_language?: string
    business_type?: string
    [key: string]: any
  }
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  user_id: string
  business_type: string
  language: string
  status: "active" | "completed" | "escalated"
  context: {
    started_at: string
    user_agent?: string
    ip_address?: string
    [key: string]: any
  }
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  session_id: string
  sender: "user" | "bot" | "agent"
  content: string
  timestamp: string
  metadata?: {
    intent?: string
    language_detected?: string
    model_provider?: string
    escalated?: boolean
    knowledge_used?: boolean
    [key: string]: any
  }
}

export interface Ticket {
  id: string
  session_id: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  description: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface KnowledgeBase {
  id: string
  title: string
  content: string
  category: string
  business_type: string
  language: string
  tags: string[]
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export const dbHelpers = {
  // Users
  async createUser(email: string, profile?: Partial<User["profile"]>) {
    const { data, error } = await supabaseAdmin.from("users").insert([{ email, profile }]).select().single()

    if (error) throw error
    return data
  },

  async getUser(id: string) {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin.from("users").select("*").eq("email", email).single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  // Sessions
  async createSession(userId: string, businessType: string, language: string) {
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .insert([
        {
          user_id: userId,
          business_type: businessType,
          language,
          started_at: new Date().toISOString(),
          status: "active",
          context: {
            started_at: new Date().toISOString(),
          },
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getSession(id: string) {
    const { data, error } = await supabaseAdmin.from("sessions").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async updateSessionStatus(id: string, status: Session["status"]) {
    const { data, error } = await supabaseAdmin
      .from("sessions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getActiveSessions(userId?: string) {
    let query = supabaseAdmin.from("sessions").select("*").eq("status", "active")

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query.order("started_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Messages
  async createMessage(sessionId: string, sender: Message["sender"], content: string, metadata?: Message["metadata"]) {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert([
        {
          session_id: sessionId,
          sender,
          content,
          timestamp: new Date().toISOString(),
          metadata,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getMessages(sessionId: string) {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("timestamp", { ascending: true })

    if (error) throw error
    return data
  },

  async getRecentMessages(limit = 50) {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select(`
        *,
        sessions!inner(
          business_type,
          language,
          status
        )
      `)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  // Tickets
  async createTicket(sessionId: string, title: string, description: string, priority: Ticket["priority"]) {
    const { data, error } = await supabaseAdmin
      .from("tickets")
      .insert([
        {
          session_id: sessionId,
          title,
          description,
          priority,
          status: "open",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getTickets(filters?: { status?: string; priority?: string; assigned_to?: string }) {
    let query = supabaseAdmin.from("tickets").select(`
      *,
      sessions!inner(
        business_type,
        language,
        user_id
      )
    `)

    if (filters?.status) query = query.eq("status", filters.status)
    if (filters?.priority) query = query.eq("priority", filters.priority)
    if (filters?.assigned_to) query = query.eq("assigned_to", filters.assigned_to)

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async updateTicket(id: string, updates: Partial<Ticket>) {
    const { data, error } = await supabaseAdmin
      .from("tickets")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Knowledge Base
  async searchKnowledgeBase(query: string, businessType?: string, language?: string) {
    let dbQuery = supabaseAdmin.from("knowledge_base").select("*").textSearch("content", query)

    if (businessType) dbQuery = dbQuery.eq("business_type", businessType)
    if (language) dbQuery = dbQuery.eq("language", language)

    const { data, error } = await dbQuery.limit(5)

    if (error) throw error
    return data
  },

  async createKnowledgeBaseEntry(entry: Omit<KnowledgeBase, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabaseAdmin
      .from("knowledge_base")
      .insert([
        {
          ...entry,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getKnowledgeBaseEntries(businessType?: string, language?: string) {
    let query = supabaseAdmin.from("knowledge_base").select("*")

    if (businessType) query = query.eq("business_type", businessType)
    if (language) query = query.eq("language", language)

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  // Analytics and Stats
  async getAnalytics(timeframe: "day" | "week" | "month" = "day") {
    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case "day":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
    }

    // Get session stats
    const { data: sessionStats, error: sessionError } = await supabaseAdmin
      .from("sessions")
      .select("status, business_type, language")
      .gte("started_at", startDate.toISOString())

    if (sessionError) throw sessionError

    // Get message stats
    const { data: messageStats, error: messageError } = await supabaseAdmin
      .from("messages")
      .select("sender, metadata")
      .gte("timestamp", startDate.toISOString())

    if (messageError) throw messageError

    // Get ticket stats
    const { data: ticketStats, error: ticketError } = await supabaseAdmin
      .from("tickets")
      .select("status, priority")
      .gte("created_at", startDate.toISOString())

    if (ticketError) throw ticketError

    return {
      sessions: sessionStats,
      messages: messageStats,
      tickets: ticketStats,
      timeframe,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    }
  },
}

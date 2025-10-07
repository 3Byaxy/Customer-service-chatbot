/**
 * ElevenLabs Conversational Agent Integration
 * Handles ElevenLabs "Talk to" conversational agents for voice interactions
 */

export interface ElevenLabsAgent {
  id: string
  name: string
  agentId: string
  description: string
  language: string
  capabilities: string[]
  status: 'active' | 'inactive'
}

export interface ConversationSession {
  sessionId: string
  agentId: string
  userId?: string
  startTime: Date
  lastActivity: Date
  messageCount: number
  status: 'active' | 'ended' | 'error'
}

export interface AgentResponse {
  response: string
  audioUrl?: string
  sessionId: string
  agentId: string
  confidence: number
  language: string
  metadata?: any
}

export class ElevenLabsAgentService {
  private apiKey: string
  private baseUrl = 'https://api.elevenlabs.io/v1'
  private agents: ElevenLabsAgent[] = []
  private activeSessions: Map<string, ConversationSession> = new Map()

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || ''
    this.initializeAgents()
  }

  private initializeAgents() {
    // Initialize with the provided agent
    this.agents = [
      {
        id: 'customer-support-agent',
        name: 'Customer Support Agent',
        agentId: 'agent_0101k4dnacx9f3avv6fxfb2knfns',
        description: 'AI-powered customer support agent for handling inquiries',
        language: 'en',
        capabilities: ['conversation', 'voice-response', 'multilingual-support'],
        status: 'active'
      }
    ]
  }

  /**
   * Start a new conversation session with an agent
   */
  async startConversation(agentId: string, userId?: string): Promise<ConversationSession> {
    const agent = this.agents.find(a => a.id === agentId)
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`)
    }

    const sessionId = this.generateSessionId()
    const session: ConversationSession = {
      sessionId,
      agentId: agent.agentId,
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      messageCount: 0,
      status: 'active'
    }

    this.activeSessions.set(sessionId, session)

    // Trigger n8n workflow for session start
    await this.triggerWorkflow('conversation-started', {
      sessionId,
      agentId: agent.id,
      userId,
      timestamp: session.startTime
    })

    return session
  }

  /**
   * Send a message to the conversational agent
   */
  async sendMessage(sessionId: string, message: string, language = 'en'): Promise<AgentResponse> {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    if (session.status !== 'active') {
      throw new Error(`Session ${sessionId} is not active`)
    }

    try {
      // Call ElevenLabs conversational agent API
      const response = await this.callElevenLabsAgent(session.agentId, message, language)

      // Update session
      session.lastActivity = new Date()
      session.messageCount++
      this.activeSessions.set(sessionId, session)

      // Trigger workflow for message processing
      await this.triggerWorkflow('message-processed', {
        sessionId,
        agentId: session.agentId,
        message,
        response: response.response,
        language
      })

      return {
        ...response,
        sessionId,
        agentId: session.agentId,
        language
      }
    } catch (error) {
      console.error('ElevenLabs agent error:', error)
      session.status = 'error'
      this.activeSessions.set(sessionId, session)

      throw new Error(`Failed to get agent response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * End a conversation session
   */
  async endConversation(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    session.status = 'ended'
    this.activeSessions.set(sessionId, session)

    // Trigger workflow for conversation end
    await this.triggerWorkflow('conversation-ended', {
      sessionId,
      agentId: session.agentId,
      duration: Date.now() - session.startTime.getTime(),
      messageCount: session.messageCount
    })

    // Clean up session after delay
    setTimeout(() => {
      this.activeSessions.delete(sessionId)
    }, 300000) // 5 minutes
  }

  /**
   * Get conversation history for a session
   */
  getConversationHistory(sessionId: string): ConversationSession | null {
    return this.activeSessions.get(sessionId) || null
  }

  /**
   * Get available agents
   */
  getAvailableAgents(): ElevenLabsAgent[] {
    return this.agents.filter(agent => agent.status === 'active')
  }

  /**
   * Private method to call ElevenLabs conversational agent
   */
  private async callElevenLabsAgent(agentId: string, message: string, language: string): Promise<Omit<AgentResponse, 'sessionId' | 'agentId' | 'language'>> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    try {
      // ElevenLabs conversational agent endpoint
      const response = await fetch(`${this.baseUrl}/convai/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          agent_id: agentId,
          message: message,
          language: language,
          conversation_config: {
            turn_detection: {
              type: 'server_vad'
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      return {
        response: data.response || data.text || 'No response generated',
        audioUrl: data.audio_url,
        confidence: data.confidence || 0.9,
        metadata: {
          agent_id: data.agent_id,
          conversation_id: data.conversation_id,
          user_id: data.user_id
        }
      }
    } catch (error) {
      console.error('ElevenLabs API call failed:', error)
      throw error
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Trigger n8n workflow
   */
  private async triggerWorkflow(event: string, data: any): Promise<void> {
    try {
      // Import n8n service dynamically to avoid circular dependencies
      const { n8nIntegrationService } = await import('./n8n-integration')
      await n8nIntegrationService.triggerWorkflow(event, data)
    } catch (error) {
      console.error('Failed to trigger workflow:', error)
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats(): { active: number; total: number; errors: number } {
    const sessions = Array.from(this.activeSessions.values())
    return {
      active: sessions.filter(s => s.status === 'active').length,
      total: sessions.length,
      errors: sessions.filter(s => s.status === 'error').length
    }
  }
}

// Global instance
export const elevenLabsAgentService = new ElevenLabsAgentService()
export interface AIAgent {
  id: string
  name: string
  provider: 'elevenlabs' | 'vapi' | 'voiceflow' | 'elevenlabs-agent' | 'huggingface'
  capabilities: string[]
  supportedLanguages: string[]
  endpoint: string
  apiKey?: string
  agentId?: string // For ElevenLabs conversational agents
  modelId?: string // For Hugging Face models
}

export interface AgentResponse {
  response: string
  language: string
  confidence: number
  agentUsed: string
}

class AIAgentsService {
  private agents: AIAgent[] = [
    {
      id: 'elevenlabs-tts',
      name: 'Eleven Labs TTS',
      provider: 'elevenlabs',
      capabilities: ['text-to-speech', 'voice-synthesis'],
      supportedLanguages: ['english', 'swahili', 'luganda'],
      endpoint: 'https://api.elevenlabs.io/v1/text-to-speech',
    },
    {
      id: 'elevenlabs-conversational',
      name: 'ElevenLabs Conversational Agent',
      provider: 'elevenlabs-agent',
      capabilities: ['conversation', 'voice-chat', 'ai-response'],
      supportedLanguages: ['english', 'swahili', 'luganda'],
      endpoint: 'https://api.elevenlabs.io/v1/convai/conversation',
      agentId: 'agent_0101k4dnacx9f3avv6fxfb2knfns',
    },
    {
      id: 'crane-ai-luganda',
      name: 'CraneAI Luganda Language Model',
      provider: 'huggingface',
      capabilities: ['text-generation', 'translation', 'language-understanding'],
      supportedLanguages: ['luganda', 'english'],
      endpoint: 'https://api-inference.huggingface.co/models/CraneAILabs/luganda-base',
      modelId: 'CraneAILabs/luganda-base',
    },
    {
      id: 'vapi-voice-agent',
      name: 'Vapi Voice Agent',
      provider: 'vapi',
      capabilities: ['voice-chat', 'conversation'],
      supportedLanguages: ['english', 'swahili'],
      endpoint: 'https://api.vapi.ai/call',
    },
    {
      id: 'voiceflow-dialogue',
      name: 'Voiceflow Dialogue Agent',
      provider: 'voiceflow',
      capabilities: ['dialogue-flow', 'intent-detection'],
      supportedLanguages: ['english', 'swahili', 'luganda'],
      endpoint: 'https://api.voiceflow.com/v2/projects/68bb3a68d1715034556ef518', // Your specific project
    },
  ]

  async routeToAgent(message: string, detectedLanguage: string): Promise<AgentResponse> {
    // Select agent based on language and message type
    const suitableAgents = this.agents.filter(agent =>
      agent.supportedLanguages.includes(detectedLanguage) &&
      this.isSuitableForMessage(agent, message)
    )

    if (suitableAgents.length === 0) {
      return {
        response: 'No suitable agent found for this language.',
        language: detectedLanguage,
        confidence: 0,
        agentUsed: 'fallback',
      }
    }

    // Prioritize agents: ElevenLabs conversational, CraneAI for Luganda, Voiceflow for dialogue, Vapi for voice, Eleven Labs for TTS
    const selectedAgent = suitableAgents.find(a => a.provider === 'elevenlabs-agent') ||
                          suitableAgents.find(a => a.provider === 'huggingface') ||
                          suitableAgents.find(a => a.provider === 'voiceflow') ||
                          suitableAgents.find(a => a.provider === 'vapi') ||
                          suitableAgents[0]

    // Call agent based on provider type
    const response = await this.callAgent(selectedAgent, message, detectedLanguage)

    return {
      response,
      language: detectedLanguage,
      confidence: 0.9,
      agentUsed: selectedAgent.name,
    }
  }

  private isSuitableForMessage(agent: AIAgent, message: string): boolean {
    const lowerMessage = message.toLowerCase()

    if (agent.provider === 'elevenlabs-agent') {
      // Conversational agent - suitable for general customer support queries
      return lowerMessage.includes('help') || lowerMessage.includes('support') ||
             lowerMessage.includes('question') || lowerMessage.includes('issue') ||
             lowerMessage.length > 10 // General conversation
    }

    if (agent.provider === 'elevenlabs') {
      return lowerMessage.includes('speak') || lowerMessage.includes('voice')
    }

    if (agent.provider === 'vapi') {
      return lowerMessage.includes('call') || lowerMessage.includes('voice')
    }

    if (agent.provider === 'voiceflow') {
      return true // General dialogue agent
    }

    if (agent.provider === 'huggingface') {
      // CraneAI models - suitable for Luganda language processing
      return agent.supportedLanguages.includes('luganda') &&
             (lowerMessage.includes('luganda') || lowerMessage.includes('translate') ||
              lowerMessage.includes('language') || lowerMessage.length > 5)
    }

    return false
  }

  private async callAgent(agent: AIAgent, message: string, language: string): Promise<string> {
    console.log(`Calling ${agent.name} for message: ${message} in ${language}`)

    try {
      switch (agent.provider) {
        case 'elevenlabs-agent':
          // Use the new ElevenLabs conversational agent service
          const { elevenLabsAgentService } = await import('./elevenlabs-agent')
          const session = await elevenLabsAgentService.startConversation('customer-support-agent')
          const response = await elevenLabsAgentService.sendMessage(session.sessionId, message, language)
          await elevenLabsAgentService.endConversation(session.sessionId)
          return response.response

        case 'elevenlabs':
          return `TTS generated for: ${message}`

        case 'vapi':
          return `Voice agent response to: ${message}`

        case 'voiceflow':
          return `Dialogue flow response to: ${message}`

        case 'huggingface':
          return await this.callHuggingFaceAgent(agent, message, language)

        default:
          return 'Agent response not available'
      }
    } catch (error) {
      console.error(`Error calling ${agent.name}:`, error)
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  getAvailableAgents(): AIAgent[] {
    return this.agents
  }

  addAgent(agent: AIAgent): void {
    this.agents.push(agent)
  }

  private async callHuggingFaceAgent(agent: AIAgent, message: string, language: string): Promise<string> {
    try {
      const { apiKeyRouter } = await import('../../environment/api-key-router')

      const request = {
        service: 'huggingface',
        endpoint: agent.endpoint,
        method: 'POST' as const,
        headers: {
          'Authorization': `Bearer ${agent.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: {
          inputs: message,
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true
          },
          options: {
            wait_for_model: true
          }
        }
      }

      const response = await apiKeyRouter.routeRequest(request)

      if (response.success && response.data) {
        // Extract the generated text from Hugging Face response
        if (Array.isArray(response.data) && response.data[0]?.generated_text) {
          return response.data[0].generated_text
        } else if (response.data.generated_text) {
          return response.data.generated_text
        }
      }

      return `CraneAI response for: ${message}`
    } catch (error) {
      console.error('Error calling Hugging Face agent:', error)
      return `Error with CraneAI: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export const aiAgentsService = new AIAgentsService()
/**
 * API Keys Configuration
 * Centralized management of all API keys for the chatbot
 *
 * IMPORTANT: This file contains placeholder keys for development.
 * In production, use environment variables or secure key management.
 */

export const API_KEYS = {
  // ===========================================
  // AI PROVIDERS (Core Intelligence)
  // ===========================================

  // Google Gemini AI (FREE TIER - PRIMARY AI)
  // Status: ✅ FREE - Get from: https://makersuite.google.com/app/apikey
  GEMINI: {
    key: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
    status: process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "active" : "pending",
    provider: "Google",
    model: "Gemini 1.5 Flash/Pro",
    cost: "FREE",
    limits: "60 requests/minute",
    description: "Primary AI for chat responses and analysis"
  },

  // Groq (FAST INFERENCE - FREE TIER)
  // Status: ✅ FREE - Get from: https://console.groq.com/keys
  GROQ: {
    key: process.env.GROQ_API_KEY || "",
    status: process.env.GROQ_API_KEY ? "active" : "pending",
    provider: "Groq",
    model: "Llama 3.1 70B",
    cost: "FREE",
    limits: "No strict limits",
    description: "Fast AI inference for quick responses"
  },

  // ===========================================
  // AI AGENTS (Specialized Services)
  // ===========================================

  // Eleven Labs (TEXT-TO-SPEECH)
  // Status: ✅ FREE - Get from: https://elevenlabs.io/app/profile
  ELEVENLABS: {
    key: process.env.ELEVENLABS_API_KEY || "",
    status: process.env.ELEVENLABS_API_KEY ? "active" : "pending",
    provider: "Eleven Labs",
    service: "Text-to-Speech",
    cost: "FREE",
    limits: "10,000 characters/month",
    description: "Converts text responses to natural speech"
  },

  // Voiceflow (DIALOGUE FLOWS)
  // Status: ✅ FREE - Get from: https://www.voiceflow.com/
  // Project ID: 68bb3a68d1715034556ef518 (from your URL)
  VOICEFLOW: {
    key: process.env.VOICEFLOW_API_KEY || "",
    status: process.env.VOICEFLOW_API_KEY ? "active" : "pending",
    provider: "Voiceflow",
    service: "Dialogue Management",
    cost: "FREE",
    limits: "100 conversations/month",
    description: "Manages complex conversation flows",
    projectId: "68bb3a68d1715034556ef518"
  },

  // ===========================================
  // OPTIONAL PAID SERVICES
  // ===========================================

  // Anthropic Claude (PREMIUM AI)
  // Status: 🔄 OPTIONAL - Get from: https://console.anthropic.com/
  ANTHROPIC: {
    key: process.env.ANTHROPIC_API_KEY || "",
    status: process.env.ANTHROPIC_API_KEY ? "active" : "optional",
    provider: "Anthropic",
    model: "Claude 3.5 Sonnet",
    cost: "PAID",
    limits: "Varies by plan",
    description: "Premium AI for complex customer issues"
  },

  // OpenAI GPT (VERSATILE AI)
  // Status: 🔄 OPTIONAL - Get from: https://platform.openai.com/api-keys
  OPENAI: {
    key: process.env.OPENAI_API_KEY || "",
    status: process.env.OPENAI_API_KEY ? "active" : "optional",
    provider: "OpenAI",
    model: "GPT-4o",
    cost: "PAID",
    limits: "Varies by plan",
    description: "Versatile AI for various use cases"
  },

  // Vapi (VOICE AGENTS)
  // Status: 🔄 OPTIONAL - Get from: https://vapi.ai/
  VAPI: {
    key: process.env.VAPI_API_KEY || "",
    status: process.env.VAPI_API_KEY ? "active" : "optional",
    provider: "Vapi",
    service: "Voice Agents",
    cost: "PAID",
    limits: "Varies by plan",
    description: "Advanced voice conversation agents"
  },

  // Hugging Face (CRANE AI MODELS)
  // Status: ✅ FREE - Get from: https://huggingface.co/settings/tokens
  HUGGINGFACE: {
    key: process.env.HUGGINGFACE_API_KEY || "",
    status: process.env.HUGGINGFACE_API_KEY ? "active" : "pending",
    provider: "Hugging Face",
    service: "CraneAI Language Models",
    cost: "FREE",
    limits: "5,000 requests/month",
    description: "Local language models for Luganda and other African languages"
  },

  // ===========================================
  // INFRASTRUCTURE & WORKFLOW
  // ===========================================

  // Database (PostgreSQL)
  DATABASE: {
    url: process.env.DATABASE_URL || "postgresql://user:pass@localhost:5432/chatbot",
    status: "required",
    provider: "PostgreSQL/Neon",
    description: "Stores conversations, users, and analytics"
  },

  // n8n Workflow Automation
  N8N: {
    webhookUrl: process.env.N8N_WEBHOOK_URL || "https://your-n8n-instance.com/webhook/",
    apiKey: process.env.N8N_API_KEY || "your_n8n_key_here",
    status: "optional",
    provider: "n8n",
    description: "Automates workflows for escalations and notifications"
  },

  // ===========================================
  // SYSTEM CONFIGURATION
  // ===========================================

  SYSTEM: {
    encryptionKey: process.env.ENCRYPTION_KEY || "",
    nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
    nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
    debug: process.env.DEBUG || "true"
  }
}

/**
 * API Key Validation
 */
export const validateAPIKeys = () => {
  const required = ['GEMINI']
  const warnings: string[] = []

  required.forEach(key => {
    const apiKey = API_KEYS[key as keyof typeof API_KEYS]
    if (apiKey && 'status' in apiKey && apiKey.status === 'pending') {
      warnings.push(`${key} API key is required but not configured`)
    }
  })

  return {
    isValid: warnings.length === 0,
    warnings,
    configured: Object.entries(API_KEYS).filter(([_, config]) => 
      'status' in config && config.status === 'active'
    ).length,
    total: Object.keys(API_KEYS).length
  }
}

/**
 * Get API Key by Service
 */
export const getAPIKey = (service: keyof typeof API_KEYS) => {
  const config = API_KEYS[service]
  return config && 'key' in config ? config.key : undefined
}

/**
 * Check if service is available
 */
export const isServiceAvailable = (service: keyof typeof API_KEYS) => {
  const config = API_KEYS[service]
  return config && 
    'status' in config && 
    'key' in config && 
    config.status === 'active' && 
    config.key && 
    config.key.length > 0
}
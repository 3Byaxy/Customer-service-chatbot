// API Keys and Service Configuration
// This file manages all API keys and service availability checks

export const API_KEYS = {
  // AI Providers
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s",
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

  // Voice Services
  ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY || "",

  // Database
  SUPABASE_URL: process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY:
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",

  // N8n Integration
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook-test/complaint-escalation",
  N8N_AGENT_ID: process.env.N8N_AGENT_ID || "agent_0101k4dnacx9f3avv6fxfb2knfns",
}

export const isServiceAvailable = (service: string): boolean => {
  switch (service.toUpperCase()) {
    case "GEMINI":
    case "GOOGLE":
      return !!API_KEYS.GOOGLE_GENERATIVE_AI_API_KEY
    case "ANTHROPIC":
      return !!API_KEYS.ANTHROPIC_API_KEY
    case "GROQ":
      return !!API_KEYS.GROQ_API_KEY
    case "OPENAI":
      return !!API_KEYS.OPENAI_API_KEY
    case "ELEVENLABS":
      return !!API_KEYS.ELEVENLABS_API_KEY
    case "SUPABASE":
      return !!(API_KEYS.SUPABASE_URL && API_KEYS.SUPABASE_ANON_KEY)
    case "N8N":
      return !!(API_KEYS.N8N_WEBHOOK_URL && API_KEYS.N8N_AGENT_ID)
    default:
      return false
  }
}

export const getServiceStatus = () => {
  return {
    ai_providers: {
      gemini: isServiceAvailable("GEMINI"),
      anthropic: isServiceAvailable("ANTHROPIC"),
      groq: isServiceAvailable("GROQ"),
      openai: isServiceAvailable("OPENAI"),
    },
    voice_services: {
      elevenlabs: isServiceAvailable("ELEVENLABS"),
      browser: true, // Always available
    },
    database: {
      supabase: isServiceAvailable("SUPABASE"),
    },
    automation: {
      n8n: isServiceAvailable("N8N"),
    },
  }
}

export const getAvailableAIProviders = () => {
  const providers = []

  if (isServiceAvailable("GEMINI")) {
    providers.push({
      id: "google",
      name: "Google Gemini",
      icon: "✨",
      status: "free",
      description: "Free AI provider with generous limits",
    })
  }

  if (isServiceAvailable("GROQ")) {
    providers.push({
      id: "groq",
      name: "Groq Llama",
      icon: "⚡",
      status: "free",
      description: "Fast inference with free tier",
    })
  }

  if (isServiceAvailable("ANTHROPIC")) {
    providers.push({
      id: "anthropic",
      name: "Anthropic Claude",
      icon: "🤖",
      status: "premium",
      description: "Advanced reasoning and safety",
    })
  }

  if (isServiceAvailable("OPENAI")) {
    providers.push({
      id: "openai",
      name: "OpenAI GPT",
      icon: "🧠",
      status: "premium",
      description: "Industry-leading AI models",
    })
  }

  // Always include mock provider as fallback
  providers.push({
    id: "mock",
    name: "Demo AI",
    icon: "🎭",
    status: "demo",
    description: "Demo responses for testing",
  })

  return providers
}

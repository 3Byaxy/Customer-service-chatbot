export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Test multiple free AI APIs in order of preference
    const freeAPIs = [
      {
        name: "Hugging Face Inference API",
        url: "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: {
          inputs: message,
          parameters: {
            max_length: 500,
            temperature: 0.7,
          },
        },
        free: true,
        setup: "Get free API key from https://huggingface.co/settings/tokens",
      },
      {
        name: "Cohere Trial API",
        url: "https://api.cohere.ai/v1/generate",
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: {
          model: "command-light",
          prompt: `You are a customer service AI for businesses in Uganda. Respond helpfully to: ${message}`,
          max_tokens: 300,
          temperature: 0.7,
        },
        free: true,
        setup: "Get free trial API key from https://dashboard.cohere.ai/api-keys",
      },
      {
        name: "Together AI",
        url: "https://api.together.xyz/inference",
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: {
          model: "togethercomputer/llama-2-7b-chat",
          prompt: `<s>[INST] You are a helpful customer service assistant. Respond to: ${message} [/INST]`,
          max_tokens: 300,
          temperature: 0.7,
        },
        free: true,
        setup: "Get free credits from https://api.together.xyz/",
      },
    ]

    const results = []

    for (const api of freeAPIs) {
      try {
        const apiKey = process.env[api.name.replace(/\s+/g, "_").toUpperCase() + "_API_KEY"]

        if (!apiKey) {
          results.push({
            name: api.name,
            status: "missing_key",
            setup: api.setup,
            free: api.free,
          })
          continue
        }

        const response = await fetch(api.url, {
          method: "POST",
          headers: api.headers,
          body: JSON.stringify(api.body),
        })

        if (response.ok) {
          const data = await response.json()
          results.push({
            name: api.name,
            status: "success",
            response: data,
            free: api.free,
          })
        } else {
          results.push({
            name: api.name,
            status: "error",
            error: `HTTP ${response.status}: ${response.statusText}`,
            setup: api.setup,
            free: api.free,
          })
        }
      } catch (error) {
        results.push({
          name: api.name,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          setup: api.setup,
          free: api.free,
        })
      }
    }

    return Response.json({
      success: true,
      message: "Free API testing completed",
      results,
      recommendations: {
        primary: "Google Gemini (completely free with generous limits)",
        secondary: "Groq (free tier with fast inference)",
        fallback: "Hugging Face Inference API (free with rate limits)",
      },
    })
  } catch (error) {
    console.error("Free APIs test error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to test free APIs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

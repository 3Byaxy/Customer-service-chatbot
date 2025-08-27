export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s"

    if (!apiKey) {
      return Response.json({ error: "API key not configured" }, { status: 400 })
    }

    // Test multiple Gemini models with direct API calls
    const modelsToTest = [
      {
        name: "gemini-2.0-flash-exp",
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      },
      {
        name: "gemini-1.5-flash",
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      },
      {
        name: "gemini-1.5-pro",
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      },
    ]

    const results = []

    for (const model of modelsToTest) {
      try {
        console.log(`Testing direct API for model: ${model.name}`)

        const response = await fetch(model.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a helpful customer service AI assistant for businesses in Uganda. Please respond to this customer message in a friendly and professional manner: "${message}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
            },
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"

          results.push({
            model: model.name,
            status: "success",
            response: generatedText,
            httpStatus: response.status,
          })
        } else {
          const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }))
          results.push({
            model: model.name,
            status: "error",
            error: `HTTP ${response.status}: ${response.statusText}`,
            details: errorData,
            httpStatus: response.status,
          })
        }
      } catch (error) {
        results.push({
          model: model.name,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    // Find the first successful result
    const successfulResult = results.find((r) => r.status === "success")

    if (successfulResult) {
      return Response.json({
        success: true,
        message: "Direct API test successful! 🎉",
        workingModel: successfulResult.model,
        response: successfulResult.response,
        allResults: results,
        recommendation: "Use this working model for your chat system",
      })
    } else {
      return Response.json({
        success: false,
        message: "All direct API tests failed",
        allResults: results,
        troubleshooting: [
          "Check if the API key is valid",
          "Ensure Generative AI API is enabled in Google Cloud Console",
          "Verify billing is set up (if required)",
          "Try regenerating the API key",
        ],
        nextSteps: [
          "Visit https://console.cloud.google.com/apis/library/generativeai.googleapis.com",
          "Enable the Generative AI API",
          "Check your API quotas and limits",
        ],
      })
    }
  } catch (error) {
    console.error("Direct Gemini test error:", error)
    return Response.json(
      {
        success: false,
        error: "Server error during direct API test",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

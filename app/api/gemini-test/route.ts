import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Use the provided API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s"

    if (!apiKey) {
      return Response.json(
        {
          error: "Google Gemini API key not configured",
          setup: {
            step1: "Visit https://makersuite.google.com/app/apikey",
            step2: "Sign in with your Google account",
            step3: "Click 'Create API Key'",
            step4: "Copy the API key",
            step5: "Add GOOGLE_GENERATIVE_AI_API_KEY=your_key_here to your environment variables",
          },
        },
        { status: 400 },
      )
    }

    // Test with multiple Gemini models to find the working one
    const modelsToTest = [
      { name: "gemini-2.0-flash-exp", displayName: "Gemini 2.0 Flash (Latest)" },
      { name: "gemini-1.5-flash", displayName: "Gemini 1.5 Flash" },
      { name: "gemini-1.5-pro", displayName: "Gemini 1.5 Pro" },
    ]

    let lastError = null

    for (const modelInfo of modelsToTest) {
      try {
        console.log(`Testing model: ${modelInfo.name}`)

        const result = await generateText({
          model: google(modelInfo.name, {
            apiKey: apiKey,
          }),
          prompt: `You are a helpful customer service AI assistant for businesses in Uganda. Please respond to this customer message in a friendly and professional manner, considering local context and languages (English, Luganda, Swahili): "${message}"`,
          maxTokens: 500,
        })

        return Response.json({
          success: true,
          response: result.text,
          model: modelInfo.name,
          modelDisplayName: modelInfo.displayName,
          provider: "google",
          cost: "free",
          apiKeyStatus: "configured",
          message: `${modelInfo.displayName} is working perfectly! 🎉`,
        })
      } catch (error) {
        console.error(`Model ${modelInfo.name} failed:`, error)
        lastError = error
        continue // Try next model
      }
    }

    // If all models failed, try direct API call
    try {
      console.log("Trying direct API call...")

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a helpful customer service AI assistant for businesses in Uganda. Please respond to this customer message in a friendly and professional manner, considering local context and languages (English, Luganda, Swahili): "${message}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 500,
              temperature: 0.7,
            },
          }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated"

        return Response.json({
          success: true,
          response: generatedText,
          model: "gemini-1.5-flash",
          modelDisplayName: "Gemini 1.5 Flash (Direct API)",
          provider: "google-direct",
          cost: "free",
          apiKeyStatus: "configured",
          message: "Direct API call successful! 🎉",
        })
      } else {
        const errorData = await response.json()
        throw new Error(`Direct API failed: ${response.status} - ${JSON.stringify(errorData)}`)
      }
    } catch (directApiError) {
      console.error("Direct API call failed:", directApiError)
    }

    // All attempts failed
    console.error("All Gemini models failed:", lastError)

    let errorMessage = "Failed to connect to Google Gemini API"
    let troubleshooting = []

    if (lastError instanceof Error) {
      if (lastError.message.includes("API key")) {
        errorMessage = "Invalid API key"
        troubleshooting = [
          "Check if the API key is correct: AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s",
          "Ensure the API key has Generative AI API enabled",
          "Try regenerating the API key",
        ]
      } else if (lastError.message.includes("quota")) {
        errorMessage = "API quota exceeded"
        troubleshooting = [
          "Check your quota limits in Google Cloud Console",
          "Wait for quota to reset",
          "Consider upgrading your plan",
        ]
      } else if (lastError.message.includes("permission") || lastError.message.includes("403")) {
        errorMessage = "Permission denied - API not enabled"
        troubleshooting = [
          "Enable the Generative AI API in Google Cloud Console",
          "Check if billing is enabled (if required)",
          "Verify API key permissions",
        ]
      } else if (lastError.message.includes("404")) {
        errorMessage = "Model not found"
        troubleshooting = [
          "The requested model may not be available in your region",
          "Try using gemini-1.5-flash instead",
          "Check if you have access to the latest models",
        ]
      }
    }

    return Response.json(
      {
        success: false,
        error: errorMessage,
        details: lastError instanceof Error ? lastError.message : "Unknown error",
        troubleshooting,
        apiKey: "AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s",
        nextSteps: [
          "Visit https://console.cloud.google.com/apis/library/generativeai.googleapis.com",
          "Enable the Generative AI API",
          "Check billing settings if needed",
          "Try the direct API test below",
        ],
        directApiTest: {
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            contents: [{ parts: [{ text: "Test message" }] }],
          },
        },
      },
      { status: 500 },
    )
  } catch (error) {
    console.error("Gemini test error:", error)
    return Response.json(
      {
        success: false,
        error: "Server error during Gemini test",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

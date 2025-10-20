"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Send } from "lucide-react"
import { useState } from "react"

const demoMessages = [
  { type: "user", text: "Find me a good laptop under 2M" },
  { type: "ai", text: "I found 3 verified laptops under 2M UGX. The best rated is the HP Pavilion with Intel i5, 8GB RAM, and 512GB SSD for 1.8M UGX. Would you like me to show you the options?" },
  { type: "user", text: "I want pizza delivered now" },
  { type: "ai", text: "Pizza Palace in Nakawa has 4.8⭐ rating and can deliver in 25 minutes. Their Margherita pizza is 45,000 UGX. Should I place the order for you?" },
  { type: "user", text: "Book a haircut for tomorrow" },
  { type: "ai", text: "Bob's Barbershop in Ntinda has openings at 2PM and 4PM tomorrow. They're A++ rated with 95% positive reviews. Which time works better for you?" }
]

export default function LiveDemo() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedMessages, setDisplayedMessages] = useState<typeof demoMessages>([])

  const showNextMessage = () => {
    if (currentMessageIndex < demoMessages.length) {
      setDisplayedMessages(prev => [...prev, demoMessages[currentMessageIndex]])
      setCurrentMessageIndex(prev => prev + 1)
    }
  }

  const resetDemo = () => {
    setDisplayedMessages([])
    setCurrentMessageIndex(0)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Try It Yourself</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience how KyakuShien connects you to verified businesses in Uganda
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                KyakuShien AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 mb-6 min-h-[300px]">
                {displayedMessages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Click "Start Demo" to see how it works!
                  </div>
                )}
                {displayedMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={showNextMessage}
                  disabled={currentMessageIndex >= demoMessages.length}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {currentMessageIndex === 0 ? "Start Demo" : "Next Message"}
                </Button>
                <Button
                  onClick={resetDemo}
                  variant="outline"
                  disabled={displayedMessages.length === 0}
                >
                  Reset
                </Button>
              </div>

              {currentMessageIndex >= demoMessages.length && displayedMessages.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">Demo Complete!</p>
                  <p className="text-green-700 text-sm">Ready to try the real KyakuShien? Click "Try Free Chat" above.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
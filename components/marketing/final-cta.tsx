"use client"

import { Button } from "@/components/ui/button"
import { Download, MessageSquare } from "lucide-react"

export default function FinalCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Experience Shopping Made Easy?</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of Ugandans who are already using KyakuShien to shop smarter
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Start Shopping Now - Free
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
          >
            <Download className="h-5 w-5 mr-2" />
            Download App
          </Button>
        </div>

        <div className="flex justify-center gap-6 text-sm text-blue-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>iOS App</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Android App</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Web App</span>
          </div>
        </div>
      </div>
    </section>
  )
}
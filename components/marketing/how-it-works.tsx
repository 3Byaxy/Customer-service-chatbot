"use client"

import { MessageSquare, ShoppingCart } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to get everything you need in Uganda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* For Customers */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              For Customers
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">💬 Chat Your Need</h4>
                  <p className="text-gray-600">"I want pizza in Nakawa"</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🏆 AI Finds Best Options</h4>
                  <p className="text-gray-600">Quality-verified businesses ranked for you</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">✅ We Handle Everything</h4>
                  <p className="text-gray-600">Order, pay, track—all in one place</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="text-blue-600 hover:text-blue-700 font-medium">Learn More →</button>
            </div>
          </div>

          {/* For Businesses */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-green-600" />
              For Businesses
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📝 List Your Business</h4>
                  <p className="text-gray-600">Even without a website</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🏆 Get Quality Verified</h4>
                  <p className="text-gray-600">Build customer trust with our badges</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">💰 Grow Sales</h4>
                  <p className="text-gray-600">We bring customers to you</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button className="text-green-600 hover:text-green-700 font-medium">Learn More →</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "Pizza orders up 156% since joining KyakuShien",
    business: "2000 Pizza, Kampala",
    rating: 5,
    color: "bg-red-50 border-red-200"
  },
  {
    quote: "No website needed—KyakuShien brings customers to us",
    business: "Bob's Barbershop, Ntinda",
    rating: 5,
    color: "bg-blue-50 border-blue-200"
  },
  {
    quote: "Quality badge increased trust, sales doubled",
    business: "TechHub Uganda, Kampala Road",
    rating: 5,
    color: "bg-green-50 border-green-200"
  }
]

export default function SuccessStories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Real Businesses, Real Results</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how KyakuShien is transforming businesses across Uganda
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={`shadow-lg ${testimonial.color}`}>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-900 font-medium mb-4 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <cite className="text-gray-600 font-semibold">
                  — {testimonial.business}
                </cite>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-gray-600 font-medium">Join 247+ verified businesses</span>
          </div>
        </div>
      </div>
    </section>
  )
}
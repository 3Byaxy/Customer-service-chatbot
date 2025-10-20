"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Globe, Lock, MessageCircle, Shield, Star, Truck } from "lucide-react"

const guarantees = [
  {
    icon: Shield,
    title: "Quality Verified",
    description: "Every business gets a grade: A++, A+, B++, B+",
    color: "text-green-600"
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Chat in English, Luganda, or Swahili",
    color: "text-blue-600"
  },
  {
    icon: Star,
    title: "Real Reviews",
    description: "Only verified purchases can review",
    color: "text-yellow-600"
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Your money is protected",
    color: "text-purple-600"
  },
  {
    icon: Truck,
    title: "Delivery Tracking",
    description: "Know exactly when it arrives",
    color: "text-orange-600"
  },
  {
    icon: MessageCircle,
    title: "24/7 AI Support",
    description: "Get instant answers anytime",
    color: "text-indigo-600"
  }
]

export default function QualityGuarantee() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Trust KyakuShien?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We ensure every transaction is safe, verified, and delivered with quality
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guarantees.map((guarantee, index) => {
            const IconComponent = guarantee.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <IconComponent className={`h-12 w-12 mb-4 ${guarantee.color}`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{guarantee.title}</h3>
                  <p className="text-gray-600">{guarantee.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
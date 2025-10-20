"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Building2, Star, TrendingUp, Users } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "12,400+",
    label: "Happy Customers",
    color: "text-blue-600"
  },
  {
    icon: Building2,
    value: "247",
    label: "Verified Businesses",
    color: "text-green-600"
  },
  {
    icon: Star,
    value: "94.2%",
    label: "Average Quality Score",
    color: "text-yellow-600"
  },
  {
    icon: TrendingUp,
    value: "2.1%",
    label: "Return Rate (vs 8.7% industry avg)",
    color: "text-red-600"
  }
]

export default function Stats() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Growing Uganda's Commerce</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Real numbers from real businesses using KyakuShien
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <IconComponent className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <div className="inline-block bg-white/20 px-6 py-3 rounded-full">
            <span className="text-white font-medium">🇺🇬 Made in Uganda, for Uganda</span>
          </div>
        </div>
      </div>
    </section>
  )
}
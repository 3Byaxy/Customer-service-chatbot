"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Car, GraduationCap, Home, Pill, Pizza, Scissors, Shirt, Smartphone } from "lucide-react"

const categories = [
  { icon: Pizza, name: "Food & Restaurants", color: "text-orange-600" },
  { icon: Smartphone, name: "Electronics", color: "text-blue-600" },
  { icon: Scissors, name: "Salons & Spas", color: "text-pink-600" },
  { icon: Shirt, name: "Fashion & Clothing", color: "text-purple-600" },
  { icon: Home, name: "Home & Furniture", color: "text-green-600" },
  { icon: Car, name: "Auto Services", color: "text-red-600" },
  { icon: Pill, name: "Health & Pharmacy", color: "text-teal-600" },
  { icon: GraduationCap, name: "Education & Tutoring", color: "text-indigo-600" },
]

export default function FeaturedCategories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Can You Find on KyakuShien?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover verified businesses across all categories in Uganda
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <IconComponent className={`h-12 w-12 mx-auto mb-4 ${category.color}`} />
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Browse All Categories
          </button>
        </div>
      </div>
    </section>
  )
}
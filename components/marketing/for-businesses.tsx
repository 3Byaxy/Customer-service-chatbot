"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CheckCircle, CreditCard, Globe } from "lucide-react"

export default function ForBusinesses() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Grow Your Business with KyakuShien</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Two ways to join Uganda's largest verified business network
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Option A: Have Website */}
          <Card className="shadow-xl border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                <Globe className="h-6 w-6" />
                You Have a Website
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Add AI chat widget to your site</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Admin dashboard for monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Quality verification badge</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Keep your branding</span>
                </li>
              </ul>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">From $29/month</div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Widget
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Option B: No Website */}
          <Card className="shadow-xl border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-xl text-green-900 flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                No Website? No Problem!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>List your business in our marketplace</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>We handle chat, orders, payments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Quality verification included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>You just fulfill orders</span>
                </li>
              </ul>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">$10/month + 5% commission</div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  List Business
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Why Businesses Choose KyakuShien</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span>Real-time analytics</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Quality verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
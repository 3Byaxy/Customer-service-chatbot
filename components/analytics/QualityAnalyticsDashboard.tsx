'use client'

import React from 'react'
import QualityBadge from '../quality/QualityBadge'

interface AnalyticsData {
  qualityImpact: {
    revenueByGrade: { [key: string]: number }
    conversionByGrade: { [key: string]: number }
    customerRetentionByGrade: { [key: string]: number }
  }
  customerBehavior: {
    averageSession: string
    conversionRate: number
    cartAbandonment: number
    savedByChat: number
    repeatCustomers: number
    qualityPreference: number
  }
  supportMetrics: {
    chatToSaleConversion: number
    supportSatisfaction: number
    qualityQuestionsPercent: number
    resolutionRate: number
    averageResponseTime: string
    trustImprovement: number
  }
  businessTrends: {
    monthlyRevenue: number[]
    qualityScoresTrend: number[]
    customerGrowth: number[]
  }
}

const mockAnalyticsData: AnalyticsData = {
  qualityImpact: {
    revenueByGrade: { 'A++': 67, 'A+': 25, 'B++': 8, 'B+': 0 },
    conversionByGrade: { 'A++': 8.4, 'A+': 5.2, 'B++': 3.1, 'B+': 2.1 },
    customerRetentionByGrade: { 'A++': 89, 'A+': 72, 'B++': 58, 'B+': 45 }
  },
  customerBehavior: {
    averageSession: '8.4 minutes',
    conversionRate: 3.7,
    cartAbandonment: 31,
    savedByChat: 18,
    repeatCustomers: 68,
    qualityPreference: 78
  },
  supportMetrics: {
    chatToSaleConversion: 24,
    supportSatisfaction: 4.8,
    qualityQuestionsPercent: 45,
    resolutionRate: 96,
    averageResponseTime: '45 seconds',
    trustImprovement: 89
  },
  businessTrends: {
    monthlyRevenue: [45000, 52000, 61000, 58000, 67000, 74000, 85000],
    qualityScoresTrend: [91.2, 92.1, 92.8, 93.2, 93.9, 94.2, 94.5],
    customerGrowth: [120, 145, 189, 234, 298, 367, 445]
  }
}

export default function QualityAnalyticsDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">📈 Quality Analytics & Insights</h1>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Last Year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            📊 Export Report
          </button>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 REVENUE ANALYTICS</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Revenue: $847,230 (+23% vs last month)</h3>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white mb-6">
              <div className="text-sm opacity-90">Monthly Growth Trend</div>
              <div className="flex items-end space-x-2 mt-2">
                {mockAnalyticsData.businessTrends.monthlyRevenue.map((revenue, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-white bg-opacity-30 rounded-t"
                      style={{ 
                        height: `${(revenue / 85000) * 60}px`,
                        width: '20px'
                      }}
                    />
                    <div className="text-xs mt-1">{index + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Quality Grade</h3>
            <div className="space-y-3">
              {Object.entries(mockAnalyticsData.qualityImpact.revenueByGrade).map(([grade, percentage]) => (
                <div key={grade} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <QualityBadge grade={grade as any} size="small" />
                    <span className="font-medium">{grade} Products</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="font-bold text-lg">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-800">
                <strong>Key Insight:</strong> A++ products generate 67% of revenue despite being only 15% of catalog
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Impact Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 QUALITY IMPACT ON SALES</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversion Rates by Grade</h3>
            <div className="space-y-3">
              {Object.entries(mockAnalyticsData.qualityImpact.conversionByGrade).map(([grade, rate]) => (
                <div key={grade} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <QualityBadge grade={grade as any} size="small" />
                  <div className="text-right">
                    <div className="font-bold text-lg">{rate}%</div>
                    <div className="text-sm text-gray-600">conversion</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Retention by Grade</h3>
            <div className="space-y-3">
              {Object.entries(mockAnalyticsData.qualityImpact.customerRetentionByGrade).map(([grade, retention]) => (
                <div key={grade} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <QualityBadge grade={grade as any} size="small" />
                  <div className="text-right">
                    <div className="font-bold text-lg">{retention}%</div>
                    <div className="text-sm text-gray-600">retention</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Score Trend</h3>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="text-3xl font-bold">94.5%</div>
              <div className="text-sm opacity-90">Current Average</div>
              <div className="text-sm text-green-300">+3.3% this month</div>
              
              <div className="mt-3 flex items-end space-x-1">
                {mockAnalyticsData.businessTrends.qualityScoresTrend.map((score, index) => (
                  <div 
                    key={index}
                    className="bg-white bg-opacity-30 rounded-t"
                    style={{ 
                      height: `${((score - 90) / 5) * 40}px`,
                      width: '12px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Behavior Analytics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 CUSTOMER BEHAVIOR</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{mockAnalyticsData.customerBehavior.averageSession}</div>
            <div className="text-sm text-blue-800">Average Session</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{mockAnalyticsData.customerBehavior.conversionRate}%</div>
            <div className="text-sm text-green-800">Conversion Rate</div>
            <div className="text-xs text-gray-600">Industry avg: 2.1%</div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{mockAnalyticsData.customerBehavior.cartAbandonment}%</div>
            <div className="text-sm text-orange-800">Cart Abandonment</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{mockAnalyticsData.customerBehavior.savedByChat}%</div>
            <div className="text-sm text-purple-800">Saved by Chat</div>
          </div>
          
          <div className="bg-teal-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-teal-600">{mockAnalyticsData.customerBehavior.repeatCustomers}%</div>
            <div className="text-sm text-teal-800">Repeat Customers</div>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{mockAnalyticsData.customerBehavior.qualityPreference}%</div>
            <div className="text-sm text-indigo-800">Prefer A+/A++</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Key Customer Insights:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Quality-conscious buyers have 3x higher lifetime value</li>
            <li>• 78% of customers prefer higher quality over lower price</li>
            <li>• Chat support saves 18% of abandoned carts</li>
            <li>• A++ customers have 89% retention rate vs 45% for B+ customers</li>
          </ul>
        </div>
      </div>

      {/* Support Effectiveness */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📞 SUPPORT EFFECTIVENESS</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat Support Impact</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">Chat to Sale Conversion</div>
                  <div className="text-sm text-gray-600">Customers who chat are more likely to buy</div>
                </div>
                <div className="text-2xl font-bold text-green-600">{mockAnalyticsData.supportMetrics.chatToSaleConversion}%</div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">Support Satisfaction</div>
                  <div className="text-sm text-gray-600">Customer rating for support quality</div>
                </div>
                <div className="text-2xl font-bold text-blue-600">{mockAnalyticsData.supportMetrics.supportSatisfaction}/5 ⭐</div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-medium">Resolution Rate</div>
                  <div className="text-sm text-gray-600">Issues resolved successfully</div>
                </div>
                <div className="text-2xl font-bold text-purple-600">{mockAnalyticsData.supportMetrics.resolutionRate}%</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality-Related Support</h3>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-6 text-white mb-4">
              <div className="text-3xl font-bold">{mockAnalyticsData.supportMetrics.qualityQuestionsPercent}%</div>
              <div className="text-sm opacity-90">of support chats are about quality grades</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Average Response Time</span>
                <span className="font-medium">{mockAnalyticsData.supportMetrics.averageResponseTime}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Trust Building Impact</span>
                <span className="font-medium">{mockAnalyticsData.supportMetrics.trustImprovement}% feel more confident</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-6">🎯 STRATEGIC RECOMMENDATIONS</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Immediate Actions</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">🔥</span>
                <span><strong>Focus A++ vendor recruitment:</strong> 67% of revenue from 15% of catalog</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">💡</span>
                <span><strong>Expand quality education:</strong> 45% of chats are quality questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-300 mr-2">📈</span>
                <span><strong>Improve B+ standards:</strong> Low conversion and retention rates</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Long-term Strategy</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-green-300 mr-2">🎯</span>
                <span><strong>Quality-first marketing:</strong> Emphasize quality differentiation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">🤖</span>
                <span><strong>Enhance chat features:</strong> 24% conversion improvement potential</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">📊</span>
                <span><strong>Vendor quality training:</strong> Systematic quality improvement</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
          <div className="text-sm">
            <strong>Success Metrics to Track:</strong> A++ product percentage, quality-to-purchase conversion, 
            customer lifetime value by quality grade, support satisfaction scores
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import QualityBadge from '../../components/quality/QualityBadge'
import QualityAnalyticsDashboard from '../../components/analytics/QualityAnalyticsDashboard'

interface Product {
  id: string
  name: string
  vendor: string
  qualityGrade: 'A++' | 'A+' | 'B++' | 'B+' | 'Pending'
  qualityScore?: number
  status: 'Active' | 'Pending' | 'Rejected' | 'Review Needed'
  price: number
  sales: number
  customerRating: number
  reviewCount: number
  submittedDate: string
}

interface Vendor {
  id: string
  name: string
  rating: 'A++' | 'A+' | 'B++' | 'B+'
  productsCount: number
  qualityScore: number
  revenue: number
  orders: number
  returnRate: number
  status: 'Active' | 'Pending' | 'Probation'
}

interface SupportTicket {
  id: string
  customer: string
  type: 'Quality Question' | 'Order Issue' | 'Technical Problem' | 'Quality Complaint'
  priority: 'High' | 'Medium' | 'Low'
  status: 'Open' | 'In Progress' | 'Resolved'
  agent?: string
  duration: string
  productId?: string
}

const sampleProducts: Product[] = [
  {
    id: 'P001',
    name: 'MacBook Pro M3',
    vendor: 'TechCorp',
    qualityGrade: 'A++',
    qualityScore: 98,
    status: 'Active',
    price: 1899,
    sales: 45,
    customerRating: 4.9,
    reviewCount: 247,
    submittedDate: '2024-10-01'
  },
  {
    id: 'P002',
    name: 'iPhone 15 Pro',
    vendor: 'MobileMart',
    qualityGrade: 'A+',
    qualityScore: 89,
    status: 'Review Needed',
    price: 999,
    sales: 23,
    customerRating: 4.7,
    reviewCount: 189,
    submittedDate: '2024-10-05'
  },
  {
    id: 'P003',
    name: 'Samsung Galaxy S24',
    vendor: 'TechMart',
    qualityGrade: 'Pending',
    status: 'Pending',
    price: 899,
    sales: 0,
    customerRating: 0,
    reviewCount: 0,
    submittedDate: '2024-10-07'
  }
]

const sampleVendors: Vendor[] = [
  {
    id: 'V001',
    name: 'TechCorp Solutions',
    rating: 'A++',
    productsCount: 156,
    qualityScore: 98.5,
    revenue: 145000,
    orders: 1247,
    returnRate: 0.8,
    status: 'Active'
  },
  {
    id: 'V002',
    name: 'ElectroMart Ltd',
    rating: 'A+',
    productsCount: 89,
    qualityScore: 92.1,
    revenue: 89000,
    orders: 890,
    returnRate: 1.2,
    status: 'Active'
  },
  {
    id: 'V003',
    name: 'GadgetWorld Inc',
    rating: 'B++',
    productsCount: 0,
    qualityScore: 0,
    revenue: 0,
    orders: 0,
    returnRate: 0,
    status: 'Pending'
  }
]

const sampleTickets: SupportTicket[] = [
  {
    id: 'T001',
    customer: 'Maria G.',
    type: 'Quality Question',
    priority: 'Medium',
    status: 'In Progress',
    agent: 'Sarah',
    duration: '3min',
    productId: 'P001'
  },
  {
    id: 'T002',
    customer: 'David K.',
    type: 'Quality Complaint',
    priority: 'High',
    status: 'Open',
    agent: 'Mike',
    duration: '8min',
    productId: 'P002'
  }
]

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [notifications, setNotifications] = useState(5)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const dashboardStats = {
    revenue: 24850,
    revenueChange: 15,
    orders: 143,
    ordersChange: 8,
    qualityScore: 94,
    qualityChange: 2,
    newUsers: 28,
    usersChange: 12
  }

  const qualityDistribution = {
    'A++': 15,
    'A+': 42,
    'B++': 89,
    'B+': 101
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Business Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 BUSINESS OVERVIEW</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${dashboardStats.revenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{dashboardStats.revenueChange}% ↑</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders Today</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.orders}</p>
                <p className="text-sm text-green-600">+{dashboardStats.ordersChange}% ↑</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quality Score</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.qualityScore}%</p>
                <p className="text-sm text-green-600">+{dashboardStats.qualityChange}% ↑</p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Users</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.newUsers}</p>
                <p className="text-sm text-green-600">+{dashboardStats.usersChange}% ↑</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Actions */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-red-600 mb-4">⚠️ URGENT ACTIONS</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span className="text-sm">• 12 Products awaiting quality review</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Review Now</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <span className="text-sm">• 5 Customer complaints need response</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Respond</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <span className="text-sm">• 8 Vendor applications pending approval</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Review</button>
          </div>
        </div>
      </div>

      {/* Quality Distribution */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quality Badge Distribution</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(qualityDistribution).map(([grade, count]) => (
            <div key={grade} className="text-center p-4 bg-gray-50 rounded-lg">
              <QualityBadge grade={grade as any} size="large" />
              <div className="mt-2 text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">products</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderQualityCenter = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">🏆 QUALITY ASSURANCE CENTER</h2>
      
      {/* Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-2">Average Quality Score</h3>
          <div className="text-3xl font-bold text-green-600">94.2/100</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-2">Customer Satisfaction</h3>
          <div className="text-3xl font-bold text-blue-600">4.8/5 ⭐</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-2">Return Rate</h3>
          <div className="text-3xl font-bold text-green-600">2.1%</div>
          <div className="text-sm text-gray-600">Industry avg: 8.7%</div>
        </div>
      </div>

      {/* Products Requiring Review */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-orange-600 mb-4">⚠️ PRODUCTS REQUIRING REVIEW ({sampleProducts.filter(p => p.status === 'Pending' || p.status === 'Review Needed').length})</h3>
        
        <div className="space-y-4">
          {sampleProducts
            .filter(product => product.status === 'Pending' || product.status === 'Review Needed')
            .map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{product.name}</h4>
                    <p className="text-sm text-gray-600">Vendor: {product.vendor} | Submitted: {new Date(product.submittedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">${product.price.toLocaleString()}</div>
                    {product.qualityGrade !== 'Pending' && (
                      <QualityBadge grade={product.qualityGrade as any} score={product.qualityScore} showScore={true} />
                    )}
                  </div>
                </div>

                {product.status === 'Pending' && (
                  <div className="space-y-3">
                    <h5 className="font-medium">Quality Checklist:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">☑️</span>
                        Product authenticity verified
                      </div>
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">☑️</span>
                        Vendor documentation complete
                      </div>
                      <div className="flex items-center">
                        <span className="text-orange-500 mr-2">⏳</span>
                        Physical inspection pending
                      </div>
                      <div className="flex items-center">
                        <span className="text-orange-500 mr-2">⏳</span>
                        Return policy compliance check
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm"><strong>Suggested Grade:</strong> A+ (Score: 91/100)</p>
                    </div>

                    <div className="flex space-x-3">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                        ✅ Approve A+
                      </button>
                      <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm">
                        🔄 Request Changes
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                        ❌ Reject
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                        📧 Contact Vendor
                      </button>
                    </div>
                  </div>
                )}

                {product.status === 'Review Needed' && (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Issue:</strong> Customer Issue Reported - Quality score may need adjustment
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                        🔍 Investigate
                      </button>
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm">
                        📞 Contact Vendor
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const renderVendorManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">🤝 VENDOR MANAGEMENT</h2>
        <div className="text-sm text-gray-600">{sampleVendors.filter(v => v.status === 'Active').length} Active Vendors</div>
      </div>

      {/* Top Performing Vendors */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-green-600 mb-4">🌟 TOP PERFORMING VENDORS</h3>
        <div className="space-y-4">
          {sampleVendors.filter(vendor => vendor.status === 'Active').map(vendor => (
            <div key={vendor.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{vendor.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Quality Score: {vendor.qualityScore}/100</span>
                    <span>Customer Rating: {(vendor.qualityScore / 20).toFixed(1)}/5</span>
                  </div>
                </div>
                <QualityBadge grade={vendor.rating} />
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Revenue:</span>
                  <div className="font-bold">${vendor.revenue.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Orders:</span>
                  <div className="font-bold">{vendor.orders.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Products:</span>
                  <div className="font-bold">{vendor.productsCount}</div>
                </div>
                <div>
                  <span className="text-gray-600">Return Rate:</span>
                  <div className="font-bold text-green-600">{vendor.returnRate}%</div>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                  📊 Full Report
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                  💰 Payouts
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">
                  📝 Performance Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Applications */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-orange-600 mb-4">⚠️ VENDOR APPLICATIONS ({sampleVendors.filter(v => v.status === 'Pending').length} pending)</h3>
        <div className="space-y-4">
          {sampleVendors.filter(vendor => vendor.status === 'Pending').map(vendor => (
            <div key={vendor.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-2">{vendor.name}</h4>
              <div className="text-sm text-gray-600 mb-3">Applied: 3 days ago</div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Category:</span> Electronics
                </div>
                <div>
                  <span className="text-gray-600">Proposed Products:</span> 23
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  Business License: Verified
                </div>
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✅</span>
                  Financial Standing: Good
                </div>
                <div className="flex items-center">
                  <span className="text-orange-500 mr-2">⏳</span>
                  References: Pending verification
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                  ✅ Approve
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                  📞 Interview
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSupportManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">💬 CUSTOMER SUPPORT CENTER</h2>
        <div className="text-sm text-green-600">🟢 5 agents online</div>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-2">Live Chat Queue</h3>
          <div className="text-3xl font-bold text-orange-600">3 waiting</div>
          <div className="text-sm text-gray-600">Response Time: 12 seconds</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-2">Support Tickets</h3>
          <div className="text-3xl font-bold text-blue-600">8 open</div>
          <div className="text-sm text-gray-600">45 resolved today</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h3 className="font-bold text-lg mb-2">Satisfaction Score</h3>
          <div className="text-3xl font-bold text-green-600">4.7/5</div>
          <div className="text-sm text-gray-600">Resolution Rate: 94%</div>
        </div>
      </div>

      {/* Active Chats */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold text-blue-600 mb-4">🔥 ACTIVE CHATS</h3>
        <div className="space-y-4">
          {sampleTickets.map(ticket => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">Chat #{ticket.id.slice(-1)}: {ticket.customer}</h4>
                  <div className="text-sm text-gray-600">
                    Topic: {ticket.type} | Agent: {ticket.agent} | Duration: {ticket.duration}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority === 'High' && '🔴'} {ticket.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'Open' ? 'bg-red-100 text-red-800' :
                    ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                {ticket.type === 'Quality Question' && 
                  `"What does B++ rating mean for laptops?"`
                }
                {ticket.type === 'Quality Complaint' && 
                  `"My A++ product arrived damaged" (Order: #ORD-2024-1505 | Value: $1,299)`
                }
              </div>

              <div className="flex space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                  📝 View Chat
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">
                  🔄 Transfer
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                  ✅ Resolve
                </button>
                {ticket.type === 'Quality Complaint' && (
                  <>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm">
                      💰 Process Refund
                    </button>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm">
                      🚚 Replacement
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">🔧 QualityMart Admin</h1>
              <span className="bg-slate-700 px-2 py-1 rounded text-sm">Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="text-2xl cursor-pointer">🔔</span>
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👤</span>
                <div>
                  <div className="font-medium">Admin User</div>
                  <div className="text-xs text-slate-300">Quality Manager</div>
                </div>
              </div>
              <button className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: '📊 Dashboard', count: null },
              { id: 'products', label: '📦 Products', count: 247 },
              { id: 'orders', label: '📋 Orders', count: 143 },
              { id: 'quality', label: '🏆 Quality', count: 12 },
              { id: 'vendors', label: '🤝 Vendors', count: 8 },
              { id: 'support', label: '💬 Support', count: 3 },
              { id: 'analytics', label: '📈 Analytics', count: null },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count && (
                  <span className="ml-1 bg-red-100 text-red-600 text-xs rounded-full px-2 py-1">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'quality' && renderQualityCenter()}
        {activeTab === 'vendors' && renderVendorManagement()}
        {activeTab === 'support' && renderSupportManagement()}
        {activeTab === 'analytics' && <QualityAnalyticsDashboard />}
        
        {['products', 'orders'].includes(activeTab) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </h3>
            <p className="text-gray-600">This section is ready for implementation with your specific requirements.</p>
          </div>
        )}
      </main>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import QualityBadge from '../../components/quality/QualityBadge'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  price: number
  image: string
  qualityGrade: 'A++' | 'A+' | 'B++' | 'B+'
  qualityScore: number
  rating: number
  reviews: number
  vendor: string
}

const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro M3 16-inch',
    price: 1899,
    image: '/api/placeholder/300/200',
    qualityGrade: 'A++',
    qualityScore: 98,
    rating: 4.9,
    reviews: 247,
    vendor: 'TechCorp'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    price: 999,
    image: '/api/placeholder/300/200',
    qualityGrade: 'A+',
    qualityScore: 94,
    rating: 4.7,
    reviews: 189,
    vendor: 'MobileMart'
  },
  {
    id: '3',
    name: 'Dell XPS 13',
    price: 1299,
    image: '/api/placeholder/300/200',
    qualityGrade: 'B++',
    qualityScore: 87,
    rating: 4.5,
    reviews: 156,
    vendor: 'ComputeWorld'
  },
  {
    id: '4',
    name: 'Surface Laptop 5',
    price: 1099,
    image: '/api/placeholder/300/200',
    qualityGrade: 'A+',
    qualityScore: 91,
    rating: 4.6,
    reviews: 203,
    vendor: 'TechSource'
  }
]

export default function CustomerPlatform() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedQualityFilter, setSelectedQualityFilter] = useState<string>('all')
  const [chatVisible, setChatVisible] = useState(false)

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesQuality = selectedQualityFilter === 'all' || product.qualityGrade === selectedQualityFilter
    return matchesSearch && matchesQuality
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">QualityMart</h1>
              <span className="ml-2 text-sm text-gray-600">Quality Goods, Quality Service</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/customer" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/customer/categories" className="text-gray-700 hover:text-blue-600">Categories</Link>
              <Link href="/customer/support" className="text-gray-700 hover:text-blue-600">Support</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for quality goods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                🛒 <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-1">3</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600">👤</button>
            </div>
          </div>
        </div>
      </header>

      {/* Quality Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">💎 QUALITY ASSURED PRODUCTS</h2>
          <p className="text-xl mb-8">Every product rated with our trusted quality system</p>
          
          {/* Quality Filter Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button 
              onClick={() => setSelectedQualityFilter('all')}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedQualityFilter === 'all' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              All Products
            </button>
            <button 
              onClick={() => setSelectedQualityFilter('A++')}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedQualityFilter === 'A++' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              🏆 A++ Premium
            </button>
            <button 
              onClick={() => setSelectedQualityFilter('A+')}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedQualityFilter === 'A+' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              ⭐ A+ High Quality
            </button>
            <button 
              onClick={() => setSelectedQualityFilter('B++')}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedQualityFilter === 'B++' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              ✅ B++ Good Quality
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              Featured Products ({filteredProducts.length})
            </h3>
            <div className="flex space-x-4">
              <select className="border border-gray-300 rounded-lg px-4 py-2">
                <option>Sort by Quality ↓</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Customer Rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="relative">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">📱 Product Image</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <QualityBadge 
                      grade={product.qualityGrade} 
                      score={product.qualityScore}
                      showScore={true}
                      interactive={true}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {'⭐'.repeat(Math.floor(product.rating))}
                      <span className="ml-1 text-sm text-gray-600">
                        ({product.rating}) {product.reviews} reviews
                      </span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-2">by {product.vendor}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      🛒 Buy Now
                    </button>
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                      💬 Questions about quality?
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Information Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Understanding Our Quality Grades</h3>
            <p className="text-xl text-gray-600">We verify every product so you shop with confidence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <QualityBadge grade="A++" size="large" />
              <h4 className="font-bold text-lg mt-4 mb-2">Premium Quality</h4>
              <p className="text-gray-600">98-100% quality score. Verified authentic, premium support, 30-day guarantee.</p>
            </div>
            <div className="text-center">
              <QualityBadge grade="A+" size="large" />
              <h4 className="font-bold text-lg mt-4 mb-2">High Quality</h4>
              <p className="text-gray-600">90-97% quality score. Excellent standards, fast shipping, quality assured.</p>
            </div>
            <div className="text-center">
              <QualityBadge grade="B++" size="large" />
              <h4 className="font-bold text-lg mt-4 mb-2">Good Quality</h4>
              <p className="text-gray-600">80-89% quality score. Reliable choice, standard shipping, basic warranty.</p>
            </div>
            <div className="text-center">
              <QualityBadge grade="B+" size="large" />
              <h4 className="font-bold text-lg mt-4 mb-2">Standard Quality</h4>
              <p className="text-gray-600">70-79% quality score. Good value, standard shipping, return available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Support Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatVisible ? (
          <div className="bg-white rounded-xl shadow-2xl w-80 h-96 flex flex-col">
            <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Customer Support</h4>
                <p className="text-sm opacity-90">🟢 Online - Response time: &lt;30sec</p>
              </div>
              <button 
                onClick={() => setChatVisible(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4">
                <div className="bg-gray-100 rounded-lg p-3 mb-2">
                  <p className="text-sm">Hi! How can I help you today?</p>
                </div>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">
                    📦 Product Questions
                  </button>
                  <button className="w-full text-left p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">
                    🏆 Quality Information
                  </button>
                  <button className="w-full text-left p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">
                    📋 Order Status
                  </button>
                  <button className="w-full text-left p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">
                    👤 Speak to Human
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setChatVisible(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
          >
            💬 <span className="ml-1">Chat</span>
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">📞 Need Help? Chat with our support team!</h3>
            <p className="text-gray-400">Quality questions answered by quality experts</p>
            <div className="mt-8 text-sm text-gray-500">
              © 2024 QualityMart. Quality Goods, Quality Service, Quality Guaranteed.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
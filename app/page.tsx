"use client"

import { CheckCircle, Globe, MessageCircle, Package, Shield, ShoppingBag, Star, Store, Users, Zap } from 'lucide-react';
import { useState } from 'react';

export default function KyakuShienHomepage() {
  const [activeTab, setActiveTab] = useState('customer');
  const [chatMessages, setChatMessages] = useState([
    { type: 'ai', text: 'Hello! 👋 What are you looking for today?' }
  ]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const categories = [
    { icon: '🍕', name: 'Food & Restaurants', count: '2,400+' },
    { icon: '📱', name: 'Electronics', count: '1,200+' },
    { icon: '✂️', name: 'Salons & Spas', count: '890+' },
    { icon: '👗', name: 'Fashion', count: '3,100+' },
    { icon: '🏠', name: 'Home & Furniture', count: '760+' },
    { icon: '🚗', name: 'Auto Services', count: '540+' },
    { icon: '💊', name: 'Health & Pharmacy', count: '320+' },
    { icon: '🎓', name: 'Education', count: '450+' }
  ];

  const quickSearches = [
    "Find me a good laptop under 2M",
    "I want pizza delivered now",
    "Book a haircut for tomorrow",
    "Best phone shops in Kampala"
  ];

  const handleQuickSearch = (query: string) => {
    setChatMessages(prev => [...prev, { type: 'user', text: query }]);
    setIsTyping(true);

    setTimeout(() => {
      let response = '';
      if (query.includes('pizza')) {
        response = "Found 4 pizza places near you:\n\n1. 🍕 Pizza Hut - A++ Quality, 45 min, 35k UGX\n2. 🍕 Dominos - A++ Quality, 50 min, 40k UGX\n3. 🍕 2000 Pizza - A+ Quality, 30 min, 25k UGX\n4. 🍕 Local Pizza - B++ Quality, 25 min, 20k UGX\n\nWhich one would you like?";
      } else if (query.includes('laptop')) {
        response = "Great! Here are the best laptops under 2M UGX:\n\n💻 HP Pavilion 15 - 1.8M\n🏆 A++ Quality | 8GB RAM, 512GB SSD\n📍 TechHub Uganda (Kampala Road)\n⭐ 4.9/5 (127 reviews)\n\n💻 Dell Inspiron - 1.6M\n🏆 A+ Quality | 8GB RAM, 256GB SSD\n📍 Computer Point (Garden City)\n⭐ 4.7/5 (89 reviews)\n\nWant more details on any of these?";
      } else if (query.includes('haircut')) {
        response = "Found 6 salons with availability tomorrow:\n\n✂️ Bob's Barbershop (Ntinda)\n🏆 A+ Quality\n⏰ Available: 8am, 10am, 2pm\n💰 Haircut: 30k UGX\n\n✂️ Glam Studio (Kololo)\n🏆 A++ Quality\n⏰ Available: 9am, 11am\n💰 Haircut: 50k UGX\n\nWhich time works for you?";
      } else {
        response = "I found several great phone shops in Kampala:\n\n📱 TechHub Uganda - A++ Verified\n📍 Kampala Road\n⭐ 4.9/5 | 500+ reviews\n\n📱 Mobile Store - A+ Verified\n📍 Garden City Mall\n⭐ 4.7/5 | 320+ reviews\n\nWant to see their inventory?";
      }
      setChatMessages(prev => [...prev, { type: 'ai', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">KyakuShien</span>
              <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">🇺🇬 Uganda</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#how" className="text-gray-700 hover:text-blue-600">How It Works</a>
              <a href="#categories" className="text-gray-700 hover:text-blue-600">Categories</a>
              <a href="#business" className="text-gray-700 hover:text-blue-600">For Businesses</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600">About</a>
            </div>
            <div className="flex items-center space-x-4">
              <select className="border rounded px-2 py-1 text-sm">
                <option>🇬🇧 English</option>
                <option>🇺🇬 Luganda</option>
                <option>🇰🇪 Swahili</option>
              </select>
              <button className="text-blue-600 hover:text-blue-700 font-medium">Sign In</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                One Chat.<br />Every Business.<br />Verified Quality.
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Shop, order, book—anything in Uganda. Talk to one AI assistant that speaks your language and verifies quality for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </button>
                <button className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-900 transition flex items-center justify-center">
                  <Store className="w-5 h-5 mr-2" />
                  List Your Business
                </button>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Quality verified</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>

            {/* Hero Chat Demo */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
              <div className="flex items-center mb-4 pb-4 border-b">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div className="ml-3">
                  <div className="font-semibold">KyakuShien Assistant</div>
                  <div className="text-xs text-green-600 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                    Online
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickSearch(search)}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded transition text-left"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">12,400+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <Store className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">2,470</div>
              <div className="text-gray-600">Verified Businesses</div>
            </div>
            <div>
              <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">94.2%</div>
              <div className="text-gray-600">Quality Score</div>
            </div>
            <div>
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-900">2.1%</div>
              <div className="text-gray-600">Return Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple. Fast. Quality-Guaranteed.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Customers */}
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-2 text-blue-600" />
                  For Customers
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg mb-1">💬 Chat Your Need</h4>
                      <p className="text-gray-600">"I want pizza in Nakawa" or "Best laptop under 2M"</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg mb-1">🏆 AI Finds Best Options</h4>
                      <p className="text-gray-600">Quality-verified businesses ranked by score, price, and reviews</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg mb-1">✅ We Handle Everything</h4>
                      <p className="text-gray-600">Order, pay, track—all in one place. No app switching!</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Start Shopping Free
                </button>
              </div>
            </div>

            {/* For Businesses */}
            <div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Store className="w-6 h-6 mr-2 text-green-600" />
                  For Businesses
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg mb-1">📝 List Your Business</h4>
                      <p className="text-gray-600">No website needed! Just sign up and add your products/services</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg mb-1">🏆 Get Quality Verified</h4>
                      <p className="text-gray-600">Earn A++, A+, B++, or B+ badges. Build customer trust.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-lg mb-1">💰 Grow Sales</h4>
                      <p className="text-gray-600">We bring customers to you. You just fulfill orders!</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-6 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                  List Your Business
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Can You Find?</h2>
            <p className="text-xl text-gray-600">From food to fashion, tech to travel—everything Uganda offers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition cursor-pointer border border-gray-200">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.count} businesses</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-blue-600 font-semibold hover:text-blue-700">
              Browse All Categories →
            </button>
          </div>
        </div>
      </section>

      {/* Quality Guarantee */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Trust KyakuShien?</h2>
            <p className="text-xl text-blue-100">Quality-first marketplace with real guarantees</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
              <Shield className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Quality Verified</h3>
              <p className="text-blue-100">Every business gets graded: A++, A+, B++, B+. Real inspections, not fake reviews.</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
              <Globe className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Multilingual Support</h3>
              <p className="text-blue-100">Chat in English, Luganda, or Swahili. Language should never be a barrier.</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
              <Zap className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Instant Answers</h3>
              <p className="text-blue-100">24/7 AI support that actually understands you. Get answers in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Plans */}
      <section id="business" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Grow Your Business</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Option A */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Have a Website?</h3>
                <p className="text-gray-600">Add our AI chat widget</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>AI chat widget for your site</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>Admin dashboard for monitoring</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>Quality verification badge</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>Keep your branding</span>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900">From $29<span className="text-xl text-gray-600">/month</span></div>
              </div>
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Get Widget
              </button>
            </div>

            {/* Option B */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border-2 border-green-300">
              <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Website? No Problem!</h3>
                <p className="text-gray-600">List in our marketplace</p>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>List in KyakuShien marketplace</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>We handle chat, orders, payments</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>Quality verification included</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span>You just fulfill orders</span>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900">$10<span className="text-xl text-gray-600">/month</span></div>
                <div className="text-sm text-gray-600 mt-1">+ 5% commission per sale</div>
              </div>
              <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                List Business
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Businesses, Real Results</h2>
            <p className="text-xl text-gray-600">See how KyakuShien is transforming Uganda's commerce</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">"Pizza orders up 156% since joining KyakuShien. The AI handles most questions automatically!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2K</div>
                <div className="ml-3">
                  <div className="font-semibold">2000 Pizza</div>
                  <div className="text-sm text-gray-600">Kampala</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">"No website needed—KyakuShien brings customers to us. Best decision for my barbershop!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">BB</div>
                <div className="ml-3">
                  <div className="font-semibold">Bob's Barbershop</div>
                  <div className="text-sm text-gray-600">Ntinda</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-700 mb-4">"Quality badge increased customer trust. Our sales doubled in 3 months!"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">TH</div>
                <div className="ml-3">
                  <div className="font-semibold">TechHub Uganda</div>
                  <div className="text-sm text-gray-600">Kampala Road</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Shopping Made Easy?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of happy customers and businesses on KyakuShien</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition">
              Start Shopping Now - Free
            </button>
            <button className="bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-900 transition">
              List Your Business - Free Trial
            </button>
          </div>

          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Setup in 5 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-blue-400" />
                <span className="ml-2 text-xl font-bold text-white">KyakuShien</span>
              </div>
              <p className="text-sm mb-4">Uganda's smart shopping concierge. One chat for everything.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition">Facebook</a>
                <a href="#" className="hover:text-white transition">Instagram</a>
                <a href="#" className="hover:text-white transition">Twitter</a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">For Customers</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Browse Categories</a></li>
                <li><a href="#" className="hover:text-white transition">Quality Standards</a></li>
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">For Businesses</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">List Your Business</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition">Partner Program</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© 2025 KyakuShien • Made in Uganda 🇺🇬</p>
            <div className="flex space-x-6 text-sm mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

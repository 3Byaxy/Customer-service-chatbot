"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">KyakuShien</h3>
            <p className="text-gray-400 text-sm">
              Uganda's smart shopping assistant. One chat for everything.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
              <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
              <li><Link href="/support" className="hover:text-white">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Businesses</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/for-businesses" className="hover:text-white">List Your Business</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/quality-standards" className="hover:text-white">Quality Standards</Link></li>
              <li><Link href="/business-support" className="hover:text-white">Business Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4 md:mb-0">
              <span>Categories: Food | Electronics | Fashion | Services | More</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Languages: English | Luganda | Swahili</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-4">
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4 md:mb-0">
              <span>Payment Methods:</span>
              <div className="flex gap-2">
                <div className="w-6 h-4 bg-orange-500 rounded text-xs flex items-center justify-center text-white">M</div>
                <div className="w-6 h-4 bg-blue-600 rounded text-xs flex items-center justify-center text-white">V</div>
                <div className="w-6 h-4 bg-green-600 rounded text-xs flex items-center justify-center text-white">C</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Social:</span>
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">f</div>
                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-white text-xs">i</div>
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-white text-xs">t</div>
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">w</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              © 2025 KyakuShien • Made in Uganda 🇺🇬
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
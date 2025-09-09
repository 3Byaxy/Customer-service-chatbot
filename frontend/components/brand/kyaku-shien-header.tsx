"use client"

import { KYAKU_SHIEN_BRAND } from "../../../backend/config/branding-system"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, User, Menu, X } from "lucide-react"
import { useState } from "react"

interface KyakuShienHeaderProps {
  title?: string
  subtitle?: string
  showNotifications?: boolean
  showUserMenu?: boolean
  className?: string
}

export default function KyakuShienHeader({
  title = "KyakuShien",
  subtitle = "AI-powered Customer Support Platform",
  showNotifications = true,
  showUserMenu = true,
  className = "",
}: KyakuShienHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header
      className={`bg-white border-b border-gray-200 shadow-sm ${className}`}
      style={{
        fontFamily: KYAKU_SHIEN_BRAND.typography.primary,
        color: KYAKU_SHIEN_BRAND.colors.text.primary,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background: `linear-gradient(135deg, ${KYAKU_SHIEN_BRAND.colors.primary} 0%, ${KYAKU_SHIEN_BRAND.colors.accent} 100%)`,
                  fontFamily: KYAKU_SHIEN_BRAND.typography.headings,
                }}
              >
                客
              </div>
              <div className="hidden sm:block">
                <h1
                  className="text-xl font-bold"
                  style={{
                    fontFamily: KYAKU_SHIEN_BRAND.typography.headings,
                    color: KYAKU_SHIEN_BRAND.colors.primary,
                  }}
                >
                  {title}
                </h1>
                <p
                  className="text-sm"
                  style={{
                    color: KYAKU_SHIEN_BRAND.colors.text.secondary,
                  }}
                >
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-6">
              <a
                href="#dashboard"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                style={{ color: KYAKU_SHIEN_BRAND.colors.text.primary }}
              >
                Dashboard
              </a>
              <a
                href="#conversations"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                style={{ color: KYAKU_SHIEN_BRAND.colors.text.primary }}
              >
                Conversations
              </a>
              <a
                href="#analytics"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                style={{ color: KYAKU_SHIEN_BRAND.colors.text.primary }}
              >
                Analytics
              </a>
              <a
                href="#settings"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                style={{ color: KYAKU_SHIEN_BRAND.colors.text.primary }}
              >
                Settings
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {showNotifications && (
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                    3
                  </Badge>
                </Button>
              )}

              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>

              {showUserMenu && (
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Admin</span>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#dashboard"
                className="text-base font-medium hover:text-blue-600 transition-colors"
                style={{ color: KYAKU_SHIEN_BRAND.colors.text.primary }}
              >
                Dashboard
              </a>
              <a
                href="#conversations"
                className="text-base font-medium hover:text-blue-600 transition-colors"
                style={{ color: KYAKU_SHIEN_BRAND.colors.text.primary }}
              >
                Conversations
              </a>
              <a
                href="#analytics"
                className="text-base font-medium hover:text-blue-600 transition-colors"
                style={{ color: KYAKU_SHIEN_BRAND.colors.text.primary }}
              >
                Analytics
              </a>
              <a
                href="#settings"
                className="text-base font-medium hover:text-blue-600 transition-colors"
                style={{ color: KYAKU_SHIEN_BRAND.colors.text.primary }}
              >
                Settings
              </a>
            </nav>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                {showNotifications && (
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                      3
                    </Badge>
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>

              {showUserMenu && (
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Admin</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

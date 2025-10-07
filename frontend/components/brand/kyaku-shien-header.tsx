"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Shield, BarChart3, Settings, Users, Bell, Search } from "lucide-react"
import { KYAKU_SHIEN_BRAND } from "../../../backend/config/branding-system"

interface KyakuShienHeaderProps {
  currentPage?: string
  onNavigate?: (page: string) => void
  showNotifications?: boolean
  notificationCount?: number
}

export default function KyakuShienHeader({
  currentPage = "dashboard",
  onNavigate,
  showNotifications = true,
  notificationCount = 0,
}: KyakuShienHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "conversations", label: "Conversations", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleNavigation = (pageId: string) => {
    onNavigate?.(pageId)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background: `linear-gradient(135deg, ${KYAKU_SHIEN_BRAND.colors.primary} 0%, ${KYAKU_SHIEN_BRAND.colors.secondary} 100%)`,
                  fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.heading,
                }}
              >
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.heading }}
                >
                  {KYAKU_SHIEN_BRAND.name}
                </h1>
                <p
                  className="text-xs text-gray-500 hidden sm:block"
                  style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.primary }}
                >
                  {KYAKU_SHIEN_BRAND.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center space-x-2 ${
                    isActive ? "text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                  style={{
                    backgroundColor: isActive ? KYAKU_SHIEN_BRAND.colors.primary : "transparent",
                    fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.primary,
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-600 hover:text-gray-900">
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            {showNotifications && (
              <div className="relative">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <Bell className="h-4 w-4" />
                </Button>
                {notificationCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 text-white"
                    style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.danger }}
                  >
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Badge>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full justify-start space-x-3 ${
                      isActive ? "text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: isActive ? KYAKU_SHIEN_BRAND.colors.primary : "transparent",
                      fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.primary,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                )
              })}
            </nav>

            {/* Mobile Search */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" size="sm" className="w-full justify-start space-x-3 text-gray-600">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

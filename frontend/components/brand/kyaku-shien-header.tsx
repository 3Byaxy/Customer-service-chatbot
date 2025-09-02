"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Shield, BarChart3, Settings, Users } from "lucide-react"
import { KYAKU_SHIEN_BRAND } from "../../../backend/config/branding-system"

interface KyakuShienHeaderProps {
  currentPage?: string
  onNavigate?: (page: string) => void
  showSystemStatus?: boolean
}

export default function KyakuShienHeader({
  currentPage = "dashboard",
  onNavigate,
  showSystemStatus = true,
}: KyakuShienHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "admin", label: "Admin Panel", icon: Shield },
    { id: "users", label: "User Management", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <header className="ks-dashboard-header">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* KyakuShien Logo */}
              <div className="p-2 bg-gradient-to-br from-ks-primary to-ks-accent rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>

              <div>
                <h1 className="ks-heading text-2xl font-bold">{KYAKU_SHIEN_BRAND.name}</h1>
                <p className="text-sm text-ks-text-secondary">{KYAKU_SHIEN_BRAND.tagline}</p>
              </div>
            </div>

            {/* Japanese Characters */}
            <div className="hidden md:block">
              <span className="text-lg font-medium text-ks-text-muted">客支援</span>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? "bg-ks-primary text-white shadow-md"
                      : "text-ks-text-secondary hover:text-ks-primary hover:bg-ks-background"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* System Status and Actions */}
          <div className="flex items-center gap-4">
            {showSystemStatus && (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-ks-text-secondary">System Operational</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  v2.0.0
                </Badge>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden bg-transparent"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2 mt-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate?.(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      currentPage === item.id
                        ? "bg-ks-primary text-white"
                        : "text-ks-text-secondary hover:text-ks-primary hover:bg-ks-background"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {showSystemStatus && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-ks-text-secondary">System Operational</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    v2.0.0
                  </Badge>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

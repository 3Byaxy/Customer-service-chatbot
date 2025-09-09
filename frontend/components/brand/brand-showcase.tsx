"use client"

import { KYAKU_SHIEN_BRAND, KIZUNA_AI_BRAND, UNIFIED_BRAND } from "../../../backend/config/branding-system"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import KyakuShienHeader from "./kyaku-shien-header"
import KizunaAIAvatar from "./kizuna-ai-avatar"

export default function BrandShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <KyakuShienHeader
          title="Brand System Showcase"
          subtitle="KyakuShien × KizunaAI Visual Identity"
          className="mb-8"
        />

        {/* Brand Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* KyakuShien Brand */}
          <Card className="overflow-hidden">
            <CardHeader
              className="text-white"
              style={{
                background: `linear-gradient(135deg, ${KYAKU_SHIEN_BRAND.colors.primary} 0%, ${KYAKU_SHIEN_BRAND.colors.accent} 100%)`,
              }}
            >
              <CardTitle className="text-2xl font-bold" style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.headings }}>
                {KYAKU_SHIEN_BRAND.fullName}
              </CardTitle>
              <p className="opacity-90">{KYAKU_SHIEN_BRAND.tagline}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Positioning</h4>
                  <p className="text-sm text-gray-600">{KYAKU_SHIEN_BRAND.positioning}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Color Palette</h4>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.accent }}
                      title="Accent"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Typography</h4>
                  <div className="space-y-1">
                    <p style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.headings }} className="font-bold">
                      Headings: Montserrat
                    </p>
                    <p style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.primary }}>Body: Inter</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KizunaAI Brand */}
          <Card className="overflow-hidden">
            <CardHeader
              className="text-white"
              style={{
                background: KIZUNA_AI_BRAND.colors.gradient.primary,
              }}
            >
              <div className="flex items-center space-x-3">
                <KizunaAIAvatar size="md" variant="orb" isActive={true} />
                <div>
                  <CardTitle className="text-2xl font-bold" style={{ fontFamily: KIZUNA_AI_BRAND.typography.headings }}>
                    {KIZUNA_AI_BRAND.fullName}
                  </CardTitle>
                  <p className="opacity-90">{KIZUNA_AI_BRAND.tagline}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Personality</h4>
                  <p className="text-sm text-gray-600">{KIZUNA_AI_BRAND.personality}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Color Palette</h4>
                  <div className="flex space-x-2">
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: KIZUNA_AI_BRAND.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: KIZUNA_AI_BRAND.colors.secondary }}
                      title="Secondary"
                    />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: KIZUNA_AI_BRAND.colors.accent }}
                      title="Accent"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Typography</h4>
                  <div className="space-y-1">
                    <p style={{ fontFamily: KIZUNA_AI_BRAND.typography.headings }} className="font-bold">
                      Headings: Nunito
                    </p>
                    <p style={{ fontFamily: KIZUNA_AI_BRAND.typography.primary }}>Body: Poppins</p>
                    <p style={{ fontFamily: KIZUNA_AI_BRAND.typography.chat }}>Chat: Quicksand</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avatar Variations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>KizunaAI Avatar Variations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center space-y-2">
                <KizunaAIAvatar size="lg" variant="orb" mood="happy" isActive={true} />
                <p className="text-sm font-medium">Active Orb</p>
              </div>
              <div className="text-center space-y-2">
                <KizunaAIAvatar size="lg" variant="ribbon" mood="excited" />
                <p className="text-sm font-medium">Ribbon Style</p>
              </div>
              <div className="text-center space-y-2">
                <KizunaAIAvatar size="lg" variant="geometric" mood="thinking" />
                <p className="text-sm font-medium">Geometric</p>
              </div>
              <div className="text-center space-y-2">
                <KizunaAIAvatar size="lg" variant="simple" mood="calm" />
                <p className="text-sm font-medium">Simple</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unified Brand Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="outline" className="mb-2">
                  Website Header
                </Badge>
                <p className="text-sm text-gray-600">Use KyakuShien branding for professional, corporate sections</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="outline" className="mb-2">
                  Chat Interface
                </Badge>
                <p className="text-sm text-gray-600">Use KizunaAI branding for friendly, conversational interactions</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Badge variant="outline" className="mb-2">
                  Marketing
                </Badge>
                <p className="text-sm text-gray-600">Combine both brands: "{UNIFIED_BRAND.marketing.tagline}"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

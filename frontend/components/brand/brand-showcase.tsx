"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Type, Zap, Heart, Shield, Bot } from "lucide-react"
import { KYAKU_SHIEN_BRAND, KIZUNA_AI_BRAND } from "../../../backend/config/branding-system"
import KizunaAIAvatar from "./kizuna-ai-avatar"

export default function BrandShowcase() {
  const [selectedMood, setSelectedMood] = useState<"happy" | "thinking" | "helping" | "concerned" | "neutral">("happy")

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1
            className="text-4xl font-bold text-gray-900"
            style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.heading }}
          >
            Brand System Showcase
          </h1>
          <p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.primary }}
          >
            Explore the complete visual identity system for KyakuShien and KizunaAI
          </p>
        </div>

        <Tabs defaultValue="kyaku-shien" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="kyaku-shien" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>KyakuShien</span>
            </TabsTrigger>
            <TabsTrigger value="kizuna-ai" className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <span>KizunaAI</span>
            </TabsTrigger>
          </TabsList>

          {/* KyakuShien Brand */}
          <TabsContent value="kyaku-shien" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" style={{ color: KYAKU_SHIEN_BRAND.colors.primary }} />
                  <span>KyakuShien Brand Identity</span>
                </CardTitle>
                <CardDescription>{KYAKU_SHIEN_BRAND.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span>Color Palette</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {Object.entries(KYAKU_SHIEN_BRAND.colors).map(([name, color]) => {
                      if (typeof color === "object") return null
                      return (
                        <div key={name} className="text-center">
                          <div
                            className="w-16 h-16 rounded-lg mx-auto mb-2 shadow-md"
                            style={{ backgroundColor: color }}
                          ></div>
                          <p className="text-sm font-medium capitalize">{name}</p>
                          <p className="text-xs text-gray-500">{color}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Type className="h-4 w-4" />
                    <span>Typography</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Primary Font (Inter)</p>
                      <p className="text-2xl" style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.primary }}>
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Heading Font (Poppins)</p>
                      <p
                        className="text-2xl font-bold"
                        style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.fontFamily.heading }}
                      >
                        Professional & Trustworthy
                      </p>
                    </div>
                  </div>
                </div>

                {/* Components */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Component Examples</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.primary }}>Primary Button</Button>
                    <Button variant="outline" style={{ borderColor: KYAKU_SHIEN_BRAND.colors.primary }}>
                      Secondary Button
                    </Button>
                    <Badge style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.success }}>Success Badge</Badge>
                    <Badge style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.warning }}>Warning Badge</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KizunaAI Brand */}
          <TabsContent value="kizuna-ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" style={{ color: KIZUNA_AI_BRAND.colors.primary }} />
                  <span>KizunaAI Brand Identity</span>
                </CardTitle>
                <CardDescription>{KIZUNA_AI_BRAND.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personality */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>Personality</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-sm text-gray-600 mb-1">Tone</p>
                      <p>{KIZUNA_AI_BRAND.personality.tone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-600 mb-1">Style</p>
                      <p>{KIZUNA_AI_BRAND.personality.style}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="font-medium text-sm text-gray-600 mb-2">Key Traits</p>
                      <div className="flex flex-wrap gap-2">
                        {KIZUNA_AI_BRAND.personality.traits.map((trait) => (
                          <Badge key={trait} variant="outline" style={{ borderColor: KIZUNA_AI_BRAND.colors.primary }}>
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span>Color Palette</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-lg mx-auto mb-2 shadow-md"
                        style={{ backgroundColor: KIZUNA_AI_BRAND.colors.primary }}
                      ></div>
                      <p className="text-sm font-medium">Primary</p>
                      <p className="text-xs text-gray-500">{KIZUNA_AI_BRAND.colors.primary}</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-lg mx-auto mb-2 shadow-md"
                        style={{ backgroundColor: KIZUNA_AI_BRAND.colors.secondary }}
                      ></div>
                      <p className="text-sm font-medium">Secondary</p>
                      <p className="text-xs text-gray-500">{KIZUNA_AI_BRAND.colors.secondary}</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-lg mx-auto mb-2 shadow-md"
                        style={{ background: KIZUNA_AI_BRAND.colors.gradient.primary }}
                      ></div>
                      <p className="text-sm font-medium">Gradient</p>
                      <p className="text-xs text-gray-500">Primary</p>
                    </div>
                  </div>
                </div>

                {/* Avatar Showcase */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Avatar System</span>
                  </h3>
                  <div className="space-y-4">
                    {/* Mood Selection */}
                    <div>
                      <p className="text-sm font-medium mb-2">Select Mood:</p>
                      <div className="flex flex-wrap gap-2">
                        {(["happy", "thinking", "helping", "concerned", "neutral"] as const).map((mood) => (
                          <Button
                            key={mood}
                            variant={selectedMood === mood ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedMood(mood)}
                            className="capitalize"
                          >
                            {mood}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Avatar Variants */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="text-center space-y-3">
                        <h4 className="font-medium">Orb Variant</h4>
                        <div className="flex justify-center space-x-2">
                          <KizunaAIAvatar size="sm" variant="orb" mood={selectedMood} />
                          <KizunaAIAvatar size="md" variant="orb" mood={selectedMood} />
                          <KizunaAIAvatar size="lg" variant="orb" mood={selectedMood} isActive />
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h4 className="font-medium">Character Variant</h4>
                        <div className="flex justify-center space-x-2">
                          <KizunaAIAvatar size="sm" variant="character" mood={selectedMood} />
                          <KizunaAIAvatar size="md" variant="character" mood={selectedMood} />
                          <KizunaAIAvatar size="lg" variant="character" mood={selectedMood} isActive />
                        </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h4 className="font-medium">Minimal Variant</h4>
                        <div className="flex justify-center space-x-2">
                          <KizunaAIAvatar size="sm" variant="minimal" mood={selectedMood} />
                          <KizunaAIAvatar size="md" variant="minimal" mood={selectedMood} />
                          <KizunaAIAvatar size="lg" variant="minimal" mood={selectedMood} isActive />
                        </div>
                      </div>
                    </div>

                    {/* Animated States */}
                    <div className="text-center space-y-3">
                      <h4 className="font-medium">Animated States</h4>
                      <div className="flex justify-center space-x-4">
                        <div className="text-center">
                          <KizunaAIAvatar size="lg" variant="orb" mood={selectedMood} isActive />
                          <p className="text-xs mt-1">Active</p>
                        </div>
                        <div className="text-center">
                          <KizunaAIAvatar size="lg" variant="orb" mood={selectedMood} isTyping />
                          <p className="text-xs mt-1">Typing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Type className="h-4 w-4" />
                    <span>Typography</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Primary Font (Quicksand)</p>
                      <p className="text-2xl" style={{ fontFamily: KIZUNA_AI_BRAND.typography.fontFamily.primary }}>
                        Friendly and approachable communication
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Heading Font (Nunito)</p>
                      <p
                        className="text-2xl font-bold"
                        style={{ fontFamily: KIZUNA_AI_BRAND.typography.fontFamily.heading }}
                      >
                        Warm & Intelligent
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Chat Font (Poppins)</p>
                      <p className="text-lg" style={{ fontFamily: KIZUNA_AI_BRAND.typography.fontFamily.chat }}>
                        Hello! How can I help you today? 😊
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

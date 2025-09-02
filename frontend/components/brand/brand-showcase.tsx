"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import KyakuShienHeader from "./kyaku-shien-header"
import KizunaAIAvatar from "./kizuna-ai-avatar"
import { Shield, Bot, Palette, Type, Zap, Heart } from "lucide-react"
import { KYAKU_SHIEN_BRAND, KIZUNA_AI_BRAND, UNIFIED_BRAND } from "../../../backend/config/branding-system"

export default function BrandShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ks-background to-kai-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="p-4 bg-gradient-to-br from-ks-primary to-ks-accent rounded-xl mb-3">
                <Shield className="h-12 w-12 text-white mx-auto" />
              </div>
              <h2 className="ks-heading text-2xl font-bold">{KYAKU_SHIEN_BRAND.name}</h2>
              <p className="text-sm text-ks-text-secondary">{KYAKU_SHIEN_BRAND.tagline}</p>
            </div>

            <div className="text-4xl font-light text-gray-400">+</div>

            <div className="text-center">
              <div className="mb-3">
                <KizunaAIAvatar size="xl" variant="full" isActive={true} />
              </div>
              <h2 className="kai-heading text-2xl font-bold">{KIZUNA_AI_BRAND.name}</h2>
              <p className="text-sm text-kai-text-secondary kai-brand">{KIZUNA_AI_BRAND.tagline}</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-ks-primary via-kai-primary to-kai-secondary bg-clip-text text-transparent">
            Brand Identity System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{UNIFIED_BRAND.marketing.description}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="kyaku-shien">KyakuShien</TabsTrigger>
            <TabsTrigger value="kizuna-ai">KizunaAI</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="ks-card">
                <CardHeader>
                  <CardTitle className="ks-heading flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {KYAKU_SHIEN_BRAND.name} Platform
                  </CardTitle>
                  <CardDescription>{KYAKU_SHIEN_BRAND.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Positioning</h4>
                    <p className="text-sm text-ks-text-secondary">{KYAKU_SHIEN_BRAND.positioning}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Usage Context</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Website Headers</Badge>
                      <Badge variant="outline">Admin Panels</Badge>
                      <Badge variant="outline">Business Documents</Badge>
                      <Badge variant="outline">Corporate Materials</Badge>
                    </div>
                  </div>

                  <Button className="ks-button w-full">View KyakuShien Dashboard</Button>
                </CardContent>
              </Card>

              <Card className="kai-card">
                <CardHeader>
                  <CardTitle className="kai-heading flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    {KIZUNA_AI_BRAND.name} Assistant
                  </CardTitle>
                  <CardDescription className="kai-brand">{KIZUNA_AI_BRAND.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personality</h4>
                    <p className="text-sm text-kai-text-secondary kai-brand">{KIZUNA_AI_BRAND.personality}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Usage Context</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Chat Interfaces</Badge>
                      <Badge variant="outline">Customer Support</Badge>
                      <Badge variant="outline">User Interactions</Badge>
                      <Badge variant="outline">Voice Responses</Badge>
                    </div>
                  </div>

                  <Button className="kai-button w-full">Chat with KizunaAI</Button>
                </CardContent>
              </Card>
            </div>

            {/* Marketing Message */}
            <Card className="mt-8">
              <CardContent className="pt-6 text-center">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-ks-primary to-kai-primary bg-clip-text text-transparent">
                  {UNIFIED_BRAND.marketing.tagline}
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Experience the perfect blend of professional enterprise features with warm, intelligent customer
                  interactions.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KyakuShien Brand */}
          <TabsContent value="kyaku-shien">
            <div className="space-y-8">
              <Card className="ks-card">
                <CardHeader>
                  <CardTitle className="ks-heading">KyakuShien Brand Identity</CardTitle>
                  <CardDescription>Professional, corporate, trustworthy platform branding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Brand Attributes</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-ks-primary rounded-full"></div>
                          Professional & Corporate
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-ks-primary rounded-full"></div>
                          Trustworthy & Reliable
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-ks-primary rounded-full"></div>
                          Enterprise-grade
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-ks-primary rounded-full"></div>
                          Solution-focused
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Typography</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-bold text-lg ks-heading">Montserrat Bold</p>
                          <p className="text-sm text-gray-600">Headings & Titles</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="ks-brand">Inter Regular</p>
                          <p className="text-sm text-gray-600">Body Text & UI</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Color Palette</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.primary }}
                        ></div>
                        <p className="text-sm font-medium">Navy Blue</p>
                        <p className="text-xs text-gray-500">{KYAKU_SHIEN_BRAND.colors.primary}</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.secondary }}
                        ></div>
                        <p className="text-sm font-medium">Charcoal</p>
                        <p className="text-xs text-gray-500">{KYAKU_SHIEN_BRAND.colors.secondary}</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.accent }}
                        ></div>
                        <p className="text-sm font-medium">Blue Accent</p>
                        <p className="text-xs text-gray-500">{KYAKU_SHIEN_BRAND.colors.accent}</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                          style={{ backgroundColor: KYAKU_SHIEN_BRAND.colors.background }}
                        ></div>
                        <p className="text-sm font-medium">Background</p>
                        <p className="text-xs text-gray-500">{KYAKU_SHIEN_BRAND.colors.background}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* KyakuShien Header Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>Header Component Demo</CardTitle>
                  <CardDescription>How KyakuShien branding appears in the application header</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <KyakuShienHeader currentPage="dashboard" showSystemStatus={true} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* KizunaAI Brand */}
          <TabsContent value="kizuna-ai">
            <div className="space-y-8">
              <Card className="kai-card">
                <CardHeader>
                  <CardTitle className="kai-heading">KizunaAI Brand Identity</CardTitle>
                  <CardDescription className="kai-brand">Friendly, approachable AI companion branding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Personality Traits</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-kai-primary" />
                          Warm & Empathetic
                        </li>
                        <li className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-kai-primary" />
                          Intelligent & Quick
                        </li>
                        <li className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-kai-primary" />
                          Helpful & Supportive
                        </li>
                        <li className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-kai-primary" />
                          Trustworthy Bond
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Typography</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-kai-background rounded-lg">
                          <p className="font-bold text-lg kai-heading">Nunito Bold</p>
                          <p className="text-sm text-gray-600">Headings & Titles</p>
                        </div>
                        <div className="p-3 bg-kai-background rounded-lg">
                          <p className="kai-brand">Poppins Regular</p>
                          <p className="text-sm text-gray-600">UI Elements</p>
                        </div>
                        <div className="p-3 bg-kai-background rounded-lg">
                          <p className="kai-chat-text">Quicksand Regular</p>
                          <p className="text-sm text-gray-600">Chat Messages</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Color Palette</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: KIZUNA_AI_BRAND.colors.primary }}
                        ></div>
                        <p className="text-sm font-medium">Teal</p>
                        <p className="text-xs text-gray-500">{KIZUNA_AI_BRAND.colors.primary}</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: KIZUNA_AI_BRAND.colors.secondary }}
                        ></div>
                        <p className="text-sm font-medium">Soft Pink</p>
                        <p className="text-xs text-gray-500">{KIZUNA_AI_BRAND.colors.secondary}</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg mx-auto mb-2"
                          style={{ backgroundColor: KIZUNA_AI_BRAND.colors.accent }}
                        ></div>
                        <p className="text-sm font-medium">Light Green</p>
                        <p className="text-xs text-gray-500">{KIZUNA_AI_BRAND.colors.accent}</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg mx-auto mb-2 border"
                          style={{ backgroundColor: KIZUNA_AI_BRAND.colors.background }}
                        ></div>
                        <p className="text-sm font-medium">Background</p>
                        <p className="text-xs text-gray-500">{KIZUNA_AI_BRAND.colors.background}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Gradient System</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div
                          className="w-full h-16 rounded-lg mb-2"
                          style={{ background: KIZUNA_AI_BRAND.colors.gradient.primary }}
                        ></div>
                        <p className="text-sm font-medium">Primary Gradient</p>
                        <p className="text-xs text-gray-500">Teal → Pink</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-full h-16 rounded-lg mb-2"
                          style={{ background: KIZUNA_AI_BRAND.colors.gradient.soft }}
                        ></div>
                        <p className="text-sm font-medium">Soft Gradient</p>
                        <p className="text-xs text-gray-500">Light Green → Light Pink</p>
                      </div>
                      <div className="text-center">
                        <div
                          className="w-full h-16 rounded-lg mb-2"
                          style={{ background: KIZUNA_AI_BRAND.colors.gradient.glow }}
                        ></div>
                        <p className="text-sm font-medium">Glow Gradient</p>
                        <p className="text-xs text-gray-500">Multi-color</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Avatar Showcase */}
              <Card>
                <CardHeader>
                  <CardTitle>Avatar Variations</CardTitle>
                  <CardDescription>Different KizunaAI avatar styles and states</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center space-y-3">
                      <KizunaAIAvatar size="lg" variant="orb" mood="happy" />
                      <div>
                        <p className="font-medium">Orb Style</p>
                        <p className="text-sm text-gray-500">Default state</p>
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <KizunaAIAvatar size="lg" variant="ribbon" mood="helpful" isActive={true} />
                      <div>
                        <p className="font-medium">Ribbon Style</p>
                        <p className="text-sm text-gray-500">Active state</p>
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <KizunaAIAvatar size="lg" variant="geometric" mood="thinking" />
                      <div>
                        <p className="font-medium">Geometric</p>
                        <p className="text-sm text-gray-500">Thinking mode</p>
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <KizunaAIAvatar size="lg" variant="full" mood="excited" isTyping={true} />
                      <div>
                        <p className="font-medium">Full Avatar</p>
                        <p className="text-sm text-gray-500">Typing state</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Colors */}
          <TabsContent value="colors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="ks-card">
                <CardHeader>
                  <CardTitle className="ks-heading flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    KyakuShien Colors
                  </CardTitle>
                  <CardDescription>Professional, corporate color palette</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(KYAKU_SHIEN_BRAND.colors).map(([name, value]) => {
                    if (typeof value === "object") {
                      return (
                        <div key={name}>
                          <h4 className="font-medium mb-2 capitalize">{name}</h4>
                          <div className="space-y-2 ml-4">
                            {Object.entries(value).map(([subName, subValue]) => (
                              <div key={subName} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded border" style={{ backgroundColor: subValue }}></div>
                                <div>
                                  <p className="font-medium text-sm capitalize">{subName}</p>
                                  <p className="text-xs text-gray-500">{subValue}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={name} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border" style={{ backgroundColor: value }}></div>
                        <div>
                          <p className="font-medium capitalize">{name}</p>
                          <p className="text-sm text-gray-500">{value}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="kai-card">
                <CardHeader>
                  <CardTitle className="kai-heading flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    KizunaAI Colors
                  </CardTitle>
                  <CardDescription className="kai-brand">Warm, approachable color palette</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(KIZUNA_AI_BRAND.colors).map(([name, value]) => {
                    if (typeof value === "object") {
                      return (
                        <div key={name}>
                          <h4 className="font-medium mb-2 capitalize">{name.replace(/([A-Z])/g, " $1").trim()}</h4>
                          <div className="space-y-2 ml-4">
                            {Object.entries(value).map(([subName, subValue]) => (
                              <div key={subName} className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded border"
                                  style={{
                                    background: subValue.startsWith("linear-gradient") ? subValue : subValue,
                                    backgroundColor: !subValue.startsWith("linear-gradient") ? subValue : undefined,
                                  }}
                                ></div>
                                <div>
                                  <p className="font-medium text-sm capitalize">{subName}</p>
                                  <p className="text-xs text-gray-500 max-w-xs truncate">{subValue}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={name} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border" style={{ backgroundColor: value }}></div>
                        <div>
                          <p className="font-medium capitalize">{name}</p>
                          <p className="text-sm text-gray-500">{value}</p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Typography */}
          <TabsContent value="typography">
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="ks-card">
                  <CardHeader>
                    <CardTitle className="ks-heading flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      KyakuShien Typography
                    </CardTitle>
                    <CardDescription>Professional, clean typography system</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Font Families</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p
                            className="text-lg font-bold"
                            style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.headings }}
                          >
                            Montserrat Bold
                          </p>
                          <p className="text-sm text-gray-600">Headings & Titles</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-base" style={{ fontFamily: KYAKU_SHIEN_BRAND.typography.primary }}>
                            Inter Regular
                          </p>
                          <p className="text-sm text-gray-600">Body text & UI elements</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Typography Scale</h4>
                      <div className="space-y-2">
                        <h1 className="ks-heading text-4xl font-bold">Heading 1</h1>
                        <h2 className="ks-heading text-3xl font-bold">Heading 2</h2>
                        <h3 className="ks-heading text-2xl font-semibold">Heading 3</h3>
                        <h4 className="ks-heading text-xl font-semibold">Heading 4</h4>
                        <p className="ks-brand text-base">Body text - Professional and clean</p>
                        <p className="ks-brand text-sm text-ks-text-secondary">Small text - Secondary information</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="kai-card">
                  <CardHeader>
                    <CardTitle className="kai-heading flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      KizunaAI Typography
                    </CardTitle>
                    <CardDescription className="kai-brand">Friendly, approachable typography system</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Font Families</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-kai-background rounded-lg">
                          <p className="text-lg font-bold" style={{ fontFamily: KIZUNA_AI_BRAND.typography.headings }}>
                            Nunito Bold
                          </p>
                          <p className="text-sm text-gray-600">Headings & Titles</p>
                        </div>
                        <div className="p-4 bg-kai-background rounded-lg">
                          <p className="text-base" style={{ fontFamily: KIZUNA_AI_BRAND.typography.primary }}>
                            Poppins Regular
                          </p>
                          <p className="text-sm text-gray-600">UI elements</p>
                        </div>
                        <div className="p-4 bg-kai-background rounded-lg">
                          <p className="text-base" style={{ fontFamily: KIZUNA_AI_BRAND.typography.chat }}>
                            Quicksand Regular
                          </p>
                          <p className="text-sm text-gray-600">Chat messages</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Typography Scale</h4>
                      <div className="space-y-2">
                        <h1 className="kai-heading text-4xl font-bold">Heading 1</h1>
                        <h2 className="kai-heading text-3xl font-bold">Heading 2</h2>
                        <h3 className="kai-heading text-2xl font-semibold">Heading 3</h3>
                        <h4 className="kai-heading text-xl font-semibold">Heading 4</h4>
                        <p className="kai-brand text-base">Body text - Warm and friendly</p>
                        <p className="kai-chat-text text-base">Chat text - Conversational and approachable</p>
                        <p className="kai-brand text-sm text-kai-text-secondary">Small text - Helpful information</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Typography in Context</CardTitle>
                  <CardDescription>How typography appears in real application scenarios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg bg-ks-background">
                      <h3 className="ks-heading text-xl font-bold mb-4">Dashboard Header</h3>
                      <p className="ks-brand mb-4">
                        Welcome to your KyakuShien dashboard. Monitor your customer support metrics and system
                        performance.
                      </p>
                      <div className="space-y-2">
                        <p className="ks-brand text-sm text-ks-text-secondary">System Status: Operational</p>
                        <p className="ks-brand text-sm text-ks-text-secondary">Last Updated: 2 minutes ago</p>
                      </div>
                    </div>

                    <div className="p-6 border rounded-lg bg-kai-background">
                      <div className="flex items-center gap-3 mb-4">
                        <KizunaAIAvatar size="sm" variant="orb" />
                        <h3 className="kai-heading text-xl font-bold">KizunaAI Chat</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="kai-message-ai">
                          <p className="kai-chat-text">
                            Hello! I'm KizunaAI, your friendly customer support companion. How can I help you today?
                          </p>
                        </div>
                        <div className="kai-message-user ml-auto">
                          <p className="kai-chat-text text-white">I need help with my account settings.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

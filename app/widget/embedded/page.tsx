"use client"

import { useEffect, useState } from "react"
import CompactChatbotWidget from "@/components/compact-chatbot-widget"

export default function EmbeddedWidgetPage() {
  const [tenant, setTenant] = useState<string>("demo")
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      setTenant(params.get("tenant") || "demo")
    } catch {}
  }, [])

  const businessType = "telecom"

  return (
    <div style={{ width: "100%", height: "100%", background: "transparent" }}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <CompactChatbotWidget businessType={businessType} position="embedded" maxHeight={520} />
      </div>
    </div>
  )
}

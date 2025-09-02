"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Bug,
  Search,
  Download,
  Trash2,
  RefreshCw,
  Activity,
  Clock,
  User,
  Globe,
  Database,
  Zap,
  Shield,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  X,
  Menu,
} from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "success" | "debug"
  component: string
  message: string
  details: string
  userId?: string
  sessionId?: string
  duration?: number
  ip?: string
  endpoint?: string
  statusCode?: number
  requestId?: string
  userAgent?: string
}

interface LogStats {
  total: number
  info: number
  warning: number
  error: number
  success: number
  debug: number
}

const levelIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
  debug: Bug,
}

const levelColors = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  debug: "bg-gray-50 text-gray-700 border-gray-200",
}

const componentIcons = {
  "API Gateway": Globe,
  Database: Database,
  "AI Provider": Zap,
  Authentication: Shield,
  "Context Manager": MessageSquare,
  "Rate Limiter": AlertTriangle,
  "Session Manager": User,
  "Message Router": MessageSquare,
  "Analytics Engine": BarChart3,
  "Security Monitor": Shield,
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState<LogStats>({ total: 0, info: 0, warning: 0, error: 0, success: 0, debug: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isRealTime, setIsRealTime] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [componentFilter, setComponentFilter] = useState("all")
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json")
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchLogs()

    let interval: NodeJS.Timeout
    if (isRealTime && autoRefresh) {
      interval = setInterval(fetchLogs, 5000) // Refresh every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRealTime, autoRefresh, levelFilter, componentFilter, searchQuery])

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams()
      if (levelFilter !== "all") params.append("level", levelFilter)
      if (componentFilter !== "all") params.append("component", componentFilter)
      if (searchQuery) params.append("search", searchQuery)
      params.append("limit", "100")

      const response = await fetch(`/api/admin/logs?${params}`)
      const data = await response.json()

      setLogs(data.logs || [])
      setStats(data.stats || { total: 0, info: 0, warning: 0, error: 0, success: 0, debug: 0 })
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams()
      params.append("format", exportFormat)
      if (levelFilter !== "all") params.append("level", levelFilter)
      if (componentFilter !== "all") params.append("component", componentFilter)
      if (searchQuery) params.append("search", searchQuery)
      params.append("limit", "1000")

      const response = await fetch(`/api/admin/logs/export?${params}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url

        const timestamp = new Date().toISOString().split("T")[0]
        a.download = `system-logs-${timestamp}.${exportFormat}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Export failed")
      }
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      setLogs([])
      setStats({ total: 0, info: 0, warning: 0, error: 0, success: 0, debug: 0 })
    }
  }

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedLogs(newExpanded)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getComponentIcon = (component: string) => {
    const IconComponent = componentIcons[component as keyof typeof componentIcons] || Settings
    return IconComponent
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Mobile-First Container */}
      <div className="space-y-3 p-2 sm:space-y-4 sm:p-4 lg:space-y-6 lg:p-6">
        {/* Real-time Status - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${isRealTime ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                ></div>
                <span className="text-sm font-medium">{isRealTime ? "Live" : "Paused"}</span>
              </div>
              <div className="flex items-center space-x-2">
                {stats.error > 0 && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    {stats.error} Errors
                  </Badge>
                )}
                {stats.warning > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                    {stats.warning} Warnings
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="realtime-toggle" className="text-sm">
                Real-time
              </Label>
              <Switch id="realtime-toggle" checked={isRealTime} onCheckedChange={setIsRealTime} />
            </div>
          </div>
        </div>

        {/* Statistics Cards - Mobile Grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-4">
          {[
            { label: "Total", value: stats.total, icon: Activity, color: "text-gray-600" },
            { label: "Info", value: stats.info, icon: Info, color: "text-blue-600" },
            { label: "Success", value: stats.success, icon: CheckCircle, color: "text-green-600" },
            { label: "Warnings", value: stats.warning, icon: AlertTriangle, color: "text-yellow-600" },
            { label: "Errors", value: stats.error, icon: AlertCircle, color: "text-red-600" },
            { label: "Debug", value: stats.debug, icon: Bug, color: "text-gray-600" },
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index} className="p-2 sm:p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 truncate">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color} sm:text-xl lg:text-2xl`}>{stat.value}</p>
                  </div>
                  <IconComponent className={`h-3 w-3 ${stat.color} sm:h-4 sm:w-4`} />
                </div>
              </Card>
            )
          })}
        </div>

        {/* Controls Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-base sm:text-lg">System Logs</CardTitle>
                <div className="flex items-center space-x-1">
                  {isRealTime ? (
                    <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-gray-400" />
                  )}
                  <Badge variant="outline" className="text-xs">
                    {logs.length}
                  </Badge>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <div className="sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="w-full"
                >
                  {showMobileFilters ? <X className="h-4 w-4 mr-2" /> : <Menu className="h-4 w-4 mr-2" />}
                  {showMobileFilters ? "Close" : "Filters"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Desktop Controls */}
            <div className="hidden sm:flex sm:flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Switch id="details" checked={showDetails} onCheckedChange={setShowDetails} />
                <Label htmlFor="details" className="text-sm">
                  Details
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="autorefresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                <Label htmlFor="autorefresh" className="text-sm">
                  Auto Refresh
                </Label>
              </div>

              <div className="flex-1 min-w-0 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>

              <select
                value={componentFilter}
                onChange={(e) => setComponentFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white text-sm"
              >
                <option value="all">All Components</option>
                <option value="API Gateway">API Gateway</option>
                <option value="Database">Database</option>
                <option value="AI Provider">AI Provider</option>
                <option value="Authentication">Authentication</option>
                <option value="Context Manager">Context Manager</option>
                <option value="Rate Limiter">Rate Limiter</option>
                <option value="Session Manager">Session Manager</option>
                <option value="Message Router">Message Router</option>
                <option value="Analytics Engine">Analytics Engine</option>
                <option value="Security Monitor">Security Monitor</option>
              </select>

              <div className="flex items-center gap-2">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as "json" | "csv")}
                  className="px-2 py-1 border rounded text-sm bg-white"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                </select>

                <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                  <Download className="h-4 w-4 mr-1" />
                  {isExporting ? "..." : "Export"}
                </Button>

                <Button variant="outline" size="sm" onClick={fetchLogs}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>

                <Button variant="outline" size="sm" onClick={handleClearLogs} className="text-red-600 bg-transparent">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Mobile Controls */}
            {showMobileFilters && (
              <div className="sm:hidden space-y-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="details-mobile" checked={showDetails} onCheckedChange={setShowDetails} />
                    <Label htmlFor="details-mobile" className="text-sm">
                      Details
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="autorefresh-mobile" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                    <Label htmlFor="autorefresh-mobile" className="text-sm">
                      Auto Refresh
                    </Label>
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-white text-sm"
                  >
                    <option value="all">All Levels</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="debug">Debug</option>
                  </select>

                  <select
                    value={componentFilter}
                    onChange={(e) => setComponentFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-white text-sm"
                  >
                    <option value="all">All Components</option>
                    <option value="API Gateway">API Gateway</option>
                    <option value="Database">Database</option>
                    <option value="AI Provider">AI Provider</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Context Manager">Context Manager</option>
                    <option value="Rate Limiter">Rate Limiter</option>
                    <option value="Session Manager">Session Manager</option>
                    <option value="Message Router">Message Router</option>
                    <option value="Analytics Engine">Analytics Engine</option>
                    <option value="Security Monitor">Security Monitor</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as "json" | "csv")}
                    className="flex-1 px-3 py-2 border rounded-md bg-white text-sm"
                  >
                    <option value="json">Export JSON</option>
                    <option value="csv">Export CSV</option>
                  </select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex-1 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {isExporting ? "Exporting..." : "Export"}
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearLogs}
                  className="w-full text-red-600 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All Logs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logs Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 sm:h-96 lg:h-[600px]">
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm sm:text-base">No logs found matching your criteria</p>
                  </div>
                ) : (
                  logs.map((log) => {
                    const LevelIcon = levelIcons[log.level]
                    const ComponentIcon = getComponentIcon(log.component)
                    const isExpanded = expandedLogs.has(log.id)

                    return (
                      <div
                        key={log.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 transition-colors overflow-hidden"
                      >
                        {/* Mobile Layout */}
                        <div className="sm:hidden space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Badge className={`${levelColors[log.level]} text-xs flex-shrink-0`}>
                                <LevelIcon className="h-3 w-3 mr-1" />
                                {log.level.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500 truncate">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLogExpansion(log.id)}
                              className="h-6 w-6 p-0 flex-shrink-0"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <ComponentIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm font-medium truncate">{log.component}</span>
                          </div>

                          <p className="text-sm text-gray-700 break-words">{log.message}</p>

                          <div className="flex flex-wrap gap-1">
                            {log.userId && (
                              <Badge variant="outline" className="text-xs">
                                <User className="h-3 w-3 mr-1" />
                                {log.userId}
                              </Badge>
                            )}
                            {log.endpoint && (
                              <Badge variant="outline" className="text-xs">
                                {log.endpoint}
                              </Badge>
                            )}
                            {log.statusCode && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  log.statusCode >= 400
                                    ? "border-red-200 text-red-700"
                                    : log.statusCode >= 300
                                      ? "border-yellow-200 text-yellow-700"
                                      : "border-green-200 text-green-700"
                                }`}
                              >
                                {log.statusCode}
                              </Badge>
                            )}
                            {log.duration && (
                              <Badge variant="outline" className="text-xs">
                                {log.duration}ms
                              </Badge>
                            )}
                          </div>

                          {isExpanded && (showDetails || log.level === "error") && log.details && (
                            <div className="mt-3 p-3 bg-gray-50 rounded text-xs space-y-2 break-words">
                              <p>
                                <strong>Details:</strong> {log.details}
                              </p>
                              {log.ip && (
                                <p>
                                  <strong>IP:</strong> {log.ip}
                                </p>
                              )}
                              {log.requestId && (
                                <p>
                                  <strong>Request ID:</strong> {log.requestId}
                                </p>
                              )}
                              {log.sessionId && (
                                <p>
                                  <strong>Session:</strong> {log.sessionId}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:block">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge className={`${levelColors[log.level]} text-xs`}>
                                  <LevelIcon className="h-3 w-3 mr-1" />
                                  {log.level.toUpperCase()}
                                </Badge>
                                <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <ComponentIcon className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium">{log.component}</span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 truncate">{log.message}</p>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                {log.userId && (
                                  <Badge variant="outline" className="text-xs">
                                    <User className="h-3 w-3 mr-1" />
                                    {log.userId}
                                  </Badge>
                                )}
                                {log.endpoint && (
                                  <Badge variant="outline" className="text-xs">
                                    {log.endpoint}
                                  </Badge>
                                )}
                                {log.statusCode && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      log.statusCode >= 400
                                        ? "border-red-200 text-red-700"
                                        : log.statusCode >= 300
                                          ? "border-yellow-200 text-yellow-700"
                                          : "border-green-200 text-green-700"
                                    }`}
                                  >
                                    {log.statusCode}
                                  </Badge>
                                )}
                                {log.duration && (
                                  <Badge variant="outline" className="text-xs">
                                    {log.duration}ms
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLogExpansion(log.id)}
                              className="ml-2 flex-shrink-0"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>

                          {isExpanded && (showDetails || log.level === "error") && log.details && (
                            <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p>
                                    <strong>Details:</strong> {log.details}
                                  </p>
                                  {log.requestId && (
                                    <p>
                                      <strong>Request ID:</strong> {log.requestId}
                                    </p>
                                  )}
                                  {log.sessionId && (
                                    <p>
                                      <strong>Session ID:</strong> {log.sessionId}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  {log.ip && (
                                    <p>
                                      <strong>IP Address:</strong> {log.ip}
                                    </p>
                                  )}
                                  {log.userAgent && (
                                    <p>
                                      <strong>User Agent:</strong> {log.userAgent.substring(0, 50)}...
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

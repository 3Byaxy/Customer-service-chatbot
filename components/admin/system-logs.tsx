"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Filter,
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
  info: "bg-blue-100 text-blue-800 border-blue-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  error: "bg-red-100 text-red-800 border-red-200",
  success: "bg-green-100 text-green-800 border-green-200",
  debug: "bg-gray-100 text-gray-800 border-gray-200",
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
    <div className="space-y-4 md:space-y-6">
      {/* Statistics Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg md:text-2xl font-bold">{stats.total}</p>
            </div>
            <Activity className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-blue-600">Info</p>
              <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.info}</p>
            </div>
            <Info className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-green-600">Success</p>
              <p className="text-lg md:text-2xl font-bold text-green-600">{stats.success}</p>
            </div>
            <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-yellow-600">Warnings</p>
              <p className="text-lg md:text-2xl font-bold text-yellow-600">{stats.warning}</p>
            </div>
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-red-600">Errors</p>
              <p className="text-lg md:text-2xl font-bold text-red-600">{stats.error}</p>
            </div>
            <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
          </div>
        </Card>

        <Card className="p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Debug</p>
              <p className="text-lg md:text-2xl font-bold text-gray-600">{stats.debug}</p>
            </div>
            <Bug className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Controls - Mobile Responsive */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg md:text-xl">System Logs</CardTitle>
              <div className="flex items-center gap-2">
                {isRealTime ? (
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 text-green-500 animate-pulse" />
                    <span className="text-xs text-green-600 hidden md:inline">Live</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <WifiOff className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 hidden md:inline">Paused</span>
                  </div>
                )}
                {stats.error > 0 && (
                  <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">{stats.error} Errors</Badge>
                )}
                {stats.warning > 0 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{stats.warning} Warnings</Badge>
                )}
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showMobileFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Desktop Controls */}
          <div className="hidden md:flex md:flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="realtime" checked={isRealTime} onCheckedChange={setIsRealTime} />
              <Label htmlFor="realtime" className="text-sm">
                Real-time
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="details" checked={showDetails} onCheckedChange={setShowDetails} />
              <Label htmlFor="details" className="text-sm">
                Show Details
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="autorefresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <Label htmlFor="autorefresh" className="text-sm">
                Auto Refresh
              </Label>
            </div>

            <div className="flex-1 max-w-sm">
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

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>

            <Select value={componentFilter} onValueChange={setComponentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Component" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Components</SelectItem>
                <SelectItem value="API Gateway">API Gateway</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
                <SelectItem value="AI Provider">AI Provider</SelectItem>
                <SelectItem value="Authentication">Authentication</SelectItem>
                <SelectItem value="Context Manager">Context Manager</SelectItem>
                <SelectItem value="Rate Limiter">Rate Limiter</SelectItem>
                <SelectItem value="Session Manager">Session Manager</SelectItem>
                <SelectItem value="Message Router">Message Router</SelectItem>
                <SelectItem value="Analytics Engine">Analytics Engine</SelectItem>
                <SelectItem value="Security Monitor">Security Monitor</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Select value={exportFormat} onValueChange={(value: "json" | "csv") => setExportFormat(value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting}>
                <Download className="h-4 w-4 mr-1" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>

              <Button variant="outline" size="sm" onClick={fetchLogs}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearLogs}
                className="text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          {/* Mobile Controls */}
          {showMobileFilters && (
            <div className="md:hidden space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="realtime-mobile" checked={isRealTime} onCheckedChange={setIsRealTime} />
                  <Label htmlFor="realtime-mobile" className="text-sm">
                    Real-time
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="details-mobile" checked={showDetails} onCheckedChange={setShowDetails} />
                  <Label htmlFor="details-mobile" className="text-sm">
                    Details
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
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={componentFilter} onValueChange={setComponentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Component" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Components</SelectItem>
                    <SelectItem value="API Gateway">API Gateway</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="AI Provider">AI Provider</SelectItem>
                    <SelectItem value="Authentication">Authentication</SelectItem>
                    <SelectItem value="Context Manager">Context Manager</SelectItem>
                    <SelectItem value="Rate Limiter">Rate Limiter</SelectItem>
                    <SelectItem value="Session Manager">Session Manager</SelectItem>
                    <SelectItem value="Message Router">Message Router</SelectItem>
                    <SelectItem value="Analytics Engine">Analytics Engine</SelectItem>
                    <SelectItem value="Security Monitor">Security Monitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Select value={exportFormat} onValueChange={(value: "json" | "csv") => setExportFormat(value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>

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
                className="w-full text-red-600 hover:text-red-700 bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Logs
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
            <Badge variant="outline" className="ml-auto">
              {logs.length} logs
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 md:h-[600px]">
            <div className="space-y-2 md:space-y-3">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No logs found matching your criteria</p>
                </div>
              ) : (
                logs.map((log) => {
                  const LevelIcon = levelIcons[log.level]
                  const ComponentIcon = getComponentIcon(log.component)
                  const isExpanded = expandedLogs.has(log.id)

                  return (
                    <div key={log.id} className="border rounded-lg p-3 md:p-4 hover:bg-gray-50 transition-colors">
                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={levelColors[log.level]}>
                              <LevelIcon className="h-3 w-3 mr-1" />
                              {log.level.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLogExpansion(log.id)}
                            className="h-6 w-6 p-0"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <ComponentIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{log.component}</span>
                        </div>

                        <p className="text-sm text-gray-700">{log.message}</p>

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
                        </div>

                        {isExpanded && (showDetails || log.level === "error") && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-xs space-y-2">
                            <p>
                              <strong>Details:</strong> {log.details}
                            </p>
                            {log.duration && (
                              <p>
                                <strong>Duration:</strong> {log.duration}ms
                              </p>
                            )}
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
                      <div className="hidden md:block">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge className={levelColors[log.level]}>
                                <LevelIcon className="h-3 w-3 mr-1" />
                                {log.level.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <ComponentIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">{log.component}</span>
                            </div>

                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{log.message}</p>
                            </div>

                            <div className="flex items-center gap-2">
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

                          <Button variant="ghost" size="sm" onClick={() => toggleLogExpansion(log.id)} className="ml-2">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>

                        {isExpanded && (showDetails || log.level === "error") && (
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
  )
}

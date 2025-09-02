/**
 * Advanced Logging System
 * Centralized logging with levels, formatting, and storage
 */

import { executeQuery } from "./database"

export type LogLevel = "debug" | "info" | "warning" | "error" | "success"

export interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  component: string
  message: string
  details?: string
  userId?: string
  sessionId?: string
  duration?: number
  ip?: string
  endpoint?: string
  statusCode?: number
  requestId?: string
  userAgent?: string
  metadata?: Record<string, any>
}

// In-memory log storage for development
const memoryLogs: LogEntry[] = []
const MAX_MEMORY_LOGS = 1000

// Log level hierarchy
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
  success: 1,
}

const currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || "info"

class Logger {
  private component: string

  constructor(component: string) {
    this.component = component
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel]
  }

  private async writeLog(entry: LogEntry) {
    // Add to memory storage
    memoryLogs.unshift(entry)
    if (memoryLogs.length > MAX_MEMORY_LOGS) {
      memoryLogs.pop()
    }

    // Try to write to database (if available)
    try {
      await executeQuery(
        `INSERT INTO system_logs (id, timestamp, level, component, message, details, user_id, session_id, duration, ip, endpoint, status_code, request_id, user_agent, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          entry.id,
          entry.timestamp,
          entry.level,
          entry.component,
          entry.message,
          entry.details || null,
          entry.userId || null,
          entry.sessionId || null,
          entry.duration || null,
          entry.ip || null,
          entry.endpoint || null,
          entry.statusCode || null,
          entry.requestId || null,
          entry.userAgent || null,
          entry.metadata ? JSON.stringify(entry.metadata) : null,
        ],
      )
    } catch (error) {
      // Database write failed, but we still have memory storage
      console.error("Failed to write log to database:", error)
    }

    // Console output with colors
    this.outputToConsole(entry)
  }

  private outputToConsole(entry: LogEntry) {
    const colors = {
      debug: "\x1b[36m", // Cyan
      info: "\x1b[34m", // Blue
      warning: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      success: "\x1b[32m", // Green
    }

    const reset = "\x1b[0m"
    const color = colors[entry.level] || colors.info

    const timestamp = new Date(entry.timestamp).toLocaleTimeString()
    const levelStr = entry.level.toUpperCase().padEnd(7)

    console.log(
      `${color}[${timestamp}] ${levelStr} ${entry.component}${reset}: ${entry.message}${
        entry.details ? `\n  Details: ${entry.details}` : ""
      }`,
    )
  }

  private createLogEntry(level: LogLevel, message: string, details?: string, metadata?: Record<string, any>): LogEntry {
    return {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      component: this.component,
      message,
      details,
      metadata,
    }
  }

  debug(message: string, details?: string, metadata?: Record<string, any>) {
    if (this.shouldLog("debug")) {
      const entry = this.createLogEntry("debug", message, details, metadata)
      this.writeLog(entry)
    }
  }

  info(message: string, details?: string, metadata?: Record<string, any>) {
    if (this.shouldLog("info")) {
      const entry = this.createLogEntry("info", message, details, metadata)
      this.writeLog(entry)
    }
  }

  warning(message: string, details?: string, metadata?: Record<string, any>) {
    if (this.shouldLog("warning")) {
      const entry = this.createLogEntry("warning", message, details, metadata)
      this.writeLog(entry)
    }
  }

  error(message: string, details?: string, metadata?: Record<string, any>) {
    if (this.shouldLog("error")) {
      const entry = this.createLogEntry("error", message, details, metadata)
      this.writeLog(entry)
    }
  }

  success(message: string, details?: string, metadata?: Record<string, any>) {
    if (this.shouldLog("success")) {
      const entry = this.createLogEntry("success", message, details, metadata)
      this.writeLog(entry)
    }
  }

  // HTTP request logging
  async logRequest(
    method: string,
    endpoint: string,
    statusCode: number,
    duration: number,
    userId?: string,
    sessionId?: string,
    ip?: string,
    userAgent?: string,
    requestId?: string,
  ) {
    const level: LogLevel = statusCode >= 500 ? "error" : statusCode >= 400 ? "warning" : "info"
    const message = `${method} ${endpoint} - ${statusCode} (${duration}ms)`

    const entry: LogEntry = {
      ...this.createLogEntry(level, message),
      userId,
      sessionId,
      duration,
      ip,
      endpoint,
      statusCode,
      requestId,
      userAgent,
    }

    await this.writeLog(entry)
  }
}

// Create loggers for different components
export const loggers = {
  api: new Logger("API Gateway"),
  database: new Logger("Database"),
  aiProvider: new Logger("AI Provider"),
  auth: new Logger("Authentication"),
  context: new Logger("Context Manager"),
  rateLimiter: new Logger("Rate Limiter"),
  session: new Logger("Session Manager"),
  router: new Logger("Message Router"),
  analytics: new Logger("Analytics Engine"),
  security: new Logger("Security Monitor"),
  system: new Logger("System"),
}

// Get logs with filtering
export async function getLogs(options: {
  level?: LogLevel
  component?: string
  search?: string
  limit?: number
  offset?: number
  startDate?: string
  endDate?: string
}): Promise<{ logs: LogEntry[]; total: number; stats: Record<LogLevel, number> }> {
  const { level, component, search, limit = 100, offset = 0, startDate, endDate } = options

  try {
    // Try database first
    const whereConditions = []
    const params: any[] = []
    let paramIndex = 1

    if (level) {
      whereConditions.push(`level = $${paramIndex}`)
      params.push(level)
      paramIndex++
    }

    if (component) {
      whereConditions.push(`component = $${paramIndex}`)
      params.push(component)
      paramIndex++
    }

    if (search) {
      whereConditions.push(`(message ILIKE $${paramIndex} OR details ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    if (startDate) {
      whereConditions.push(`timestamp >= $${paramIndex}`)
      params.push(startDate)
      paramIndex++
    }

    if (endDate) {
      whereConditions.push(`timestamp <= $${paramIndex}`)
      params.push(endDate)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Get logs
    const logsQuery = `
      SELECT * FROM system_logs 
      ${whereClause}
      ORDER BY timestamp DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(limit, offset)

    const logs = await executeQuery(logsQuery, params)

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM system_logs ${whereClause}`
    const countResult = await executeQuery(countQuery, params.slice(0, -2))
    const total = Number.parseInt(countResult[0]?.total || "0")

    // Get stats
    const statsQuery = `
      SELECT level, COUNT(*) as count 
      FROM system_logs ${whereClause}
      GROUP BY level
    `
    const statsResult = await executeQuery(statsQuery, params.slice(0, -2))

    const stats: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warning: 0,
      error: 0,
      success: 0,
    }

    statsResult.forEach((row: any) => {
      stats[row.level as LogLevel] = Number.parseInt(row.count)
    })

    return { logs, total, stats }
  } catch (error) {
    // Fallback to memory logs
    console.warn("Database query failed, using memory logs:", error)

    let filteredLogs = [...memoryLogs]

    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level)
    }

    if (component) {
      filteredLogs = filteredLogs.filter((log) => log.component === component)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.message.toLowerCase().includes(searchLower) ||
          (log.details && log.details.toLowerCase().includes(searchLower)),
      )
    }

    if (startDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp >= startDate)
    }

    if (endDate) {
      filteredLogs = filteredLogs.filter((log) => log.timestamp <= endDate)
    }

    const total = filteredLogs.length
    const logs = filteredLogs.slice(offset, offset + limit)

    // Calculate stats
    const stats: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warning: 0,
      error: 0,
      success: 0,
    }

    filteredLogs.forEach((log) => {
      stats[log.level]++
    })

    return { logs, total, stats }
  }
}

// Export logs
export async function exportLogs(
  format: "json" | "csv",
  options: {
    level?: LogLevel
    component?: string
    search?: string
    startDate?: string
    endDate?: string
  } = {},
): Promise<string> {
  const { logs } = await getLogs({ ...options, limit: 10000 })

  if (format === "csv") {
    const headers = [
      "timestamp",
      "level",
      "component",
      "message",
      "details",
      "userId",
      "sessionId",
      "duration",
      "ip",
      "endpoint",
      "statusCode",
      "requestId",
      "userAgent",
    ]

    const csvRows = [
      headers.join(","),
      ...logs.map((log) =>
        headers
          .map((header) => {
            const value = log[header as keyof LogEntry] || ""
            const stringValue = String(value)
            return stringValue.includes(",") || stringValue.includes('"')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue
          })
          .join(","),
      ),
    ]

    return csvRows.join("\n")
  } else {
    return JSON.stringify(logs, null, 2)
  }
}

// Clear old logs
export async function clearOldLogs(daysToKeep = 30): Promise<number> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    const result = await executeQuery("DELETE FROM system_logs WHERE timestamp < $1", [cutoffDate.toISOString()])

    return result.rowCount || 0
  } catch (error) {
    console.error("Failed to clear old logs:", error)
    return 0
  }
}

export default Logger

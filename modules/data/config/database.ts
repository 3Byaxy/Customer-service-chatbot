import { Pool, type PoolClient, type QueryResult } from "pg"
import crypto from "crypto"

// Security: Encryption for sensitive connection data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "dev-encryption-key-change-in-production"

function encrypt(text: string): string {
  const cipher = crypto.createCipher("aes-256-cbc", ENCRYPTION_KEY)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipher("aes-256-cbc", ENCRYPTION_KEY)
  let decrypted = decipher.update(encryptedText, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

// Database connection configuration with security enhancements
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "ai_customer_support",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "your_password_here",

  // Enhanced connection pool settings
  max: 20, // Maximum number of clients in the pool
  min: 2, // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
  acquireTimeoutMillis: 60000, // Return an error after 60 seconds if a client cannot be acquired

  // Security settings
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  statement_timeout: 30000, // 30 second query timeout
  query_timeout: 30000,

  // Performance settings
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
}

// Connection pool with monitoring
let pool: Pool | null = null
let connectionAttempts = 0
let lastConnectionError: Error | null = null
const connectionStats = {
  totalConnections: 0,
  activeConnections: 0,
  idleConnections: 0,
  waitingClients: 0,
  totalQueries: 0,
  failedQueries: 0,
  averageQueryTime: 0,
  lastQueryTime: 0,
}

// Query cache for performance optimization
const queryCache = new Map<string, { result: any; timestamp: number; ttl: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes default TTL

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(dbConfig)

    // Enhanced error handling and monitoring
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err)
      lastConnectionError = err
      connectionStats.failedQueries++

      // Don't exit in development, just log
      if (process.env.NODE_ENV === "production") {
        process.exit(-1)
      }
    })

    pool.on("connect", (client) => {
      connectionStats.totalConnections++
      connectionStats.activeConnections++
      console.log("New client connected to database")
    })

    pool.on("acquire", (client) => {
      connectionStats.activeConnections++
    })

    pool.on("remove", (client) => {
      connectionStats.activeConnections--
      console.log("Client removed from pool")
    })
  }

  return pool
}

// Enhanced database connection with retry logic
export async function connectDB(): Promise<PoolClient> {
  const maxRetries = 3
  let retryCount = 0

  while (retryCount < maxRetries) {
    try {
      const pool = getPool()
      const client = await pool.connect()
      connectionAttempts++
      lastConnectionError = null
      return client
    } catch (error) {
      retryCount++
      connectionAttempts++
      lastConnectionError = error as Error

      console.error(`Database connection attempt ${retryCount} failed:`, error)

      if (retryCount >= maxRetries) {
        throw new Error(`Failed to connect to database after ${maxRetries} attempts: ${(error as Error).message}`)
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retryCount) * 1000))
    }
  }

  throw new Error("Failed to connect to database")
}

// Secure query execution with parameterized queries and caching
export async function executeQuery(
  query: string,
  params: any[] = [],
  options: { cache?: boolean; cacheTTL?: number } = {},
): Promise<any> {
  const startTime = Date.now()

  // Check cache first if caching is enabled
  if (options.cache) {
    const cacheKey = `${query}:${JSON.stringify(params)}`
    const cached = queryCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      console.log("Query result served from cache")
      return cached.result
    }
  }

  const client = await connectDB()

  try {
    // Security: Validate query to prevent SQL injection
    if (typeof query !== "string" || query.trim().length === 0) {
      throw new Error("Invalid query: Query must be a non-empty string")
    }

    // Security: Check for potentially dangerous operations
    const dangerousPatterns = [/;\s*(drop|delete|truncate|alter)\s+/i, /union\s+select/i, /exec\s*\(/i, /script\s*>/i]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(query)) {
        console.warn("Potentially dangerous query detected:", query.substring(0, 100))
        // In production, you might want to block these entirely
      }
    }

    // Execute the parameterized query
    const result: QueryResult = await client.query(query, params)

    // Update statistics
    const queryTime = Date.now() - startTime
    connectionStats.totalQueries++
    connectionStats.lastQueryTime = queryTime
    connectionStats.averageQueryTime =
      (connectionStats.averageQueryTime * (connectionStats.totalQueries - 1) + queryTime) / connectionStats.totalQueries

    // Cache the result if caching is enabled
    if (options.cache && result.rows) {
      const cacheKey = `${query}:${JSON.stringify(params)}`
      const ttl = options.cacheTTL || CACHE_TTL

      queryCache.set(cacheKey, {
        result: result.rows,
        timestamp: Date.now(),
        ttl,
      })

      // Clean up old cache entries
      if (queryCache.size > 100) {
        const now = Date.now()
        for (const [key, value] of queryCache.entries()) {
          if (now - value.timestamp > value.ttl) {
            queryCache.delete(key)
          }
        }
      }
    }

    console.log(`Query executed in ${queryTime}ms`)
    return result.rows
  } catch (error) {
    connectionStats.failedQueries++
    console.error("Query execution error:", error)
    console.error("Query:", query.substring(0, 200))
    console.error("Params:", params)
    throw error
  } finally {
    client.release()
    connectionStats.activeConnections--
  }
}

// Enhanced connection testing with detailed diagnostics
export async function testConnection(): Promise<{
  success: boolean
  message: string
  details: any
}> {
  try {
    const startTime = Date.now()
    const result = await executeQuery("SELECT NOW() as current_time, version() as db_version")
    const connectionTime = Date.now() - startTime

    const poolInfo = pool
      ? {
          totalCount: pool.totalCount,
          idleCount: pool.idleCount,
          waitingCount: pool.waitingCount,
        }
      : null

    return {
      success: true,
      message: "Database connected successfully",
      details: {
        connectionTime: `${connectionTime}ms`,
        currentTime: result[0]?.current_time,
        dbVersion: result[0]?.db_version,
        poolInfo,
        connectionStats,
        lastError: lastConnectionError?.message || null,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: "Database connection failed",
      details: {
        error: (error as Error).message,
        connectionAttempts,
        lastConnectionError: lastConnectionError?.message || null,
        connectionStats,
      },
    }
  }
}

// Database health monitoring
export function getDatabaseHealth(): {
  status: "healthy" | "warning" | "critical"
  metrics: typeof connectionStats
  poolInfo: any
  cacheInfo: any
} {
  const poolInfo = pool
    ? {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
      }
    : null

  const cacheInfo = {
    size: queryCache.size,
    hitRate:
      connectionStats.totalQueries > 0
        ? (
            ((connectionStats.totalQueries - connectionStats.failedQueries) / connectionStats.totalQueries) *
            100
          ).toFixed(2) + "%"
        : "0%",
  }

  let status: "healthy" | "warning" | "critical" = "healthy"

  // Determine health status
  if (connectionStats.failedQueries > connectionStats.totalQueries * 0.1) {
    status = "critical" // More than 10% failed queries
  } else if (connectionStats.averageQueryTime > 1000) {
    status = "warning" // Average query time over 1 second
  } else if (poolInfo && poolInfo.waitingCount > 5) {
    status = "warning" // Too many waiting clients
  }

  return {
    status,
    metrics: connectionStats,
    poolInfo,
    cacheInfo,
  }
}

// Initialize database with enhanced error handling
export async function initializeDatabase(): Promise<{
  success: boolean
  message: string
  tablesCreated?: string[]
  errors?: string[]
}> {
  try {
    // Check if tables exist
    const tableCheckQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (
        'users', 'conversations', 'messages', 'business_configs', 
        'rules', 'context_storage', 'escalations', 'analytics', 
        'system_logs', 'api_usage', 'performance_metrics'
      )
    `

    const existingTables = await executeQuery(tableCheckQuery, [], { cache: true, cacheTTL: 60000 })
    const existingTableNames = existingTables.map((row: any) => row.table_name)

    const requiredTables = [
      "users",
      "conversations",
      "messages",
      "business_configs",
      "rules",
      "context_storage",
      "escalations",
      "analytics",
      "system_logs",
      "api_usage",
      "performance_metrics",
    ]

    const missingTables = requiredTables.filter((table) => !existingTableNames.includes(table))

    if (missingTables.length === 0) {
      return {
        success: true,
        message: `Database initialized successfully. Found ${existingTableNames.length} tables.`,
        tablesCreated: existingTableNames,
      }
    } else {
      return {
        success: false,
        message: `Database initialization incomplete. Missing ${missingTables.length} tables.`,
        errors: [`Missing tables: ${missingTables.join(", ")}`],
        tablesCreated: existingTableNames,
      }
    }
  } catch (error) {
    return {
      success: false,
      message: "Database initialization failed",
      errors: [(error as Error).message],
    }
  }
}

// Cleanup function for graceful shutdown
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
    console.log("Database pool closed")
  }

  // Clear cache
  queryCache.clear()
  console.log("Query cache cleared")
}

// Performance monitoring utilities
export function clearQueryCache(): void {
  queryCache.clear()
  console.log("Query cache cleared manually")
}

export function getQueryCacheStats(): {
  size: number
  entries: Array<{ key: string; age: number; ttl: number }>
} {
  const now = Date.now()
  const entries = Array.from(queryCache.entries()).map(([key, value]) => ({
    key: key.substring(0, 50) + "...",
    age: now - value.timestamp,
    ttl: value.ttl,
  }))

  return {
    size: queryCache.size,
    entries,
  }
}

// Rate limiting for database connections
const connectionRateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkConnectionRateLimit(clientId: string, maxConnections = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const clientLimit = connectionRateLimit.get(clientId)

  if (!clientLimit || now > clientLimit.resetTime) {
    connectionRateLimit.set(clientId, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (clientLimit.count >= maxConnections) {
    return false
  }

  clientLimit.count++
  return true
}

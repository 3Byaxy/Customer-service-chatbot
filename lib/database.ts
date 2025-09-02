import { Pool, type PoolClient } from "pg"

// Database connection configuration
const dbConfig = {
  // Local SQL Server Configuration (you can modify these)
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "ai_customer_support",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "your_password_here",

  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
}

// Create connection pool
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(dbConfig)

    // Handle pool errors
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err)
      process.exit(-1)
    })
  }

  return pool
}

// Database connection helper
export async function connectDB(): Promise<PoolClient> {
  try {
    const pool = getPool()
    const client = await pool.connect()
    return client
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

// Execute query helper
export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  const client = await connectDB()

  try {
    const result = await client.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Query execution error:", error)
    throw error
  } finally {
    client.release()
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await executeQuery("SELECT NOW() as current_time")
    console.log("Database connected successfully:", result[0]?.current_time)
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// Initialize database (create tables if they don't exist)
export async function initializeDatabase(): Promise<void> {
  try {
    // Check if tables exist, create if they don't
    const tableCheckQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'conversations', 'messages', 'business_configs', 'rules', 'context_storage', 'escalations', 'analytics')
    `

    const existingTables = await executeQuery(tableCheckQuery)

    if (existingTables.length === 0) {
      console.log("No tables found. Creating database schema...")
      // You can run the SQL script here or manually
      console.log("Please run the SQL script from scripts/create-database.sql")
    } else {
      console.log(`Found ${existingTables.length} existing tables`)
    }
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}

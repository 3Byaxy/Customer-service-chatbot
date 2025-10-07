// Database utilities and health monitoring
export interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'critical'
  metrics: {
    averageQueryTime: number
    activeConnections: number
    totalQueries: number
    errorRate: number
  }
  poolInfo: {
    total: number
    idle: number
    waiting: number
  }
  cacheInfo: {
    hitRate: number
    size: number
    maxSize: number
  }
}

export interface ConnectionTest {
  success: boolean
  message: string
  details: any
}

// Mock database health for development
export function getDatabaseHealth(): DatabaseHealth {
  return {
    status: 'healthy',
    metrics: {
      averageQueryTime: Math.round(50 + Math.random() * 100),
      activeConnections: Math.round(5 + Math.random() * 15),
      totalQueries: Math.round(1000 + Math.random() * 5000),
      errorRate: Math.random() * 0.1
    },
    poolInfo: {
      total: 20,
      idle: Math.round(10 + Math.random() * 8),
      waiting: Math.round(Math.random() * 3)
    },
    cacheInfo: {
      hitRate: 0.85 + Math.random() * 0.1,
      size: Math.round(100 + Math.random() * 200),
      maxSize: 500
    }
  }
}

// Mock connection test for development
export async function testConnection(): Promise<ConnectionTest> {
  // Simulate connection test delay
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return {
    success: true,
    message: 'Database connection successful',
    details: {
      host: 'localhost',
      database: 'customer_service',
      connectionTime: Math.round(50 + Math.random() * 100)
    }
  }
}

// Simple dev-only query executor to avoid build errors when a real DB client isn't wired.
// In production, replace this with a real pg client and proper returns.
export async function executeQuery(query: string, params: any[] = []): Promise<any> {
  try {
    // Log once in dev to indicate this is a stub
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[DEV-DB] executeQuery stub called', { query: query?.slice(0, 80) + '...', paramsCount: params?.length || 0 })
    }
    // Heuristic return: arrays for SELECT, object with rowCount for mutations
    const q = (query || '').trim().toUpperCase()
    if (q.startsWith('SELECT')) return []
    return { rowCount: 0 }
  } catch {
    return q.startsWith('SELECT') ? [] : { rowCount: 0 }
  }
}

// Export for lib/database.ts compatibility
export { getDatabaseHealth as default }

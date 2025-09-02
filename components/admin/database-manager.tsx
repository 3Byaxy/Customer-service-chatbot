"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  HardDrive,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react"

export default function DatabaseManager() {
  const [dbStats, setDbStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchDatabaseStats()
    const interval = setInterval(fetchDatabaseStats, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchDatabaseStats = async () => {
    try {
      // Simulate database statistics
      const mockStats = {
        overview: {
          totalSize: "45.2 MB",
          totalRecords: 12847,
          activeConnections: Math.floor(Math.random() * 20) + 5,
          lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: "healthy",
        },
        tables: [
          {
            name: "conversations",
            records: 3421,
            size: "18.7 MB",
            lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            status: "active",
          },
          {
            name: "messages",
            records: 8956,
            size: "22.1 MB",
            lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            status: "active",
          },
          {
            name: "user_sessions",
            records: 470,
            size: "3.4 MB",
            lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            status: "active",
          },
          {
            name: "context_data",
            records: 1245,
            size: "1.0 MB",
            lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            status: "active",
          },
        ],
        recentActivity: [
          {
            id: 1,
            action: "INSERT",
            table: "messages",
            timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
            details: "New message from user session 12345",
          },
          {
            id: 2,
            action: "UPDATE",
            table: "conversations",
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            details: "Conversation status updated to resolved",
          },
          {
            id: 3,
            action: "DELETE",
            table: "user_sessions",
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            details: "Expired session cleanup",
          },
          {
            id: 4,
            action: "INSERT",
            table: "context_data",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            details: "Context saved for business type: telecom",
          },
        ],
        performance: {
          queryTime: Math.floor(Math.random() * 50) + 10,
          indexEfficiency: Math.floor(Math.random() * 20) + 80,
          cacheHitRate: Math.floor(Math.random() * 15) + 85,
          connectionPool: {
            active: Math.floor(Math.random() * 10) + 5,
            idle: Math.floor(Math.random() * 5) + 2,
            max: 20,
          },
        },
      }

      setDbStats(mockStats)
    } catch (error) {
      console.error("Failed to fetch database stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCleanup = async (table: string) => {
    console.log(`Cleaning up ${table}...`)
    // In a real app, this would call an API to clean up old data
  }

  const handleBackup = async () => {
    console.log("Starting database backup...")
    // In a real app, this would trigger a backup process
  }

  const handleExport = async (table: string) => {
    console.log(`Exporting ${table}...`)
    // In a real app, this would export table data
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.overview?.totalSize}</div>
            <p className="text-xs text-muted-foreground">Database storage used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.overview?.totalRecords?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all tables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStats?.overview?.activeConnections}</div>
            <p className="text-xs text-muted-foreground">Current database connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Tables</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Tables
              </CardTitle>
              <CardDescription>Overview of all database tables and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dbStats?.tables?.map((table: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Database className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{table.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{table.records.toLocaleString()} records</span>
                          <span>{table.size}</span>
                          <span>Updated {new Date(table.lastUpdated).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">{table.status}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleExport(table.name)}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleCleanup(table.name)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cleanup
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Database Activity
              </CardTitle>
              <CardDescription>Latest database operations and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {dbStats?.recentActivity?.map((activity: any) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        {activity.action === "INSERT" && (
                          <div className="p-1 bg-green-100 rounded">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                        {activity.action === "UPDATE" && (
                          <div className="p-1 bg-blue-100 rounded">
                            <RefreshCw className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        {activity.action === "DELETE" && (
                          <div className="p-1 bg-red-100 rounded">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </div>
                        )}
                        <Badge variant="outline">{activity.action}</Badge>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.table}</div>
                        <div className="text-sm text-gray-600">{activity.details}</div>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Query Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Query Time</span>
                  <span className="font-medium">{dbStats?.performance?.queryTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Index Efficiency</span>
                  <span className="font-medium text-green-600">{dbStats?.performance?.indexEfficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cache Hit Rate</span>
                  <span className="font-medium text-blue-600">{dbStats?.performance?.cacheHitRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Pool</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Connections</span>
                  <span className="font-medium">{dbStats?.performance?.connectionPool?.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Idle Connections</span>
                  <span className="font-medium">{dbStats?.performance?.connectionPool?.idle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Connections</span>
                  <span className="font-medium">{dbStats?.performance?.connectionPool?.max}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
                <CardDescription>Database backup and recovery operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">Last Backup</span>
                    <p className="text-xs text-gray-600">{new Date(dbStats?.overview?.lastBackup).toLocaleString()}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>
                </div>
                <Button onClick={handleBackup} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Tasks</CardTitle>
                <CardDescription>Database optimization and cleanup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimize Tables
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clean Expired Sessions
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Database className="h-4 w-4 mr-2" />
                  Rebuild Indexes
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Maintenance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="font-medium text-yellow-800">Scheduled Maintenance</p>
                    <p className="text-sm text-yellow-600">Database optimization scheduled for tonight at 2:00 AM</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">Backup Completed</p>
                    <p className="text-sm text-blue-600">Daily backup completed successfully at 6:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

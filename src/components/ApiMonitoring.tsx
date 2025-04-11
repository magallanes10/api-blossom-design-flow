
import { useState, useEffect } from "react";
import { Bar, Line, Pie } from "recharts";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  BarChart2, 
  PieChart as PieChartIcon, 
  RefreshCw
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Types for API data
interface EndpointStatus {
  path: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
}

interface ApiStatus {
  endpoints: EndpointStatus[];
  overallHealth: string;
  timestamp: string;
}

interface MethodStat {
  method: string;
  count: number;
  avgResponseTime: number;
  errorRate: number;
}

interface MethodStats {
  methods: MethodStat[];
  totalRequests: number;
  period: string;
  timestamp: string;
}

interface ResponseTimeMetric {
  path: string;
  avg: number;
  median: number;
  p95: number;
}

interface ResponseTimes {
  average: number;
  median: number;
  p95: number;
  p99: number;
  byEndpoint: ResponseTimeMetric[];
  period: string;
  timestamp: string;
}

const ApiMonitoring = () => {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [methodStats, setMethodStats] = useState<MethodStats | null>(null);
  const [responseTimes, setResponseTimes] = useState<ResponseTimes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);

  // Function to fetch all monitoring data
  const fetchMonitoringData = async () => {
    setLoading(true);
    try {
      // In a real app, these would be actual API calls
      // For demo purposes, we'll simulate the responses
      
      // Mock API status data
      const statusData: ApiStatus = {
        endpoints: [
          { path: "/api/users", status: "healthy", responseTime: 45, uptime: 99.8 },
          { path: "/api/products", status: "healthy", responseTime: 38, uptime: 99.9 },
          { path: "/api/auth/login", status: "healthy", responseTime: 120, uptime: 99.5 },
          { path: "/api/auth/register", status: "degraded", responseTime: 350, uptime: 98.2 }
        ],
        overallHealth: "healthy",
        timestamp: new Date().toISOString()
      };
      
      // Mock HTTP method statistics
      const methodData: MethodStats = {
        methods: [
          { method: "GET", count: 15420, avgResponseTime: 42, errorRate: 0.8 },
          { method: "POST", count: 5280, avgResponseTime: 128, errorRate: 2.1 },
          { method: "PUT", count: 2340, avgResponseTime: 95, errorRate: 1.5 },
          { method: "DELETE", count: 890, avgResponseTime: 65, errorRate: 0.9 }
        ],
        totalRequests: 23930,
        period: "last 24 hours",
        timestamp: new Date().toISOString()
      };
      
      // Mock response time data
      const responseTimeData: ResponseTimes = {
        average: 78,
        median: 65,
        p95: 210,
        p99: 450,
        byEndpoint: [
          { path: "/api/users", avg: 45, median: 42, p95: 120 },
          { path: "/api/products", avg: 38, median: 35, p95: 95 },
          { path: "/api/auth/login", avg: 120, median: 110, p95: 320 },
          { path: "/api/auth/register", avg: 350, median: 310, p95: 620 }
        ],
        period: "last 24 hours",
        timestamp: new Date().toISOString()
      };

      setApiStatus(statusData);
      setMethodStats(methodData);
      setResponseTimes(responseTimeData);
      setLastUpdated(new Date());
      
      // Removed toast notification on data refresh
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
      toast({
        title: "Error refreshing data",
        description: "Could not fetch monitoring data. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    fetchMonitoringData();
    
    // Only set up interval if autoRefresh is enabled
    let interval: number | undefined;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        if (apiStatus) {
          const updatedEndpoints = apiStatus.endpoints.map(endpoint => ({
            ...endpoint,
            responseTime: endpoint.responseTime + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10)
          }));
          
          setApiStatus({
            ...apiStatus,
            endpoints: updatedEndpoints,
            timestamp: new Date().toISOString()
          });
        }
        
        if (responseTimes) {
          const newAvg = responseTimes.average + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5);
          setResponseTimes({
            ...responseTimes,
            average: newAvg,
            timestamp: new Date().toISOString()
          });
        }
        
        setLastUpdated(new Date());
      }, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [apiStatus, responseTimes, autoRefresh]);

  // Method colors for charts
  const methodColors = {
    GET: "#10b981",
    POST: "#3b82f6",
    PUT: "#f59e0b",
    DELETE: "#ef4444"
  };

  // Helper to format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            API Monitoring
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground">
            Real-time insights into your API performance and health.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Last updated: {formatTimeAgo(lastUpdated)}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchMonitoringData}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <span className="ml-2">{autoRefresh ? "Auto Refresh: On" : "Auto Refresh: Off"}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* API Health Summary Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">API Health</CardTitle>
            </CardHeader>
            <CardContent>
              {apiStatus && (
                <div className="flex flex-col items-center">
                  <div className={`text-2xl font-bold mb-2 ${
                    apiStatus.overallHealth === "healthy" 
                      ? "text-green-500" 
                      : apiStatus.overallHealth === "degraded" 
                        ? "text-amber-500" 
                        : "text-red-500"
                  }`}>
                    {apiStatus.overallHealth === "healthy" && <CheckCircle className="h-8 w-8 inline mr-2" />}
                    {apiStatus.overallHealth === "degraded" && <AlertTriangle className="h-8 w-8 inline mr-2" />}
                    {apiStatus.overallHealth !== "healthy" && apiStatus.overallHealth !== "degraded" && 
                      <AlertTriangle className="h-8 w-8 inline mr-2" />
                    }
                    {apiStatus.overallHealth.charAt(0).toUpperCase() + apiStatus.overallHealth.slice(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {apiStatus.endpoints.filter(e => e.status === "healthy").length} of {apiStatus.endpoints.length} endpoints healthy
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Average Response Time Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              {responseTimes && (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2">
                    <Clock className="h-6 w-6 inline mr-2" />
                    {responseTimes.average} ms
                  </div>
                  <p className="text-sm text-muted-foreground">
                    P95: {responseTimes.p95} ms
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Requests Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {methodStats && (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2">
                    <Activity className="h-6 w-6 inline mr-2" />
                    {methodStats.totalRequests.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    In the last 24 hours
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Rate Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              {methodStats && (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2">
                    <AlertTriangle className="h-6 w-6 inline mr-2" />
                    {(methodStats.methods.reduce((sum, method) => sum + method.errorRate * method.count, 0) / 
                      methodStats.totalRequests).toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Across all endpoints
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* API Endpoints Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Overview of all API endpoints and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              {apiStatus && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-2 text-left">Endpoint</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-right">Response Time</th>
                        <th className="px-4 py-2 text-right">Uptime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiStatus.endpoints.map((endpoint, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="px-4 py-3">
                            <code className="px-2 py-1 bg-muted rounded text-sm">{endpoint.path}</code>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={
                              endpoint.status === "healthy" 
                                ? "success" 
                                : endpoint.status === "degraded" 
                                  ? "warning" 
                                  : "destructive"
                            }>
                              {endpoint.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={
                              endpoint.responseTime < 100 
                                ? "text-green-500" 
                                : endpoint.responseTime < 300 
                                  ? "text-amber-500" 
                                  : "text-red-500"
                            }>
                              {endpoint.responseTime} ms
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {endpoint.uptime}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* HTTP Methods Section */}
          <Card>
            <CardHeader>
              <CardTitle>HTTP Methods</CardTitle>
              <CardDescription>Distribution of requests by HTTP method</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {methodStats && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={methodStats.methods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="method"
                    >
                      {methodStats.methods.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={methodColors[entry.method as keyof typeof methodColors]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} requests`, "Count"]}
                      labelFormatter={(label) => `${label} method`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Response Averages */}
          <Card>
            <CardHeader>
              <CardTitle>Response Averages</CardTitle>
              <CardDescription>Average response times by endpoint (ms)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {responseTimes && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={responseTimes.byEndpoint.map(endpoint => ({
                      name: endpoint.path.split('/').pop(),
                      path: endpoint.path,
                      average: endpoint.avg,
                      median: endpoint.median,
                      p95: endpoint.p95
                    }))}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="average" name="Average" fill="#3b82f6" />
                    <Bar dataKey="median" name="Median" fill="#10b981" />
                    <Bar dataKey="p95" name="95th Percentile" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Possibilities Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Possibilities</CardTitle>
            <CardDescription>What you can do with the API monitoring data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Collapsible className="border rounded-md p-4">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                      <h3 className="text-lg font-medium">Anomaly Detection</h3>
                    </div>
                    <div>↓</div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 text-muted-foreground">
                  <p>Set up alerts based on response time thresholds and error rates to quickly identify issues before they affect users.</p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible className="border rounded-md p-4">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                      <h3 className="text-lg font-medium">Performance Optimization</h3>
                    </div>
                    <div>↓</div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 text-muted-foreground">
                  <p>Identify slow endpoints and optimize them to improve overall API performance and user experience.</p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible className="border rounded-md p-4">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2 text-green-500" />
                      <h3 className="text-lg font-medium">Usage Analytics</h3>
                    </div>
                    <div>↓</div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 text-muted-foreground">
                  <p>Analyze patterns in API usage to guide development priorities and resource allocation.</p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiMonitoring;

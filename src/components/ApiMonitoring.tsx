
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
import { useQuery } from "@tanstack/react-query";

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

// Custom hook to fetch monitoring data
const useMonitoringData = (autoRefresh: boolean) => {
  // Fetch API status
  const statusQuery = useQuery({
    queryKey: ['apiStatus', autoRefresh],
    queryFn: async () => {
      const response = await fetch('/api/monitoring/status');
      if (!response.ok) {
        throw new Error('Failed to fetch API status');
      }
      return response.json() as Promise<ApiStatus>;
    },
    refetchInterval: autoRefresh ? 10000 : false,
    retry: 1,
    staleTime: 5000,
  });

  // Fetch method stats
  const methodsQuery = useQuery({
    queryKey: ['methodStats', autoRefresh],
    queryFn: async () => {
      const response = await fetch('/api/monitoring/methods');
      if (!response.ok) {
        throw new Error('Failed to fetch method stats');
      }
      return response.json() as Promise<MethodStats>;
    },
    refetchInterval: autoRefresh ? 10000 : false,
    retry: 1,
    staleTime: 5000,
  });

  // Fetch response times
  const responseTimesQuery = useQuery({
    queryKey: ['responseTimes', autoRefresh],
    queryFn: async () => {
      const response = await fetch('/api/monitoring/response-times');
      if (!response.ok) {
        throw new Error('Failed to fetch response times');
      }
      return response.json() as Promise<ResponseTimes>;
    },
    refetchInterval: autoRefresh ? 10000 : false,
    retry: 1,
    staleTime: 5000,
  });

  return {
    apiStatus: statusQuery.data,
    methodStats: methodsQuery.data,
    responseTimes: responseTimesQuery.data,
    isLoading: statusQuery.isLoading || methodsQuery.isLoading || responseTimesQuery.isLoading,
    refetch: () => {
      statusQuery.refetch();
      methodsQuery.refetch();
      responseTimesQuery.refetch();
    }
  };
};

const ApiMonitoring = () => {
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Use our custom hook for data fetching
  const { apiStatus, methodStats, responseTimes, isLoading, refetch } = useMonitoringData(autoRefresh);

  // Update the last updated timestamp whenever we get new data
  useEffect(() => {
    if (apiStatus || methodStats || responseTimes) {
      setLastUpdated(new Date());
    }
  }, [apiStatus, methodStats, responseTimes]);

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
              onClick={() => refetch()}
              disabled={isLoading}
            >
              {isLoading ? (
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
              {apiStatus ? (
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
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2 text-gray-400">
                    <Clock className="h-8 w-8 inline mr-2" />
                    Loading...
                  </div>
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
              {responseTimes ? (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2">
                    <Clock className="h-6 w-6 inline mr-2" />
                    {Math.round(responseTimes.average)} ms
                  </div>
                  <p className="text-sm text-muted-foreground">
                    P95: {Math.round(responseTimes.p95)} ms
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2 text-gray-400">
                    <Clock className="h-6 w-6 inline mr-2" />
                    Loading...
                  </div>
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
              {methodStats ? (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2">
                    <Activity className="h-6 w-6 inline mr-2" />
                    {methodStats.totalRequests.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {methodStats.period}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2 text-gray-400">
                    <Activity className="h-6 w-6 inline mr-2" />
                    Loading...
                  </div>
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
              {methodStats && methodStats.methods.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2">
                    <AlertTriangle className="h-6 w-6 inline mr-2" />
                    {(methodStats.methods.reduce((sum, method) => sum + method.errorRate * method.count, 0) / 
                      Math.max(methodStats.totalRequests, 1)).toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Across all endpoints
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold mb-2 text-gray-400">
                    <AlertTriangle className="h-6 w-6 inline mr-2" />
                    Loading...
                  </div>
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
              {apiStatus && apiStatus.endpoints.length > 0 ? (
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
                              {Math.round(endpoint.responseTime)} ms
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {endpoint.uptime.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground">No endpoint data available{isLoading ? ", loading..." : ""}</p>
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
              {methodStats && methodStats.methods.length > 0 ? (
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
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">No method data available{isLoading ? ", loading..." : ""}</p>
                </div>
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
              {responseTimes && responseTimes.byEndpoint.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={responseTimes.byEndpoint.map(endpoint => ({
                      name: endpoint.path.split('/').pop(),
                      path: endpoint.path,
                      average: Math.round(endpoint.avg),
                      median: Math.round(endpoint.median),
                      p95: Math.round(endpoint.p95)
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
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">No response time data available{isLoading ? ", loading..." : ""}</p>
                </div>
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

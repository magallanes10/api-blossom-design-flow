
// Monitoring-related routes
module.exports.routes = [
  {
    name: "getApiStatus",
    description: "Get the current status of all API endpoints",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/status",
    handler: (req, res) => {
      // Mock API status data with response times
      const apiStatus = {
        endpoints: [
          { path: "/api/users", status: "healthy", responseTime: 45, uptime: 99.8 },
          { path: "/api/products", status: "healthy", responseTime: 38, uptime: 99.9 },
          { path: "/api/auth/login", status: "healthy", responseTime: 120, uptime: 99.5 },
          { path: "/api/auth/register", status: "degraded", responseTime: 350, uptime: 98.2 }
        ],
        overallHealth: "healthy",
        timestamp: new Date().toISOString()
      };
      
      res.json(apiStatus);
    }
  },
  {
    name: "getMethodStats",
    description: "Get statistics about HTTP method usage",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/methods",
    handler: (req, res) => {
      // Mock HTTP method statistics
      const methodStats = {
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
      
      res.json(methodStats);
    }
  },
  {
    name: "getResponseTimes",
    description: "Get detailed response time metrics",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/response-times",
    handler: (req, res) => {
      // Mock response time data
      const responseTimes = {
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
      
      res.json(responseTimes);
    }
  }
];


// Monitoring-related routes
module.exports.routes = [
  {
    name: "getApiStatus",
    description: "Get the current status of all API endpoints",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/status",
    handler: (req, res) => {
      // In the actual app, this is implemented in api.js with real-time data
      res.json({
        endpoints: [],
        overallHealth: "healthy",
        timestamp: new Date().toISOString()
      });
    }
  },
  {
    name: "getMethodStats",
    description: "Get statistics about HTTP method usage",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/methods",
    handler: (req, res) => {
      // In the actual app, this is implemented in api.js with real-time data
      res.json({
        methods: [],
        totalRequests: 0,
        period: "since server start",
        timestamp: new Date().toISOString()
      });
    }
  },
  {
    name: "getResponseTimes",
    description: "Get detailed response time metrics",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/response-times",
    handler: (req, res) => {
      // In the actual app, this is implemented in api.js with real-time data
      res.json({
        average: 0,
        median: 0,
        p95: 0,
        p99: 0,
        byEndpoint: [],
        period: "since server start",
        timestamp: new Date().toISOString()
      });
    }
  }
];


// Monitoring-related routes
const fs = require('fs');
const path = require('path');

// Initialize request counter
let requestCount = 0;
const requestsFilePath = path.join(__dirname, '..', 'requests.txt');

// Load existing request count if available
try {
  if (fs.existsSync(requestsFilePath)) {
    const data = fs.readFileSync(requestsFilePath, 'utf8');
    const requestObj = JSON.parse(data);
    requestCount = requestObj.count || 0;
  }
} catch (error) {
  console.error('Error loading request count:', error);
}

// Function to update request count
const updateRequestCount = () => {
  requestCount++;
  fs.writeFile(requestsFilePath, JSON.stringify({ count: requestCount }), err => {
    if (err) console.error('Error writing to requests.txt:', err);
  });
  return requestCount;
};

module.exports.routes = [
  {
    name: "getApiStatus",
    description: "Get the current status of all API endpoints",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/status",
    handler: (req, res) => {
      // Update request count for each API call
      updateRequestCount();
      
      // Get real endpoints data from the request tracking in api.js
      const endpoints = Object.keys(req.app.locals.requestStats.endpoints).map(path => {
        const endpoint = req.app.locals.requestStats.endpoints[path];
        return {
          path,
          status: endpoint.status,
          responseTime: endpoint.totalResponseTime / endpoint.count || 0,
          uptime: endpoint.uptime
        };
      });
      
      res.json({
        endpoints,
        overallHealth: endpoints.some(e => e.status === 'down') ? 'down' : 
                      endpoints.some(e => e.status === 'degraded') ? 'degraded' : 'healthy',
        timestamp: new Date().toISOString(),
        totalRequests: requestCount
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
      // Update request count for each API call
      updateRequestCount();
      
      const methods = Object.keys(req.app.locals.requestStats.methods).map(method => {
        const stats = req.app.locals.requestStats.methods[method];
        return {
          method,
          count: stats.count,
          avgResponseTime: stats.count > 0 ? stats.totalResponseTime / stats.count : 0,
          errorRate: Math.random() * 2 // Simulated error rate (would be tracked in real app)
        };
      });
      
      res.json({
        methods,
        totalRequests: requestCount,
        period: `since ${req.app.locals.requestStats.startTime.toISOString()}`,
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
      // Update request count for each API call
      updateRequestCount();
      
      const byEndpoint = Object.keys(req.app.locals.requestStats.endpoints)
        .filter(path => req.app.locals.requestStats.endpoints[path].count > 0)
        .map(path => {
          const endpoint = req.app.locals.requestStats.endpoints[path];
          const avg = endpoint.totalResponseTime / endpoint.count;
          return {
            path,
            avg,
            median: avg * (0.85 + Math.random() * 0.3), // Estimated median
            p95: avg * (1.5 + Math.random()) // Estimated 95th percentile
          };
        });
      
      // Calculate overall stats
      let totalCount = 0;
      let totalResponseTime = 0;
      
      Object.values(req.app.locals.requestStats.methods).forEach(stats => {
        totalCount += stats.count;
        totalResponseTime += stats.totalResponseTime;
      });
      
      const average = totalCount > 0 ? totalResponseTime / totalCount : 0;
      
      res.json({
        average,
        median: average * 0.85, // Estimated median
        p95: average * 2, // Estimated 95th percentile
        p99: average * 3, // Estimated 99th percentile
        byEndpoint,
        period: `since ${req.app.locals.requestStats.startTime.toISOString()}`,
        timestamp: new Date().toISOString(),
        totalRequests: requestCount
      });
    }
  },
  {
    name: "getRequestCount",
    description: "Get the total number of requests",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/requests",
    handler: (req, res) => {
      // Update request count for this API call too
      updateRequestCount();
      
      res.json({
        count: requestCount,
        timestamp: new Date().toISOString()
      });
    }
  },
  {
    name: "pingServer",
    description: "Ping server to check response time",
    category: "Monitoring",
    method: "GET",
    path: "/api/monitoring/ping",
    handler: (req, res) => {
      // Update request count
      updateRequestCount();
      
      // Simple ping response with current timestamp
      res.json({
        status: "ok",
        responseTime: 0, // Client can calculate round-trip time
        timestamp: new Date().toISOString()
      });
    }
  }
];

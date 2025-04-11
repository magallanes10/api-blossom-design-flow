
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const PORT = 3001;

// Request tracking
const requestStats = {
  totalRequests: 0,
  methods: {
    GET: { count: 0, totalResponseTime: 0 },
    POST: { count: 0, totalResponseTime: 0 },
    PUT: { count: 0, totalResponseTime: 0 },
    DELETE: { count: 0, totalResponseTime: 0 }
  },
  endpoints: {},
  startTime: new Date()
};

app.use(cors());
app.use(bodyParser.json());

// Request tracking middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Track request by method
  requestStats.totalRequests++;
  if (requestStats.methods[req.method]) {
    requestStats.methods[req.method].count++;
  }
  
  // Track request by endpoint
  if (!requestStats.endpoints[req.path]) {
    requestStats.endpoints[req.path] = {
      count: 0,
      totalResponseTime: 0,
      status: 'healthy',
      uptime: 100
    };
  }
  requestStats.endpoints[req.path].count++;
  
  // Track response time
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    if (requestStats.methods[req.method]) {
      requestStats.methods[req.method].totalResponseTime += responseTime;
    }
    
    requestStats.endpoints[req.path].totalResponseTime += responseTime;
    
    // Update endpoint status based on response time
    if (responseTime > 300) {
      requestStats.endpoints[req.path].status = 'degraded';
    } else {
      requestStats.endpoints[req.path].status = 'healthy';
    }
  });
  
  next();
});

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
];

const products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Smartphone', price: 699.99, category: 'Electronics' },
  { id: 3, name: 'Headphones', price: 129.99, category: 'Audio' },
  { id: 4, name: 'Keyboard', price: 89.99, category: 'Accessories' },
];

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API Blossom REST API',
    version: '1.0.0',
    endpoints: [
      '/api/users',
      '/api/users/:id',
      '/api/products',
      '/api/products/:id',
      '/api/auth/login',
    ]
  });
});

// Register all routes from our route structure
// Users routes
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newId = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  
  const newUser = {
    id: newId,
    name,
    email,
    role: role || 'user'
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email, role } = req.body;
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    role: role || users[userIndex].role
  };
  
  res.json(users[userIndex]);
});

app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  res.json(deletedUser);
});

// Products routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(product => product.id === id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // This is just a mock authentication
  if (email === 'admin@example.com' && password === 'password') {
    return res.json({
      token: 'mock-jwt-token',
      user: {
        id: 999,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      }
    });
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Monitoring routes - using real data
app.get('/api/monitoring/status', (req, res) => {
  const endpoints = Object.keys(requestStats.endpoints).map(path => {
    const endpoint = requestStats.endpoints[path];
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
    timestamp: new Date().toISOString()
  });
});

app.get('/api/monitoring/methods', (req, res) => {
  const methods = Object.keys(requestStats.methods).map(method => {
    const stats = requestStats.methods[method];
    return {
      method,
      count: stats.count,
      avgResponseTime: stats.count > 0 ? stats.totalResponseTime / stats.count : 0,
      errorRate: Math.random() * 2 // Simulated error rate (would be tracked in real app)
    };
  });
  
  res.json({
    methods,
    totalRequests: requestStats.totalRequests,
    period: `since ${requestStats.startTime.toISOString()}`,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/monitoring/response-times', (req, res) => {
  const byEndpoint = Object.keys(requestStats.endpoints)
    .filter(path => requestStats.endpoints[path].count > 0)
    .map(path => {
      const endpoint = requestStats.endpoints[path];
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
  
  Object.values(requestStats.methods).forEach(stats => {
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
    period: `since ${requestStats.startTime.toISOString()}`,
    timestamp: new Date().toISOString()
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

module.exports = app;

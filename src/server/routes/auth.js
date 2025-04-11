
// Authentication-related routes
module.exports.routes = [
  {
    name: "login",
    description: "Authenticate a user and generate a token",
    category: "Authentication",
    method: "POST",
    path: "/api/auth/login",
    handler: (req, res) => {
      // Handler logic for login
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
    }
  },
  {
    name: "register",
    description: "Register a new user account",
    category: "Authentication",
    method: "POST",
    path: "/api/auth/register",
    handler: (req, res) => {
      // Handler logic for registration
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      
      // Mock registration - in a real app, this would create a new user
      return res.status(201).json({
        user: {
          id: 1000,
          name,
          email,
          role: 'user'
        },
        message: 'User registered successfully'
      });
    }
  }
];

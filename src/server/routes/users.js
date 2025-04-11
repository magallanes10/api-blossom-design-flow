
// User-related routes
module.exports.routes = [
  {
    name: "getAllUsers",
    description: "Get a list of all users in the system",
    category: "Users",
    method: "GET",
    path: "/api/users",
    handler: (req, res) => {
      // Sample user data
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
      ];
      
      res.json(users);
    }
  },
  {
    name: "getUserById",
    description: "Get a specific user by their ID",
    category: "Users",
    method: "GET",
    path: "/api/users/:id",
    handler: (req, res) => {
      const id = parseInt(req.params.id);
      
      // Sample user data
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
      ];
      
      const user = users.find(user => user.id === id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    }
  },
  {
    name: "createUser",
    description: "Create a new user in the system",
    category: "Users",
    method: "POST",
    path: "/api/users",
    handler: (req, res) => {
      const { name, email, role } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
      
      // Mock creating a new user
      const newUser = {
        id: 4, // In a real app this would be generated
        name,
        email,
        role: role || 'user'
      };
      
      res.status(201).json(newUser);
    }
  },
  {
    name: "updateUser",
    description: "Update an existing user's information",
    category: "Users",
    method: "PUT",
    path: "/api/users/:id",
    handler: (req, res) => {
      const id = parseInt(req.params.id);
      const { name, email, role } = req.body;
      
      // Sample user data
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
      ];
      
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const updatedUser = {
        ...users[userIndex],
        name: name || users[userIndex].name,
        email: email || users[userIndex].email,
        role: role || users[userIndex].role
      };
      
      res.json(updatedUser);
    }
  },
  {
    name: "deleteUser",
    description: "Remove a user from the system",
    category: "Users",
    method: "DELETE",
    path: "/api/users/:id",
    handler: (req, res) => {
      const id = parseInt(req.params.id);
      
      // Sample user data
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' },
      ];
      
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // In a real app this would delete from a database
      const deletedUser = users[userIndex];
      res.json(deletedUser);
    }
  }
];

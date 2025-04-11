
// Main routes file that exports all route modules
const usersRoutes = require('./users');
const productsRoutes = require('./products');
const authRoutes = require('./auth');

// Collect all routes in a single object
const routes = {
  users: usersRoutes.routes,
  products: productsRoutes.routes,
  auth: authRoutes.routes
};

module.exports = routes;


// Product-related routes
module.exports.routes = [
  {
    name: "getAllProducts",
    description: "Get a list of all products in the system",
    category: "Products",
    method: "GET",
    path: "/api/products",
    handler: (req, res) => {
      // Handler logic
    }
  },
  {
    name: "getProductById",
    description: "Get a specific product by its ID",
    category: "Products",
    method: "GET",
    path: "/api/products/:id",
    handler: (req, res) => {
      // Handler logic
    }
  }
];

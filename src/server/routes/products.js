
// Product-related routes
module.exports.routes = [
  {
    name: "getAllProducts",
    description: "Get a list of all products in the system",
    category: "Products",
    method: "GET",
    path: "/api/products",
    handler: (req, res) => {
      // Sample product data
      const products = [
        { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
        { id: 2, name: 'Smartphone', price: 699.99, category: 'Electronics' },
        { id: 3, name: 'Headphones', price: 129.99, category: 'Audio' },
        { id: 4, name: 'Keyboard', price: 89.99, category: 'Accessories' },
      ];
      
      res.json(products);
    }
  },
  {
    name: "getProductById",
    description: "Get a specific product by its ID",
    category: "Products",
    method: "GET",
    path: "/api/products/:id",
    handler: (req, res) => {
      const id = parseInt(req.params.id);
      
      // Sample product data
      const products = [
        { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
        { id: 2, name: 'Smartphone', price: 699.99, category: 'Electronics' },
        { id: 3, name: 'Headphones', price: 129.99, category: 'Audio' },
        { id: 4, name: 'Keyboard', price: 89.99, category: 'Accessories' },
      ];
      
      const product = products.find(product => product.id === id);
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(product);
    }
  },
  {
    name: "createProduct",
    description: "Create a new product in the system",
    category: "Products",
    method: "POST",
    path: "/api/products",
    handler: (req, res) => {
      const { name, price, category } = req.body;
      
      if (!name || !price || !category) {
        return res.status(400).json({ error: 'Name, price, and category are required' });
      }
      
      // Mock creating a new product
      const newProduct = {
        id: 5, // In a real app this would be generated
        name,
        price: parseFloat(price),
        category
      };
      
      res.status(201).json(newProduct);
    }
  }
];

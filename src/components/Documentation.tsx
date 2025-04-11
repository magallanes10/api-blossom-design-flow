
import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Documentation = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({
      title: "Code copied to clipboard",
      duration: 3000,
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const installationCode = `# Using npm
npm install express cors body-parser

# Using yarn
yarn add express cors body-parser`;

  const basicServerCode = `const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`;

  const routeHandlerCode = `// GET all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// GET item by ID
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// POST create new item
app.post('/api/items', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const newItem = {
    id: items.length + 1,
    name
  };
  
  items.push(newItem);
  res.status(201).json(newItem);
});`;

  return (
    <div id="documentation" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Documentation
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground">
            Learn how to set up and use your own API server.
          </p>
        </div>

        <div className="space-y-12">
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <h3 className="text-2xl font-bold text-foreground mb-4">Getting Started</h3>
            <Card className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  To create your own REST API server with Express.js, follow these steps. First, you'll need to install the required dependencies:
                </p>
                <div className="relative mt-4">
                  <pre className="code-block">{installationCode}</pre>
                  <button
                    onClick={() => copyToClipboard(installationCode, 0)}
                    className="copy-button"
                    aria-label="Copy code"
                  >
                    {copiedIndex === 0 ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-4">
                  Then create a basic server file (e.g., <code>server.js</code>):
                </p>
                <div className="relative mt-4">
                  <pre className="code-block">{basicServerCode}</pre>
                  <button
                    onClick={() => copyToClipboard(basicServerCode, 1)}
                    className="copy-button"
                    aria-label="Copy code"
                  >
                    {copiedIndex === 1 ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <h3 className="text-2xl font-bold text-foreground mb-4">Creating API Routes</h3>
            <Card className="p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  Once you have your server set up, you can create routes to handle different API endpoints. Here are examples for common CRUD operations:
                </p>
                <div className="relative mt-4">
                  <pre className="code-block">{routeHandlerCode}</pre>
                  <button
                    onClick={() => copyToClipboard(routeHandlerCode, 2)}
                    className="copy-button"
                    aria-label="Copy code"
                  >
                    {copiedIndex === 2 ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-4">
                  These examples cover the basic patterns for creating a RESTful API. You can expand on these patterns to create more complex API endpoints.
                </p>
              </div>
            </Card>
          </div>

          <div className="opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            <h3 className="text-2xl font-bold text-foreground mb-4">Best Practices</h3>
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Use Appropriate HTTP Methods</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>GET for retrieving data</li>
                    <li>POST for creating new resources</li>
                    <li>PUT/PATCH for updating existing resources</li>
                    <li>DELETE for removing resources</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Return Proper Status Codes</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>200: OK</li>
                    <li>201: Created</li>
                    <li>400: Bad Request</li>
                    <li>401: Unauthorized</li>
                    <li>404: Not Found</li>
                    <li>500: Server Error</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Security Considerations</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Validate input data</li>
                    <li>Use HTTPS in production</li>
                    <li>Implement rate limiting</li>
                    <li>Use authentication/authorization</li>
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-semibold mb-2">API Documentation</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    <li>Document all endpoints</li>
                    <li>Include request/response examples</li>
                    <li>Specify required parameters</li>
                    <li>Document error responses</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="group">
            Additional Resources
            <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;

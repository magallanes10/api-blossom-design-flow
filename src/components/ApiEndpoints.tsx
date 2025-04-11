
import { Clipboard, Code, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

interface Endpoint {
  id: string;
  title: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  requestExample: string;
  responseExample: string;
}

const endpoints: Endpoint[] = [
  {
    id: "get-users",
    title: "Get All Users",
    description: "Retrieve a list of all users in the system.",
    method: "GET",
    path: "/api/users",
    requestExample: `fetch('http://localhost:3001/api/users')
  .then(response => response.json())
  .then(data => console.log(data));`,
    responseExample: `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "user"
  }
]`,
  },
  {
    id: "get-user",
    title: "Get User by ID",
    description: "Retrieve a specific user by their ID.",
    method: "GET",
    path: "/api/users/:id",
    requestExample: `fetch('http://localhost:3001/api/users/1')
  .then(response => response.json())
  .then(data => console.log(data));`,
    responseExample: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}`,
  },
  {
    id: "create-user",
    title: "Create User",
    description: "Create a new user in the system.",
    method: "POST",
    path: "/api/users",
    requestExample: `fetch('http://localhost:3001/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New User',
    email: 'newuser@example.com',
    role: 'user'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`,
    responseExample: `{
  "id": 4,
  "name": "New User",
  "email": "newuser@example.com",
  "role": "user"
}`,
  },
  {
    id: "update-user",
    title: "Update User",
    description: "Update an existing user's information.",
    method: "PUT",
    path: "/api/users/:id",
    requestExample: `fetch('http://localhost:3001/api/users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Updated Name',
    email: 'updated@example.com'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`,
    responseExample: `{
  "id": 1,
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin"
}`,
  },
  {
    id: "delete-user",
    title: "Delete User",
    description: "Delete a user from the system.",
    method: "DELETE",
    path: "/api/users/:id",
    requestExample: `fetch('http://localhost:3001/api/users/1', {
  method: 'DELETE'
})
  .then(response => response.json())
  .then(data => console.log(data));`,
    responseExample: `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}`,
  }
];

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste it into your project.",
      duration: 3000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="copy-button"
        aria-label="Copy code"
      >
        {copied ? (
          <span className="text-green-400">Copied!</span>
        ) : (
          <Clipboard className="h-4 w-4" />
        )}
      </button>
      <pre className="code-block">{code}</pre>
    </div>
  );
};

const EndpointCard = ({ endpoint }: { endpoint: Endpoint }) => {
  return (
    <Card className="endpoint-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{endpoint.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <span className={`api-method api-method-${endpoint.method.toLowerCase()}`}>
            {endpoint.method}
          </span>
          <code className="ml-2 px-2 py-1 bg-muted rounded text-sm">{endpoint.path}</code>
        </div>
      </div>

      <Tabs defaultValue="request" className="w-full">
        <TabsList>
          <TabsTrigger value="request">
            <Code className="h-4 w-4 mr-2" />
            Request
          </TabsTrigger>
          <TabsTrigger value="response">
            <AlertCircle className="h-4 w-4 mr-2" />
            Response
          </TabsTrigger>
        </TabsList>
        <TabsContent value="request" className="mt-4">
          <CodeBlock code={endpoint.requestExample} language="javascript" />
        </TabsContent>
        <TabsContent value="response" className="mt-4">
          <CodeBlock code={endpoint.responseExample} language="json" />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const ApiEndpoints = () => {
  return (
    <div id="endpoints" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            API Endpoints
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground">
            Explore the available endpoints and how to use them.
          </p>
        </div>

        <div className="grid gap-8">
          {endpoints.map((endpoint, index) => (
            <div key={endpoint.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}>
              <EndpointCard endpoint={endpoint} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline">
            View All Endpoints
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiEndpoints;

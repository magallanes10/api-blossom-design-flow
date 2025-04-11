
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Endpoint {
  id: string;
  title: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  active: boolean;
}

const endpoints: Endpoint[] = [
  {
    id: "get-users",
    title: "Get All Users",
    description: "Retrieve a list of all users in the system.",
    method: "GET",
    path: "/api/users",
    active: true,
  },
  {
    id: "get-user",
    title: "Get User by ID",
    description: "Retrieve a specific user by their ID.",
    method: "GET",
    path: "/api/users/:id",
    active: true,
  },
  {
    id: "create-user",
    title: "Create User",
    description: "Create a new user in the system.",
    method: "POST",
    path: "/api/users",
    active: true,
  },
  {
    id: "update-user",
    title: "Update User",
    description: "Update an existing user's information.",
    method: "PUT",
    path: "/api/users/:id",
    active: true,
  },
  {
    id: "delete-user",
    title: "Delete User",
    description: "Delete a user from the system.",
    method: "DELETE",
    path: "/api/users/:id",
    active: true,
  }
];

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

      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <Badge variant={endpoint.active ? "success" : "destructive"} className="mr-2">
            {endpoint.active ? "Active" : "Inactive"}
          </Badge>
          {endpoint.active ? (
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className="text-sm text-muted-foreground">
            {endpoint.active 
              ? "This endpoint is currently available" 
              : "This endpoint is currently unavailable"}
          </span>
        </div>
      </div>
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

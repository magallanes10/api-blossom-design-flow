
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Endpoint {
  id: string;
  title: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  active: boolean;
  category?: string;
}

interface RouteStructure {
  [category: string]: {
    routes: {
      name: string;
      description: string;
      category: string;
      method: "GET" | "POST" | "PUT" | "DELETE";
      path: string;
      handler: Function;
    }[];
  };
}

const EndpointCard = ({ endpoint }: { endpoint: Endpoint }) => {
  return (
    <Card className="endpoint-card p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{endpoint.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <span className={`api-method api-method-${endpoint.method.toLowerCase()} px-3 py-1 rounded-md text-white font-medium text-sm ${
            endpoint.method === "GET" ? "bg-green-500" :
            endpoint.method === "POST" ? "bg-blue-500" :
            endpoint.method === "PUT" ? "bg-amber-500" :
            "bg-red-500"
          }`}>
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
      
      {endpoint.category && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            {endpoint.category}
          </Badge>
        </div>
      )}
    </Card>
  );
};

const ApiEndpoints = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, boolean>>({});
  const [methodFilters, setMethodFilters] = useState<Record<string, boolean>>({
    GET: true,
    POST: true,
    PUT: true,
    DELETE: true
  });

  useEffect(() => {
    // This would normally be an API call to get the routes
    // For now, we'll transform the static routes data from server/routes
    const fetchEndpoints = async () => {
      try {
        // Import routes data (this would be an API call in production)
        const routes = await import('../server/routes/index.js');
        
        const allEndpoints: Endpoint[] = [];
        const categories: Record<string, boolean> = {};
        
        // Process all routes from each category
        Object.entries(routes.default).forEach(([category, routeModule]) => {
          const routeData = routeModule as RouteStructure[string];
          
          categories[category] = true;
          
          if (routeData.routes && Array.isArray(routeData.routes)) {
            routeData.routes.forEach(route => {
              allEndpoints.push({
                id: route.name,
                title: route.name.split(/(?=[A-Z])/).join(' '),
                description: route.description || `${route.method} operation for ${route.path}`,
                method: route.method,
                path: route.path,
                active: Math.random() > 0.2, // Random active state for demo
                category: route.category || category
              });
            });
          }
        });
        
        // If no endpoints from routes, use the fallback data
        if (allEndpoints.length === 0) {
          setEndpoints([
            {
              id: "get-users",
              title: "Get All Users",
              description: "Retrieve a list of all users in the system.",
              method: "GET",
              path: "/api/users",
              active: true,
              category: "Users"
            },
            {
              id: "get-user",
              title: "Get User by ID",
              description: "Retrieve a specific user by their ID.",
              method: "GET",
              path: "/api/users/:id",
              active: true,
              category: "Users"
            },
            {
              id: "create-user",
              title: "Create User",
              description: "Create a new user in the system.",
              method: "POST",
              path: "/api/users",
              active: true,
              category: "Users"
            },
            {
              id: "update-user",
              title: "Update User",
              description: "Update an existing user's information.",
              method: "PUT",
              path: "/api/users/:id",
              active: true,
              category: "Users"
            },
            {
              id: "delete-user",
              title: "Delete User",
              description: "Delete a user from the system.",
              method: "DELETE",
              path: "/api/users/:id",
              active: true,
              category: "Users"
            }
          ]);
          
          setCategoryFilters({ Users: true });
        } else {
          setEndpoints(allEndpoints);
          setCategoryFilters(categories);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading endpoints:", error);
        setLoading(false);
      }
    };

    fetchEndpoints();
  }, []);

  const filteredEndpoints = endpoints.filter(endpoint => {
    const categoryPass = categoryFilters[endpoint.category || ""] !== false;
    const methodPass = methodFilters[endpoint.method] !== false;
    return categoryPass && methodPass;
  });

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleMethodFilter = (method: string) => {
    setMethodFilters(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  // Get unique categories
  const categories = [...new Set(endpoints.map(e => e.category || "Uncategorized"))];

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

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={categoryFilters[category] !== false}
                    onCheckedChange={() => toggleCategoryFilter(category)}
                  />
                  <label 
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-2">Methods</h3>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="method-get" 
                  checked={methodFilters.GET !== false}
                  onCheckedChange={() => toggleMethodFilter("GET")}
                />
                <label 
                  htmlFor="method-get"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  GET
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="method-post" 
                  checked={methodFilters.POST !== false}
                  onCheckedChange={() => toggleMethodFilter("POST")}
                />
                <label 
                  htmlFor="method-post"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  POST
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="method-put" 
                  checked={methodFilters.PUT !== false}
                  onCheckedChange={() => toggleMethodFilter("PUT")}
                />
                <label 
                  htmlFor="method-put"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  PUT
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="method-delete" 
                  checked={methodFilters.DELETE !== false}
                  onCheckedChange={() => toggleMethodFilter("DELETE")}
                />
                <label 
                  htmlFor="method-delete"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  DELETE
                </label>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading endpoints...</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredEndpoints.map((endpoint, index) => (
              <div key={endpoint.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}>
                <EndpointCard endpoint={endpoint} />
              </div>
            ))}
          </div>
        )}

        {!loading && filteredEndpoints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No endpoints match your filters.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline">
            View API Documentation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApiEndpoints;
